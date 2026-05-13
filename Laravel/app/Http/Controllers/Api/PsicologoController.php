<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Psicologo;
use Illuminate\Http\Request;

class PsicologoController extends Controller
{
    public function index()
    {
        $psicologos = Psicologo::with('servicios')->get()->map(fn($p) => $this->format($p));
        return response()->json($psicologos);
    }

    public function show(Psicologo $psicologo)
    {
        return response()->json($this->format($psicologo->load('servicios')));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'nombre'      => 'required|string|max:100',
            'especialidad'=> 'required|string|max:100',
            'email'       => 'required|email|unique:psicologos,email',
            'telefono'    => 'nullable|string|max:20',
            'descripcion' => 'nullable|string',
            'foto'        => 'nullable|string',
        ]);

        $psicologo = Psicologo::create($data);
        return response()->json($this->format($psicologo), 201);
    }

    public function update(Request $request, Psicologo $psicologo)
    {
        $data = $request->validate([
            'nombre'      => 'sometimes|string|max:100',
            'especialidad'=> 'sometimes|string|max:100',
            'email'       => 'sometimes|email|unique:psicologos,email,' . $psicologo->id_psicologo . ',id_psicologo',
            'telefono'    => 'nullable|string|max:20',
            'descripcion' => 'nullable|string',
            'foto'        => 'nullable|string',
        ]);

        $psicologo->update($data);
        return response()->json($this->format($psicologo));
    }

    public function destroy(Psicologo $psicologo)
    {
        $psicologo->delete();
        return response()->json(['message' => 'Psicólogo eliminado.']);
    }

    private function format(Psicologo $p): array
    {
        return [
            'id_psicologo' => $p->id_psicologo,
            'nombre'       => $p->nombre,
            'especialidad' => $p->especialidad,
            'email'        => $p->email,
            'telefono'     => $p->telefono,
            'descripcion'  => $p->descripcion ?? null,
            'foto'         => $p->foto ?? null,
            'servicios'    => $p->relationLoaded('servicios')
                ? $p->servicios->map(fn($s) => [
                    'id_servicio'     => $s->id_servicio,
                    'nombre_servicio' => $s->nombre_servicio,
                    'precio'          => $s->precio,
                ])->values()
                : [],
        ];
    }
}
