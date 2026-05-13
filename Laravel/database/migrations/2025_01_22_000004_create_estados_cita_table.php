<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('estados_cita', function (Blueprint $table) {
            $table->id('id_estado');
            $table->string('nombre_estado');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('estados_cita');
    }
};
