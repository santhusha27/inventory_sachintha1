<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class LowStockAlertNotification extends Notification
{
    use Queueable;


    public function __construct(
        public $product
    )
    {

    }



    public function via($notifiable)
    {
        return [
            'database'
        ];
    }



    public function toDatabase($notifiable)
    {

        return [

            'type' => 'low_stock',

            'title' => 'Low Stock Alert',

            'message' =>
                $this->product->name .
                ' stock is below reorder level.',


            'product_id' =>
                $this->product->id,


        ];

    }

}