<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Invoice</title>
    <style>
        body { font-family: Arial, sans-serif; }
        table { width:100%; border-collapse: collapse; margin-top:20px; }
        th, td { border:1px solid #000; padding:8px; text-align:left; }
        th { background:#f2f2f2; }
        .right { text-align:right; }
    </style>
</head>
<body>
<div style="text-align:center; margin-bottom:20px;">
<img src="{{ public_path('images/bookshop-logo1.png') }}"class="logo" style="width:250px; height:auto; ">
<p>Angoda, Mulleriyawa New Town. </p>     
</div>
<h3>Invoice #{{ $sale->id }}</h3>

<p><strong>Staff:</strong> {{ $sale->user->name ?? '-' }}</p>
<p><strong>Date:</strong> {{ $sale->sale_date }}</p>

<table>
    <thead>
        <tr>
            <th>Product</th>
            <th>Qty</th>
            <th>Unit Price</th>
            <th>Total</th>
        </tr>
    </thead>
    <tbody>
        @foreach($sale->items as $item)
        <tr>
            <td>{{ $item->product->name }}</td>
            <td>{{ $item->quantity }}</td>
            <td>Rs. {{ $item->unit_price }}</td>
            <td>Rs. {{ $item->total_price }}</td>
        </tr>
        @endforeach
    </tbody>
</table>

<h3 class="right">Grand Total: Rs. {{ $sale->total_amount }}</h3>
<div style="text-align:center; margin-bottom:20px;" > 

<h4>Thank you for your purchase! Come Again.</h4>

</div>
</body>
</html>