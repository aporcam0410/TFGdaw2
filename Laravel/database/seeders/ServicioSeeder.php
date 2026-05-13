<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Servicio;

class ServicioSeeder extends Seeder
{
    public function run(): void
    {
        Servicio::firstOrCreate(
            ['nombre_servicio' => 'Consulta inicial'],
            ['descripcion' => 'Primera consulta de evaluacion', 'duracion_min' => 60, 'precio' => 80]
        );

        Servicio::firstOrCreate(
            ['nombre_servicio' => 'Sesion de terapia'],
            ['descripcion' => 'Sesion de psicoterapia individual', 'duracion_min' => 50, 'precio' => 70]
        );

        Servicio::firstOrCreate(
            ['nombre_servicio' => 'Terapia de pareja'],
            ['descripcion' => 'Sesion de terapia para parejas', 'duracion_min' => 75, 'precio' => 100]
        );

        Servicio::firstOrCreate(
            ['nombre_servicio' => 'Informe psicologico'],
            ['descripcion' => 'Elaboracion de informe clinico', 'duracion_min' => 30, 'precio' => 120]
        );
    }
}
