<?php

use App\Models\User;
use App\Models\Role;
use App\Models\Category;
use App\Models\Supplier;
use App\Models\Product;
use App\Models\Stock;
use App\Models\Purchase;
use App\Models\Sale;

beforeEach(function () {
    // Seed roles
    $this->adminRole = Role::create(['role_name' => 'admin']);
    $this->user = User::factory()->create(['role_id' => $this->adminRole->id]);

    // Setup Category, Suppliers and Products
    $this->category = Category::create(['name' => 'Electronics']);
    
    $this->supplierA = Supplier::create([
        'name' => 'Supplier A',
        'email' => 'supplierA@example.com',
        'phone' => '111111',
        'address' => 'Addr A'
    ]);
    
    $this->supplierB = Supplier::create([
        'name' => 'Supplier B',
        'email' => 'supplierB@example.com',
        'phone' => '222222',
        'address' => 'Addr B'
    ]);

    $this->productA = Product::create([
        'supplier_id' => $this->supplierA->id,
        'name' => 'Product A',
        'sku' => 'PROD-A',
        'category_id' => $this->category->id,
        'cost_price' => 100,
        'unit_price' => 150,
        'reorder_level' => 5
    ]);

    $this->productB = Product::create([
        'supplier_id' => $this->supplierB->id,
        'name' => 'Product B',
        'sku' => 'PROD-B',
        'category_id' => $this->category->id,
        'cost_price' => 200,
        'unit_price' => 250,
        'reorder_level' => 5
    ]);

    // Initialize stocks
    $this->stockA = Stock::create([
        'product_id' => $this->productA->id,
        'quantity' => 10,
        'reorder_level' => 5
    ]);

    $this->stockB = Stock::create([
        'product_id' => $this->productB->id,
        'quantity' => 20,
        'reorder_level' => 5
    ]);
});

/* =========================================================================
   PURCHASE (STOCK IN) TESTS
   ========================================================================= */

test('purchase successfully increments stock quantity', function () {
    $this->actingAs($this->user);

    $purchaseData = [
        'supplier_id' => $this->supplierA->id,
        'items' => [
            [
                'product_id' => $this->productA->id,
                'quantity' => 5,
            ]
        ]
    ];

    $response = $this->post(route('purchases.store'), $purchaseData);
    $response->assertRedirect();

    // Verify stock is incremented: 10 + 5 = 15
    $this->stockA->refresh();
    expect($this->stockA->quantity)->toBe(15);

    // Verify purchase record exists
    $this->assertDatabaseHas('purchases', [
        'supplier_id' => $this->supplierA->id,
        'total_amount' => 500.00, // 5 * 100 cost_price
    ]);
});

test('purchase fails if product does not belong to selected supplier', function () {
    $this->actingAs($this->user);

    $purchaseData = [
        'supplier_id' => $this->supplierA->id,
        'items' => [
            [
                'product_id' => $this->productB->id, // Belongs to supplierB
                'quantity' => 5,
            ]
        ]
    ];

    $response = $this->post(route('purchases.store'), $purchaseData);
    $response->assertSessionHas('error');

    // Verify stock did not change
    $this->stockB->refresh();
    expect($this->stockB->quantity)->toBe(20);
});

test('deleting a purchase decrements the stock', function () {
    $this->actingAs($this->user);

    // Manually create purchase and item
    $purchase = Purchase::create([
        'supplier_id' => $this->supplierA->id,
        'user_id' => $this->user->id,
        'grn_number' => 'GRN-TEST',
        'total_amount' => 500,
        'purchase_date' => now(),
    ]);

    $purchase->items()->create([
        'product_id' => $this->productA->id,
        'quantity' => 5,
        'unit_price' => 100,
        'total_price' => 500,
    ]);

    // Initial stock is 10 (manually set in beforeEach). Since this was created manually,
    // we assume it is the post-purchase state. Deleting it should decrement it to 5.
    $response = $this->delete(route('purchases.destroy', $purchase->id));
    $response->assertRedirect();

    $this->stockA->refresh();
    expect($this->stockA->quantity)->toBe(5);
});

/* =========================================================================
   SALE (STOCK OUT) TESTS
   ========================================================================= */

test('sale successfully decrements stock quantity', function () {
    $this->actingAs($this->user);

    $saleData = [
        'items' => [
            [
                'product_id' => $this->productA->id,
                'quantity' => 4,
            ]
        ]
    ];

    $response = $this->post(route('sales.store'), $saleData);
    $response->assertRedirect();

    // Verify stock is decremented: 10 - 4 = 6
    $this->stockA->refresh();
    expect($this->stockA->quantity)->toBe(6);

    // Verify sale record exists
    $this->assertDatabaseHas('sales', [
        'total_amount' => 600.00, // 4 * 150 unit_price
    ]);
});

test('sale fails if stock is insufficient', function () {
    $this->actingAs($this->user);

    $saleData = [
        'items' => [
            [
                'product_id' => $this->productA->id,
                'quantity' => 15, // Available is only 10
            ]
        ]
    ];

    $response = $this->post(route('sales.store'), $saleData);
    $response->assertSessionHas('error');

    // Verify stock did not change
    $this->stockA->refresh();
    expect($this->stockA->quantity)->toBe(10);
});

test('sale fails if product unit price is not set', function () {
    $this->actingAs($this->user);

    // Set unit price to 0
    $this->productA->update(['unit_price' => 0]);

    $saleData = [
        'items' => [
            [
                'product_id' => $this->productA->id,
                'quantity' => 1,
            ]
        ]
    ];

    $response = $this->post(route('sales.store'), $saleData);
    $response->assertSessionHas('error');

    // Verify stock did not change
    $this->stockA->refresh();
    expect($this->stockA->quantity)->toBe(10);
});

test('deleting a sale restores stock quantity', function () {
    $this->actingAs($this->user);

    $sale = Sale::create([
        'user_id' => $this->user->id,
        'total_amount' => 600,
        'sale_date' => now(),
    ]);

    $sale->items()->create([
        'product_id' => $this->productA->id,
        'quantity' => 4,
        'unit_price' => 150,
        'total_price' => 600,
    ]);

    // Stock is 10. Deleting the sale of 4 should increment stock back to 14.
    $response = $this->delete(route('sales.destroy', $sale->id));
    $response->assertRedirect();

    $this->stockA->refresh();
    expect($this->stockA->quantity)->toBe(14);
});
