<?php

namespace App\Http\Controllers;

use App\Models\Sale;
use App\Models\Product;
use App\Models\Stock;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Notifications\NewSaleNotification;
use App\Notifications\LowStockAlertNotification;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Barryvdh\DomPDF\Facade\Pdf;

class SaleController extends Controller
{
    public function index()
    {
        $sales = Sale::with('user')->latest()->get();

        $products = Product::with('stock')
            ->select('id', 'name', 'unit_price')
            ->get();

        return Inertia::render('sales/index', [
            'sales' => $sales,
            'products' => $products,
        ]);
    }


    public function store(Request $request)
    {
        $request->validate([
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);


        try {

            $sale = null;


            DB::transaction(function () use ($request, &$sale) {

                $grandTotal = 0;

                $sale = Sale::create([
                    'user_id' => Auth::id(),
                    'total_amount' => 0,
                    'sale_date' => now(),
                ]);

                foreach ($request->items as $item) {
                    // Retrieve the selected product details using the product ID
                    $product = Product::findOrFail($item['product_id']);
                    // to prevent incorrect stock updates from simultaneous sales
                    $stock = Stock::where('product_id',$product->id)
                    ->lockForUpdate()
                    ->first();
                     // Check whether stock exists and available quantity is greater than zero
                    if (!$stock || $stock->quantity <= 0) {
                        throw new \Exception('Cannot do sale. Stock is zero for product: '.$product->name);
                    }
                     // Validate whether sufficient stock is available for the requested quantity
                    if ($stock->quantity < $item['quantity']) {
                        throw new \Exception('Not enough stock for product: '.$product->name);
                    }
                    // Ensure that a valid selling price is available
                    if (!$product->unit_price || $product->unit_price <= 0) {
                        throw new \Exception('Cannot do sale. Unit price is not set for product: '.$product->name);
                    }
                     // Retrieve the product selling price
                    $unitPrice = $product->unit_price;
                      // Calculate the total price for the current sale item
                    $lineTotal = $unitPrice * $item['quantity'];
                    // Add item total to the overall sale amount
                    $grandTotal += $lineTotal;

                    // Create sale item
                    $sale->items()->create([
                        'product_id' => $product->id,
                        'quantity' => $item['quantity'],
                        'unit_price' => $unitPrice,
                        'total_price' => $lineTotal,
                    ]);

                    // Reduce stock
                    $stock->decrement('quantity',$item['quantity']);



                    /*
                    |--------------------------------------------------------------------------
                    | Low Stock Notification
                    |--------------------------------------------------------------------------
                    */


                    $stock->refresh();



                    if(
                        $stock->quantity <=
                        $product->reorder_level
                    )
                    {


                        $admins = User::where(
                            'role_id',
                            1
                        )->get();



                        foreach($admins as $admin)
                        {

                            $admin->notify(

                                new LowStockAlertNotification(
                                    $product
                                )

                            );

                        }

                    }



                }



                $sale->update([

                    'total_amount' => $grandTotal,

                ]);


            });



            /*
            |--------------------------------------------------------------------------
            | New Sale Notification
            |--------------------------------------------------------------------------
            */


            $admins = User::where(
                'role_id',
                1
            )->get();



            foreach($admins as $admin)
            {

                $admin->notify(

                    new NewSaleNotification($sale)

                );

            }



            return redirect()
                ->route('sales.index')
                ->with(
                    'success',
                    'Sale completed successfully.'
                );



        } catch (\Exception $e) {


            return redirect()
                ->route('sales.index')
                ->with(
                    'error',
                    $e->getMessage()
                );

        }

    }





    public function invoice($id)
    {
        $sale = Sale::with([
            'items.product',
            'user'
        ])->findOrFail($id);


        return Inertia::render('sales/invoice', [
            'sale' => $sale,
        ]);
    }





    public function invoicePdf($id)
    {
        $sale = Sale::with([
            'items.product',
            'user'
        ])->findOrFail($id);


        $pdf = Pdf::loadView(
            'pdf.sales-invoice',
            [
                'sale'=>$sale
            ]
        );


        return $pdf->stream(
            'invoice-'.$sale->id.'.pdf'
        );
    }





    public function destroy($id)
    {

        $sale = Sale::with('items')
            ->findOrFail($id);



        DB::transaction(function () use ($sale) {


            foreach($sale->items as $item)
            {

                $stock = Stock::where(
                    'product_id',
                    $item->product_id
                )->first();



                if($stock)
                {

                    $stock->increment(
                        'quantity',
                        $item->quantity
                    );

                }

            }



            $sale->delete();


        });



        return redirect()
            ->route('sales.index')
            ->with(
                'success',
                'Sale deleted and stock restored.'
            );

    }
}