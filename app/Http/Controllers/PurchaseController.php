<?php

namespace App\Http\Controllers;

use App\Mail\PurchaseGrnMail;
use App\Models\Product;
use App\Models\Purchase;
use App\Models\Stock;
use App\Models\Supplier;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class PurchaseController extends Controller
{
    public function index()
    {
        return Inertia::render('purchases/index', [

            'purchases' => Purchase::with([
                'supplier',
                'user',
                'items.product',
            ])->latest()->get(),

            'suppliers' => Supplier::all(),

            'products' => Product::select(
                'id',
                'supplier_id',
                'name',
                'cost_price'
            )->get(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([

            'supplier_id' => 'required|exists:suppliers,id',

            'items' => 'required|array|min:1',

            'items.*.product_id' => 'required|exists:products,id',

            'items.*.quantity' => 'required|integer|min:1',
        ]);

        try {

            DB::transaction(function () use ($request) {

                $grandTotal = 0;

                $purchase = Purchase::create([

                    'supplier_id' => $request->supplier_id,

                    'user_id' => Auth::id(),

                    'grn_number' =>
                        'GRN-' . now()->format('YmdHis'),

                    'total_amount' => 0,

                    'purchase_date' => now(),
                ]);

                foreach ($request->items as $item) {

                    $product = Product::findOrFail(
                        $item['product_id']
                    );

                    // CHECK PRODUCT BELONGS TO SUPPLIER
                    if (
                        (int) $product->supplier_id !==
                        (int) $request->supplier_id
                    ) {

                        throw new \Exception(
                            'Selected product does not belong to selected supplier.'
                        );
                    }

                    // UNIT PRICE FROM PRODUCT COST PRICE
                    $unitPrice = $product->cost_price;

                    $lineTotal =
                        $item['quantity'] * $unitPrice;

                    $grandTotal += $lineTotal;

                    $purchase->items()->create([

                        'product_id' => $product->id,

                        'quantity' => $item['quantity'],

                        'unit_price' => $unitPrice,

                        'total_price' => $lineTotal,
                    ]);

                    // STOCK UPDATE
                    $stock = Stock::firstOrCreate(
                        ['product_id' => $product->id],
                        [
                            'quantity' => 0,
                            'reorder_level' => 10,
                        ]
                    );

                    $stock->increment(
                        'quantity',
                        $item['quantity']
                    );
                }

                $purchase->update([
                    'total_amount' => $grandTotal,
                ]);
            });

            return redirect()
                ->route('purchases.index')
                ->with(
                    'success',
                    'Purchase created successfully.'
                );

        } catch (\Exception $e) {

            return redirect()
                ->route('purchases.index')
                ->with(
                    'error',
                    $e->getMessage()
                );
        }
    }

    public function show($id)
    {
        $purchase = Purchase::with([
            'supplier',
            'user',
            'items.product',
        ])->findOrFail($id);

        return Inertia::render('purchases/grn', [
            'purchase' => $purchase,
        ]);
    }

    public function emailGrn($id)
    {
        $purchase = Purchase::with([
            'supplier',
            'user',
            'items.product',
        ])->findOrFail($id);

        if (
            !$purchase->supplier ||
            !$purchase->supplier->email
        ) {

            return back()->with(
                'error',
                'Supplier email not found.'
            );
        }

        Mail::to(
            $purchase->supplier->email
        )->send(
            new PurchaseGrnMail($purchase)
        );

        return back()->with(
            'success',
            'GRN emailed successfully.'
        );
    }

    public function destroy($id)
    {
        $purchase = Purchase::with('items')
            ->findOrFail($id);

        DB::transaction(function () use ($purchase) {

            foreach ($purchase->items as $item) {

                $stock = Stock::where(
                    'product_id',
                    $item->product_id
                )->first();

                if ($stock) {

                    $stock->decrement(
                        'quantity',
                        $item->quantity
                    );
                }
            }

            $purchase->delete();
        });

        return redirect()
            ->route('purchases.index')
            ->with(
                'success',
                'Purchase deleted successfully.'
            );
    }
}