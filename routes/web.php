<?php

use App\Http\Controllers\UserController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\StockController;
use App\Http\Controllers\PurchaseController;
use App\Http\Controllers\SaleController;
use App\Http\Controllers\ReportController;
use App\Models\Product;
use App\Models\Stock;
use App\Models\Supplier;
use App\Models\Purchase;
use App\Models\Sale;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('dashboard', function () {
        $totalProducts = Product::count();
        $totalSuppliers = Supplier::count();

        $lowStock = Stock::whereColumn('quantity', '<=', 'reorder_level')->count();
        $outOfStock = Stock::where('quantity', '<=', 0)->count();

        $stockValue = Stock::with('product')->get()->sum(function ($stock) {
            return $stock->quantity * ($stock->product->cost_price ?? 0);
        });

        $totalPurchases = Purchase::count();
        $totalSales = Sale::count();
        $totalIncome = Sale::sum('total_amount');

        $chartStocks = Stock::with('product')
            ->orderBy('quantity', 'desc')
            ->take(4)
            ->get()
            ->map(function ($stock) {
                return [
                    'name' => $stock->product->name ?? 'Unknown',
                    'quantity' => $stock->quantity,
                ];
            });

        return Inertia::render('dashboard', [
            'stats' => [
                'totalProducts' => $totalProducts,
                'lowStock' => $lowStock,
                'outOfStock' => $outOfStock,
                'totalSuppliers' => $totalSuppliers,
                'stockValue' => $stockValue,
                'totalPurchases' => $totalPurchases,
                'totalSales' => $totalSales,
                'totalIncome' => $totalIncome,
            ],
            'chartStocks' => $chartStocks,
        ]);
    })->name('dashboard');
   

    // Users (Admin)
   Route::middleware('role:admin')->group(function () {
        Route::get('/users', [UserController::class, 'index'])->name('users.index');
        Route::post('/users', [UserController::class, 'store'])->name('users.store');
        Route::put('/users/{id}', [UserController::class, 'update'])->name('users.update');
        Route::delete('/users/{id}', [UserController::class, 'destroy'])->name('users.destroy');
         // Roles (Admin)
        Route::get('/roles', [RoleController::class, 'index'])->name('roles.index');
    });

    // Categories
    Route::middleware('role:admin,storekeeper')->group(function () {
        Route::get('/categories', [CategoryController::class, 'index'])->name('categories.index');
        Route::post('/categories', [CategoryController::class, 'store'])->name('categories.store');
        Route::put('/categories/{id}', [CategoryController::class, 'update'])->name('categories.update');
        Route::delete('/categories/{id}', [CategoryController::class, 'destroy'])->name('categories.destroy');
    });
    // Products
    Route::get('/products', [ProductController::class, 'index'])
        ->middleware('role:admin,storekeeper,staff')
        ->name('products.index');

    Route::middleware('role:admin,storekeeper')->group(function () {
        Route::post('/products', [ProductController::class, 'store'])->name('products.store');
        Route::put('/products/{id}', [ProductController::class, 'update'])->name('products.update');
        Route::delete('/products/{id}', [ProductController::class, 'destroy'])->name('products.destroy');
    });
    // Suppliers
    Route::middleware('role:admin,storekeeper')->group(function () {
        Route::get('/suppliers', [SupplierController::class, 'index'])->name('suppliers.index');
        Route::post('/suppliers', [SupplierController::class, 'store'])->name('suppliers.store');
        Route::put('/suppliers/{id}', [SupplierController::class, 'update'])->name('suppliers.update');
        Route::delete('/suppliers/{id}', [SupplierController::class, 'destroy'])->name('suppliers.destroy');
    });
    // Stock (View Only)
    Route::middleware('role:admin,storekeeper,staff')->group(function () {
        Route::get('/stocks', [StockController::class, 'index'])->name('stocks.index');
    });
    // Purchases (Stock IN)
    Route::middleware('role:admin,storekeeper')->group(function () {
        Route::get('/purchases', [PurchaseController::class, 'index'])->name('purchases.index');
        Route::post('/purchases', [PurchaseController::class, 'store'])->name('purchases.store');
        Route::get('/purchases/{id}/grn', [PurchaseController::class, 'show'])->name('purchases.grn');
        Route::post('/purchases/{id}/email-grn', [PurchaseController::class, 'emailGrn'])->name('purchases.emailGrn');
        Route::delete('/purchases/{id}', [PurchaseController::class, 'destroy'])->name('purchases.destroy');
    });
    // Sales (Stock OUT)
    Route::middleware('role:admin,staff')->group(function () {
        Route::get('/sales', [SaleController::class, 'index'])->name('sales.index');
        Route::post('/sales', [SaleController::class, 'store'])->name('sales.store');
        Route::get('/sales/{id}/invoice', [SaleController::class, 'invoice'])->name('sales.invoice');    
        Route::delete('/sales/{id}', [SaleController::class, 'destroy'])->name('sales.destroy');
        Route::get('/sales/{id}/invoice-pdf', [SaleController::class, 'invoicePdf'])->name('sales.invoicePdf');
    });
    

   
   

        // Main Reports Page
        Route::get('/reports', [ReportController::class, 'index'])->name('reports.index');
        // Custom Date Sales Report
        Route::get('/reports/custom', [ReportController::class, 'custom'])->name('reports.custom');



});

    
   




require __DIR__.'/settings.php';
