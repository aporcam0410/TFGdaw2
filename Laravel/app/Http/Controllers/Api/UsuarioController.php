<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Usuario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UsuarioController extends Controller
{
    public function index()
    {
        $usuarios = Usuario::with('rol')->get()->map(fn($u) => $this->format($u));
        return response()->json($usuarios);
    }

    public function show(Usuario $usuario)
    {
        return response()->json($this->format($usuario->load('rol')));
    }

    public function update(Request $request, Usuario $usuario)
    {
        $data = $request->validate([
            'name'             => 'sometimes|string|max:100',
            'apellidos'        => 'sometimes|string|max:100',
            'email'            => 'sometimes|email|unique:users,email,' . $usuario->id,
            'telefono'         => 'nullable|string|max:20',
            'fecha_nacimiento' => 'nullable|date',
            'id_rol'           => 'sometimes|exists:roles,id_rol',
            'password'         => 'nullable|string|min:6',
        ]);

        if (isset($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        }

        $usuario->update($data);
        return response()->json($this->format($usuario->load('rol')));
    }

    public function destroy(Usuario $usuario)
    {
        $usuario->delete();
        return response()->json(['message' => 'Usuario eliminado.']);
    }

    private function format(Usuario $u): array
    {
        return [
            'id'               => $u->id,
            'nombre'           => $u->name,
            'apellidos'        => $u->apellidos,
            'email'            => $u->email,
            'telefono'         => $u->telefono,
            'fecha_nacimiento' => $u->fecha_nacimiento?->format('Y-m-d'),
            'fecha_registro'   => $u->fecha_registro?->format('Y-m-d'),
            'rol'              => $u->relationLoaded('rol') ? $u->rol?->nombre_rol : null,
            'rol_slug'         => $u->relationLoaded('rol') ? $u->rol?->slug : null,
            'id_rol'           => $u->id_rol,
            'is_admin'         => $u->isAdmin(),
        ];
    }
}
