<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Modalidad;

class ModalidadSeeder extends Seeder
{
    public function run(): void
    {
        Modalidad::firstOrCreate(['nombre_modalidad' => 'Online']);
        Modalidad::firstOrCreate(['nombre_modalidad' => 'Presencial']);
        Modalidad::firstOrCreate(['nombre_modalidad' => 'Hibrida']);
    }
}
