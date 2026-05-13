<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Servicio;
use Illuminate\Http\Request;

class ServicioController extends Controller
{
    public function index()
    {
        $servicios = Servicio::with('psicologos')->get()->map(fn($s) => $this->format($s));
        return response()->json($servicios);
    }

    public function show(Servicio $servicio)
    {
        return response()->json($this->format($servicio->load('psicologos')));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'nombre_servicio' => 'required|string|max:100',
            'descripcion'     => 'nullable|string',
            'duracion_min'    => 'required|integer|min:1',
            'precio'          => 'required|numeric|min:0',
        ]);

        $servicio = Servicio::create($data);
        return response()->json($this->format($servicio), 201);
    }

    public function update(Request $request, Servicio $servicio)
    {
        $data = $request->validate([
            'nombre_servicio' => 'sometimes|string|max:100',
            'descripcion'     => 'nullable|string',
            'duracion_min'    => 'sometimes|integer|min:1',
            'precio'          => 'sometimes|numeric|min:0',
        ]);

        $servicio->update($data);
        return response()->json($this->format($servicio));
    }

    public function destroy(Servicio $servicio)
    {
        $servicio->delete();
        return response()->json(['message' => 'Servicio eliminado.']);
    }

    private function format(Servicio $s): array
    {
        return [
            'id_servicio'     => $s->id_servicio,
            'nombre_servicio' => $s->nombre_servicio,
            'descripcion'     => $s->descripcion,
            'duracion_min'    => $s->duracion_min,
            'precio'          => $s->precio,
            'psicologos'      => $s->relationLoaded('psicologos')
                ? $s->psicologos->map(fn($p) => [
                    'id_psicologo' => $p->id_psicologo,
                    'nombre'       => $p->nombre,
                    'especialidad' => $p->especialidad,
                ])->values()
                : [],
        ];
    }
}
