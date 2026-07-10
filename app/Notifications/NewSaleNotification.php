<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class NewSaleNotification extends Notification
{
    use Queueable;



    public function __construct(
        public $sale
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

            'type' => 'new_sale',

            'title' => 'New Sale Completed',


            'message' =>
                'New sale completed. Sale ID: '
                . $this->sale->id
                .
                ' Total Amount: Rs. '
                .
                $this->sale->total_amount,



            'sale_id' =>
                $this->sale->id,


        ];

    }

}