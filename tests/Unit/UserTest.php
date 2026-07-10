<?php

use App\Models\User;
use App\Models\Role;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(Tests\TestCase::class, RefreshDatabase::class);

test('user has a role and hasRole helper works', function () {
    $role = Role::create([
        'role_name' => 'admin',
        'description' => 'Administrator Role'
    ]);

    // Create Admin User
    $user = User::create([
        'name' => 'John Doe',
        'email' => 'john@example.com',
        'password' => bcrypt('password'),
        'role_id' => $role->id,
        'phone' => '123456789',
        'status' => 'active'
    ]);

    expect($user->role->role_name)->toBe('admin');
    expect($user->hasRole('admin'))->toBeTrue();
    expect($user->hasRole('storekeeper'))->toBeFalse();

});
