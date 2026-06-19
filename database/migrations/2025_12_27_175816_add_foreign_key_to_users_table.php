<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
       Schema::table('users', function (Blueprint $table) {

            // Add role_id column if NOT exists
            if (!Schema::hasColumn('users', 'role_id')) {
                $table->foreignId('role_id')
                      ->after('id')
                      ->constrained('roles')
                      ->cascadeOnDelete();
            } else {
                // Add only foreign key
                $table->foreign('role_id')
                      ->references('id')
                      ->on('roles')
                      ->cascadeOnDelete();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['role_id']);
            // optional: drop column
            // $table->dropColumn('role_id');
        });
    }
};
