<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use App\Models\Usuario;
use App\Models\Cita;

class DashboardController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function index()
    {
        /** @var \App\Models\Usuario $usuario */
        $usuario = Auth::user();

        if ($usuario->isAdmin()) {
            $citas    = Cita::with(['usuario', 'psicologo', 'servicio', 'estado'])->latest('fecha')->take(5)->get();
            $usuarios = Usuario::latest()->take(5)->get();
        } else {
            $citas    = $usuario->citas()->with(['psicologo', 'servicio', 'estado'])->latest('fecha')->take(5)->get();
            $usuarios = collect([$usuario]);
        }

        return view('dashboard.index', [
            'usuario'  => $usuario,
            'citas'    => $citas,
            'usuarios' => $usuarios,
        ]);
    }
}
