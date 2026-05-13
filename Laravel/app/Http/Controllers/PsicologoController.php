<?php

namespace App\Http\Controllers;

use App\Models\Psicologo;
use App\Models\Servicio;
use App\Http\Requests\StorePsicologoRequest;
use App\Http\Requests\UpdatePsicologoRequest;
use Illuminate\Support\Facades\Auth;

class PsicologoController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function index()
    {
        $psicologos = Psicologo::with('servicios')->get();
        return view('psicologos.index', compact('psicologos'));
    }

    public function create()
    {
        if (!Auth::user()->isAdmin()) {
            abort(403);
        }
        $servicios = Servicio::all();
        return view('psicologos.create', compact('servicios'));
    }

    public function store(StorePsicologoRequest $request)
    {
        if (!Auth::user()->isAdmin()) {
            abort(403);
        }
        $psicologo = Psicologo::create($request->validated());

        if ($request->has('servicios')) {
            $psicologo->servicios()->sync($request->servicios);
        }

        return redirect()->route('psicologos.index')->with('success', 'Psicólogo creado correctamente.');
    }

    public function show(Psicologo $psicologo)
    {
        $psicologo->load('servicios');
        return view('psicologos.show', compact('psicologo'));
    }

    public function edit(Psicologo $psicologo)
    {
        if (!Auth::user()->isAdmin()) {
            abort(403);
        }
        $servicios = Servicio::all();
        return view('psicologos.edit', compact('psicologo', 'servicios'));
    }

    public function update(UpdatePsicologoRequest $request, Psicologo $psicologo)
    {
        if (!Auth::user()->isAdmin()) {
            abort(403);
        }
        $psicologo->update($request->validated());

        if ($request->has('servicios')) {
            $psicologo->servicios()->sync($request->servicios);
        }

        return redirect()->route('psicologos.index')->with('success', 'Psicólogo actualizado correctamente.');
    }

    public function destroy(Psicologo $psicologo)
    {
        if (!Auth::user()->isAdmin()) {
            abort(403);
        }
        $psicologo->delete();
        return redirect()->route('psicologos.index')->with('success', 'Psicólogo eliminado correctamente.');
    }
}
