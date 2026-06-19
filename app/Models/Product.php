<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'supplier_id',
        'name',
        'sku',
        'category_id',
        'cost_price',
        'unit_price',
        'reorder_level',
        'description',
        'status'
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function stock()
    {
        return $this->hasOne(Stock::class);
    }

    public function sale()
    {
        return $this->hasMany(Sale::class);
    }

    public function purchaseItems()
    {
        return $this->hasMany(PurchaseItem::class);
    }
    public function supplier()
    {
        return $this->belongsTo(Supplier::class);

    }

}
