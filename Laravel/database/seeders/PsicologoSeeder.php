<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Psicologo;
use App\Models\Servicio;

class PsicologoSeeder extends Seeder
{
    public function run(): void
    {
        $gomez = Psicologo::firstOrCreate(
            ['email' => 'dra.gomez@clinica.com'],
            ['nombre' => 'Dra. Laura Gomez', 'especialidad' => 'Psicologia clinica', 'telefono' => '911234567']
        );

        $sanchez = Psicologo::firstOrCreate(
            ['email' => 'dr.sanchez@clinica.com'],
            ['nombre' => 'Dr. Pedro Sanchez', 'especialidad' => 'Terapia cognitivo-conductual', 'telefono' => '911234568']
        );

        $consulta  = Servicio::where('nombre_servicio', 'Consulta inicial')->first();
        $terapia   = Servicio::where('nombre_servicio', 'Sesion de terapia')->first();
        $pareja    = Servicio::where('nombre_servicio', 'Terapia de pareja')->first();
        $informe   = Servicio::where('nombre_servicio', 'Informe psicologico')->first();

        if ($consulta && $terapia) {
            $gomez->servicios()->syncWithoutDetaching([$consulta->id_servicio, $terapia->id_servicio]);
        }
        if ($pareja && $informe) {
            $sanchez->servicios()->syncWithoutDetaching([$pareja->id_servicio, $informe->id_servicio]);
        }
    }
}
