<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('apellidos')->nullable()->after('name');
            $table->string('telefono')->nullable()->after('email');
            $table->date('fecha_nacimiento')->nullable()->after('telefono');
            $table->timestamp('fecha_registro')->nullable()->after('fecha_nacimiento');
            $table->foreignId('id_rol')->nullable()->constrained('roles', 'id_rol')->nullOnDelete()->after('fecha_registro');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['id_rol']);
            $table->dropColumn(['apellidos', 'telefono', 'fecha_nacimiento', 'fecha_registro', 'id_rol']);
        });
    }
};
