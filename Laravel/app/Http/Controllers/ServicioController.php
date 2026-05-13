<?php

namespace App\Http\Controllers;

use App\Models\Servicio;
use App\Http\Requests\StoreServicioRequest;
use App\Http\Requests\UpdateServicioRequest;
use Illuminate\Support\Facades\Auth;

class ServicioController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function index()
    {
        $servicios = Servicio::all();
        return view('servicios.index', compact('servicios'));
    }

    public function create()
    {
        if (!Auth::user()->isAdmin()) {
            abort(403);
        }
        return view('servicios.create');
    }

    public function store(StoreServicioRequest $request)
    {
        if (!Auth::user()->isAdmin()) {
            abort(403);
        }
        Servicio::create($request->validated());
        return redirect()->route('servicios.index')->with('success', 'Servicio creado correctamente.');
    }

    public function show(Servicio $servicio)
    {
        $servicio->load('psicologos');
        return view('servicios.show', compact('servicio'));
    }

    public function edit(Servicio $servicio)
    {
        if (!Auth::user()->isAdmin()) {
            abort(403);
        }
        return view('servicios.edit', compact('servicio'));
    }

    public function update(UpdateServicioRequest $request, Servicio $servicio)
    {
        if (!Auth::user()->isAdmin()) {
            abort(403);
        }
        $servicio->update($request->validated());
        return redirect()->route('servicios.index')->with('success', 'Servicio actualizado correctamente.');
    }

    public function destroy(Servicio $servicio)
    {
        if (!Auth::user()->isAdmin()) {
            abort(403);
        }
        $servicio->delete();
        return redirect()->route('servicios.index')->with('success', 'Servicio eliminado correctamente.');
    }
}
