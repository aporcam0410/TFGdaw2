<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use App\Models\Rol;
use App\Enums\RoleSlug;
use App\Models\Usuario;

class UsuarioSeeder extends Seeder
{
    public function run(): void
    {
        $rolAdmin   = Rol::where('slug', RoleSlug::ADMIN->value)->first();
        $rolPaciente = Rol::where('slug', RoleSlug::USER->value)->first();

        Usuario::firstOrCreate(
            ['email' => 'admin@clinica.com'],
            [
                'name'           => 'Admin',
                'apellidos'      => 'Clinica',
                'password'       => Hash::make('12345'),
                'fecha_registro' => now(),
                'id_rol'         => $rolAdmin->id_rol,
            ]
        );

        Usuario::firstOrCreate(
            ['email' => 'paciente1@clinica.com'],
            [
                'name'           => 'Ana',
                'apellidos'      => 'Garcia Lopez',
                'password'       => Hash::make('paciente123'),
                'telefono'       => '612345678',
                'fecha_nacimiento'=> '1990-05-15',
                'fecha_registro' => now(),
                'id_rol'         => $rolPaciente->id_rol,
            ]
        );

        Usuario::firstOrCreate(
            ['email' => 'paciente2@clinica.com'],
            [
                'name'           => 'Carlos',
                'apellidos'      => 'Martinez Ruiz',
                'password'       => Hash::make('paciente123'),
                'telefono'       => '698765432',
                'fecha_nacimiento'=> '1985-11-22',
                'fecha_registro' => now(),
                'id_rol'         => $rolPaciente->id_rol,
            ]
        );
    }
}
