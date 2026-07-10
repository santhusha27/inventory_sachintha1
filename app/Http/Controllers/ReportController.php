<?php

namespace App\Http\Controllers;

use App\Models\Sale;
use App\Models\Purchase;
use App\Models\Stock;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReportController extends Controller
{

    /**
     * Display all reports
     */
    public function index()
    {

        return Inertia::render('reports/index', [

            // Sales Reports
            'sales' => Sale::latest()
                ->get(),


            // Purchase Reports
            'purchases' => Purchase::latest()
                ->get(),


            // Stock Reports
            'stocks' => Stock::with('product')
                ->get(),

        ]);

    }





    /**
     * Custom Date Sales Report
     */
    public function custom(Request $request)
    {

        $request->validate([

            'from' => 'required|date',

            'to' => 'required|date|after_or_equal:from',

        ]);



        $sales = Sale::whereBetween('sale_date', [

                $request->from,

                $request->to

            ])
            ->latest()
            ->get();



        return Inertia::render('reports/index', [

            'sales' => $sales,


            'purchases' => Purchase::latest()
                ->get(),


            'stocks' => Stock::with('product')
                ->get(),

        ]);

    }

}