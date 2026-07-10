<?php

use App\Models\Stock;

test('stock status is green and no need to order when quantity is above reorder level', function () {
    $stock = new Stock([
        'quantity' => 10,
        'reorder_level' => 5,
    ]);

    expect($stock->status)->toBe('No Need to Order');
    expect($stock->status_color)->toBe('green');
});

test('stock status is yellow and ready to order when quantity equals reorder level', function () {
    $stock = new Stock([
        'quantity' => 5,
        'reorder_level' => 5,
    ]);

    expect($stock->status)->toBe('Ready to Order');
    expect($stock->status_color)->toBe('yellow');
});

test('stock status is red and reorder needed when quantity is below reorder level', function () {
    $stock = new Stock([
        'quantity' => 2,
        'reorder_level' => 5,
    ]);

    expect($stock->status)->toBe('Reorder Needed');
    expect($stock->status_color)->toBe('red');
});
