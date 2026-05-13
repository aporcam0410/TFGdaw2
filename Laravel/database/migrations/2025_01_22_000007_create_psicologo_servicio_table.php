<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('psicologo_servicio', function (Blueprint $table) {
            $table->id('id_psicologo_servicio');
            $table->foreignId('id_psicologo')->constrained('psicologos', 'id_psicologo')->cascadeOnDelete();
            $table->foreignId('id_servicio')->constrained('servicios', 'id_servicio')->cascadeOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('psicologo_servicio');
    }
};
