<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use App\Models\Stock;
use App\Models\Supplier;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('products/index', [
            'products' => Product::with('category', 'stock', 'supplier')->get(),
            'categories' => Category::all(),
            'suppliers' => Supplier::all(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
          $validated = $request->validate([
            'supplier_id' => 'required|exists:suppliers,id',
            'name' => 'required',
            'sku' => 'required|unique:products',
            'category_id' => 'required|exists:categories,id',
            'cost_price' => 'required|numeric',
            'unit_price' => 'required|numeric',
            'reorder_level' => 'required|integer'
        ]);

        $product = Product::create($validated);

        Stock::create([
            'product_id' => $product->id,
            'quantity' => 0,
            'reorder_level' => $product->reorder_level
        ]);

        return redirect()->back()->with('success', 'Product created');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $product = Product::findOrFail($id);
        $product->update($request->all());

        if ($product->stock) {
            $product->stock->update([
                'reorder_level' => $product->reorder_level
            ]);
        }


        return redirect()->back()->with('success', 'Product updated');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $product = Product::findOrFail($id);
       $product->delete();
        return redirect()->back()->with('success', 'Product deleted');
    }
}
