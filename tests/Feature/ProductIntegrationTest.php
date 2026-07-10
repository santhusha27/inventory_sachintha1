<?php

use App\Models\User;
use App\Models\Role;
use App\Models\Category;
use App\Models\Supplier;
use App\Models\Product;
use App\Models\Stock;

beforeEach(function () {
    // Seed roles
    $this->adminRole = Role::create(['role_name' => 'admin']);
    $this->storekeeperRole = Role::create(['role_name' => 'storekeeper']);
    $this->staffRole = Role::create(['role_name' => 'staff']);

    // Create a category and supplier
    $this->category = Category::create(['name' => 'Electronics']);
    $this->supplier = Supplier::create([
        'name' => 'Acme Corp',
        'email' => 'acme@example.com',
        'phone' => '123456',
        'address' => '123 Main St'
    ]);
});

test('guests are redirected from product routes', function () {
    $this->get(route('products.index'))->assertRedirect(route('login'));
});

test('staff users cannot access product management', function () {
    $staff = User::factory()->create(['role_id' => $this->staffRole->id]);

    $this->actingAs($staff);

    // Try to view products
    $this->get(route('products.index'))->assertStatus(403);

    // Try to create product
    $this->post(route('products.store'), [])->assertStatus(403);
});

test('storekeeper users can view and create products', function () {
    $storekeeper = User::factory()->create(['role_id' => $this->storekeeperRole->id]);

    $this->actingAs($storekeeper);

    $this->get(route('products.index'))->assertOk();

    // Create a product
    $productData = [
        'supplier_id' => $this->supplier->id,
        'name' => 'Test Laptop',
        'sku' => 'LAP-001',
        'category_id' => $this->category->id,
        'cost_price' => 800.00,
        'unit_price' => 1000.00,
        'reorder_level' => 5
    ];

    $response = $this->post(route('products.store'), $productData);
    $response->assertRedirect();

    $this->assertDatabaseHas('products', [
        'name' => 'Test Laptop',
        'sku' => 'LAP-001'
    ]);

    // Check that stock was initialized to 0
    $product = Product::where('sku', 'LAP-001')->first();
    $this->assertDatabaseHas('stocks', [
        'product_id' => $product->id,
        'quantity' => 0,
        'reorder_level' => 5
    ]);
});

test('admin users can delete products', function () {
    $admin = User::factory()->create(['role_id' => $this->adminRole->id]);
    
    $product = Product::create([
        'supplier_id' => $this->supplier->id,
        'name' => 'Old Phone',
        'sku' => 'PHN-999',
        'category_id' => $this->category->id,
        'cost_price' => 200,
        'unit_price' => 300,
        'reorder_level' => 3
    ]);

    $this->actingAs($admin);

    $response = $this->delete(route('products.destroy', $product->id));
    $response->assertRedirect();

    $this->assertDatabaseMissing('products', ['id' => $product->id]);
});
