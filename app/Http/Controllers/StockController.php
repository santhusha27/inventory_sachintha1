<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Stock;
use App\Models\User;
use App\Notifications\LowStockAlertNotification;
use App\Models\Product;
use Inertia\Inertia;

class StockController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('stocks/index', [
            'stocks' => Stock::with('product')->get()
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
        //
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
    public function update(Request $request, Stock $stock)
    {

        $request->validate([

            'quantity' => 'required|integer|min:0',

        ]);



        // Update stock quantity

        $stock->update([

            'quantity' => $request->quantity,

        ]);



        // Low Stock Check

        if($stock->quantity <= $stock->product->reorder_level)
        {

            // Get Admin users
            $admins = User::where('role_id', 1)->get();



            foreach($admins as $admin)
            {

                $admin->notify(

                    new LowStockAlertNotification(
                        $stock->product
                    )

                );

            }

        }
        
         return redirect()
            ->back()
            ->with(
                'success',
                'Stock updated successfully'
            );

    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
