<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\EstadoCita;

class EstadoCitaSeeder extends Seeder
{
    public function run(): void
    {
        EstadoCita::firstOrCreate(['nombre_estado' => 'Confirmada']);
        EstadoCita::firstOrCreate(['nombre_estado' => 'Finalizado']);
    }
}
