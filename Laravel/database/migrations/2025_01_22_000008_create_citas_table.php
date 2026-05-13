<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('citas', function (Blueprint $table) {
            $table->id('id_cita');
            $table->date('fecha');
            $table->time('hora');
            $table->string('observaciones')->nullable();
            $table->timestamp('fecha_creacion')->useCurrent();
            $table->integer('precio_final')->nullable();
            $table->foreignId('id_usuario')->constrained('users')->cascadeOnDelete();
            $table->foreignId('id_psicologo')->constrained('psicologos', 'id_psicologo')->cascadeOnDelete();
            $table->foreignId('id_servicio')->constrained('servicios', 'id_servicio')->cascadeOnDelete();
            $table->foreignId('id_modalidad')->constrained('modalidades', 'id_modalidad')->cascadeOnDelete();
            $table->foreignId('id_estado')->constrained('estados_cita', 'id_estado')->cascadeOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('citas');
    }
};
