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
        Schema::table('psicologos', function (Blueprint $table) {
            if (!Schema::hasColumn('psicologos', 'foto')) {
                $table->string('foto')->nullable()->after('descripcion');
            }
        });
    }

    public function down(): void
    {
        Schema::table('psicologos', function (Blueprint $table) {
            if (Schema::hasColumn('psicologos', 'foto')) {
                $table->dropColumn('foto');
            }
        });
    }
};
