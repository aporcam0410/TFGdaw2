<?php

namespace App\Http\Controllers;

use App\Models\Cita;
use App\Models\Psicologo;
use App\Models\Servicio;
use App\Models\Modalidad;
use App\Models\EstadoCita;
use App\Models\Usuario;
use App\Http\Requests\StoreCitaRequest;
use App\Http\Requests\UpdateCitaRequest;
use Illuminate\Support\Facades\Auth;

class CitaController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function index()
    {
        $estados = EstadoCita::whereIn('nombre_estado', [EstadoCita::FINALIZADO, EstadoCita::ANULADA])
            ->pluck('id_estado', 'nombre_estado');
        $idFinalizado = $estados[EstadoCita::FINALIZADO] ?? null;
        $idAnulada    = $estados[EstadoCita::ANULADA]    ?? null;

        if ($idFinalizado && $idAnulada) {
            Cita::where('fecha', '<', today())
                ->whereNotIn('id_estado', [$idAnulada, $idFinalizado])
                ->update(['id_estado' => $idFinalizado]);
        }

        /** @var \App\Models\Usuario $usuario */
        $usuario = Auth::user();

        $citas = $usuario->isAdmin()
            ? Cita::with(['usuario', 'psicologo', 'servicio', 'modalidad', 'estado'])->orderBy('fecha', 'desc')->get()
            : $usuario->citas()->with(['psicologo', 'servicio', 'modalidad', 'estado'])->orderBy('fecha', 'desc')->get();

        return view('citas.index', compact('citas'));
    }

    public function create()
    {
        $todosServicios = Servicio::with('psicologos')->get();

        $serviciosData = $todosServicios->mapWithKeys(function ($s) {
            $psicologo = $s->psicologos->first();
            return [$s->id_servicio => [
                'precio'           => $s->precio,
                'psicologo_id'     => $psicologo?->id_psicologo,
                'psicologo_nombre' => $psicologo?->nombre ?? 'No asignado',
            ]];
        });

        $servicios   = $todosServicios;
        $modalidades = Modalidad::all();

        return view('citas.create', compact('servicios', 'modalidades', 'serviciosData'));
    }

    public function store(StoreCitaRequest $request)
    {
        $servicio  = Servicio::with('psicologos')->findOrFail($request->id_servicio);
        $psicologo = $servicio->psicologos->first()
            ?? abort(422, 'El servicio no tiene psicólogo asignado.');
        $estado    = EstadoCita::aprobado();

        Cita::create(array_merge($request->validated(), [
            'id_usuario'     => Auth::id(),
            'id_psicologo'   => $psicologo->id_psicologo,
            'precio_final'   => $servicio->precio,
            'id_estado'      => $estado->id_estado,
            'fecha_creacion' => now(),
        ]));

        return redirect()->route('citas.index')->with('success', 'Cita creada correctamente.');
    }

    public function show(Cita $cita)
    {
        /** @var \App\Models\Usuario $usuario */
        $usuario = Auth::user();
        if ($cita->id_usuario !== $usuario->id && !$usuario->isAdmin()) {
            abort(403, 'No tienes permiso para ver esta cita.');
        }
        $cita->load(['usuario', 'psicologo', 'servicio', 'modalidad', 'estado']);
        return view('citas.show', compact('cita'));
    }

    public function edit(Cita $cita)
    {
        /** @var \App\Models\Usuario $usuario */
        $usuario = Auth::user();
        if ($cita->id_usuario !== $usuario->id && !$usuario->isAdmin()) {
            abort(403, 'No tienes permiso para editar esta cita.');
        }

        $psicologos  = Psicologo::all();
        $servicios   = Servicio::all();
        $modalidades = Modalidad::all();
        $estados     = EstadoCita::all();

        return view('citas.edit', compact('cita', 'psicologos', 'servicios', 'modalidades', 'estados'));
    }

    public function update(UpdateCitaRequest $request, Cita $cita)
    {
        /** @var \App\Models\Usuario $usuario */
        $usuario = Auth::user();
        if ($cita->id_usuario !== $usuario->id && !$usuario->isAdmin()) {
            abort(403);
        }

        $cita->update($request->validated());
        return redirect()->route('citas.index')->with('success', 'Cita actualizada correctamente.');
    }

    public function destroy(Cita $cita)
    {
        /** @var \App\Models\Usuario $usuario */
        $usuario = Auth::user();
        if ($cita->id_usuario !== $usuario->id && !$usuario->isAdmin()) {
            abort(403, 'No tienes permiso para anular esta cita.');
        }

        if (!$usuario->isAdmin() && !$cita->puedeAnularse()) {
            return redirect()->route('citas.index')
                ->with('error', 'No se puede anular una cita con menos de 1 día de antelación.');
        }

        $cita->delete();
        return redirect()->route('citas.index')->with('success', 'Cita anulada correctamente.');
    }
}
