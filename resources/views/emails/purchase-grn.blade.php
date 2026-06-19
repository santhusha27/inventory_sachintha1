<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>GRN</title>

    <style>
        body {
            font-family: Arial, sans-serif;
            color: #111827;
        }

        .header {
            margin-bottom: 20px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
        }

        th, td {
            border: 1px solid #d1d5db;
            padding: 8px;
            text-align: left;
        }

        th {
            background: #f3f4f6;
        }

        .total {
            text-align: right;
            margin-top: 20px;
            font-size: 18px;
            font-weight: bold;
        }
    </style>
</head>

<body>

<div class="header">
    <h2>Sachintha Book Shop</h2>
    <p><strong>GRN Number:</strong> {{ $purchase->grn_number }}</p>
    <p><strong>Supplier:</strong> {{ $purchase->supplier->name }}</p>
    <p><strong>Date:</strong> {{ $purchase->purchase_date }}</p>
</div>

<table>
    <thead>
        <tr>
            <th>Product</th>
            <th>Quantity</th>
            <th>Unit Price</th>
            <th>Total</th>
        </tr>
    </thead>

    <tbody>
        @foreach($purchase->items as $item)
            <tr>
                <td>{{ $item->product->name }}</td>
                <td>{{ $item->quantity }}</td>
                <td>Rs. {{ $item->unit_price }}</td>
                <td>Rs. {{ $item->total_price }}</td>
            </tr>
        @endforeach
    </tbody>
</table>

<div class="total">
    Total Amount: Rs. {{ $purchase->total_amount }}
</div>

<p>Thank you.</p>

</body>
</html>