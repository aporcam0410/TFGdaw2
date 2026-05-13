<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cita;
use App\Models\EstadoCita;
use App\Models\Servicio;
use App\Http\Requests\StoreCitaRequest;
use App\Http\Requests\UpdateCitaRequest;
use App\Http\Resources\CitaResource;
use Illuminate\Support\Facades\Auth;

class CitaController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    // GET /api/citas
    public function index()
    {
        $usuario = Auth::user();

        $idFinalizada = EstadoCita::finalizada()->id_estado;

        Cita::where('id_estado', '!=', $idFinalizada)
            ->where(function ($q) {
                $q->where('fecha', '<', now()->toDateString())
                  ->orWhere(function ($q2) {
                      $q2->where('fecha', now()->toDateString())
                         ->where('hora', '<', now()->toTimeString());
                  });
            })
            ->update(['id_estado' => $idFinalizada]);

        $citas = $usuario->isAdmin()
            ? Cita::with(['usuario', 'psicologo', 'servicio', 'modalidad', 'estado'])->get()
            : Cita::where('id_usuario', $usuario->id)->with(['psicologo', 'servicio', 'modalidad', 'estado'])->get();

        return response()->json(CitaResource::collection($citas), 200);
    }

    // POST /api/citas
    public function store(StoreCitaRequest $request)
    {
        $usuario   = $request->user();
        $validated = $request->validated();

        // Admin puede crear cita para otro usuario; si no, usa el autenticado
        if ($usuario->isAdmin() && !empty($validated['id_usuario'])) {
            // ya viene en $validated
        } else {
            $validated['id_usuario'] = $usuario->id;
        }

        // Auto-asignar psicólogo desde el servicio
        $servicio   = Servicio::with('psicologos')->findOrFail($validated['id_servicio']);
        $psicologo  = $servicio->psicologos->first();
        if (!$psicologo) {
            return response()->json(['message' => 'No hay psicólogo disponible para este servicio.'], 422);
        }
        $validated['id_psicologo'] = $psicologo->id_psicologo;

        // Auto-asignar precio final desde el servicio
        $validated['precio_final'] = $servicio->precio;

        // Estado: Confirmada
        $validated['id_estado'] = EstadoCita::confirmada()->id_estado;

        try {
            $cita = Cita::create($validated);
        } catch (\Exception $e) {
            return response()->json(['message' => 'No se ha podido crear la cita. Inténtalo de nuevo.'], 500);
        }

        return response()->json([
            'message' => 'Cita creada correctamente.',
            'data'    => new CitaResource($cita->load(['usuario', 'psicologo', 'servicio', 'modalidad', 'estado'])),
        ], 201);
    }

    // GET /api/citas/{cita}
    public function show(Cita $cita)
    {
        $usuario = Auth::user();

        if ($cita->id_usuario !== $usuario->id && !$usuario->isAdmin()) {
            return response()->json(['message' => 'No tienes permiso para ver esta cita.'], 403);
        }

        return new CitaResource($cita->load(['usuario', 'psicologo', 'servicio', 'modalidad', 'estado']));
    }

    // PUT/PATCH /api/citas/{cita}
    public function update(UpdateCitaRequest $request, Cita $cita)
    {
        $usuario = Auth::user();

        if ($cita->id_usuario !== $usuario->id && !$usuario->isAdmin()) {
            return response()->json(['message' => 'No tienes permiso para actualizar esta cita.'], 403);
        }

        $cita->update($request->validated());

        return response()->json([
            'message' => 'Cita actualizada correctamente.',
            'data'    => new CitaResource($cita->load(['usuario', 'psicologo', 'servicio', 'modalidad', 'estado'])),
        ]);
    }

    // DELETE /api/citas/{cita}
    public function destroy(Cita $cita)
    {
        $usuario = Auth::user();

        if ($cita->id_usuario !== $usuario->id && !$usuario->isAdmin()) {
            return response()->json(['message' => 'No tienes permiso para anular esta cita.'], 403);
        }

        if (!$usuario->isAdmin() && !$cita->puedeAnularse()) {
            return response()->json([
                'message' => 'No se puede anular una cita con menos de 1 dia de antelacion.',
            ], 422);
        }

        $cita->delete();

        return response()->json(['message' => 'Cita anulada correctamente.']);
    }
}
