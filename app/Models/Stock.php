<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Stock extends Model
{
    protected $fillable = ['product_id', 'quantity', 'reorder_level'];

    protected $appends = ['status', 'status_color'];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function getStatusAttribute()
    {
        if ($this->quantity > $this->reorder_level) {
            return 'No Need to Order';
        }

        if ($this->quantity == $this->reorder_level) {
            return 'Ready to Order';
        }

        return 'Reorder Needed';
    }

    public function getStatusColorAttribute()
    {
        if ($this->quantity > $this->reorder_level) return 'green';
        if ($this->quantity == $this->reorder_level) return 'yellow';
        return 'red';
    }
}
