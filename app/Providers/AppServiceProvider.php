<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;
use App\Models\Product;
use App\Models\Stock;
use App\Models\Sale;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Inertia::share([
        'stats' => [
            'products' => Product::count(),
            'lowStock' => Stock::whereColumn('quantity', '<=', 'reorder_level')->count(),
            'sales' => Sale::sum('total_amount'),
        ]
     ]);

        Inertia::share([
            'auth' => fn () => [
                'user' => auth()->user(),
                'role' => auth()->user()?->role?->role_name,
            ],
        ]);

        Inertia::share([

        'notifications' => function(){

            if(auth()->check())
            {

                return auth()
                    ->user()
                    ->notifications()
                    ->latest()
                    ->take(10)
                    ->get();

            }


            return [];

        }

    ]);


    }
}
