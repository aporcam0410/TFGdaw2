<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\CitaController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PsicologoController;
use App\Http\Controllers\ServicioController;
use App\Http\Controllers\UsuarioController;
use App\Http\Controllers\AuthController;

// Redirigir raiz a login si no esta autenticado
Route::get('/', function () {
    if (Auth::check()) {
        return app(DashboardController::class)->index();
    }
    return redirect('/login');
});

// Rutas de autenticacion (sin auth)
Route::get('/login', [AuthController::class, 'form'])->name('login');
Route::post('/login', [AuthController::class, 'login']);

// Rutas protegidas por autenticacion
Route::middleware('auth')->group(function () {

    Route::get('/logout', [AuthController::class, 'logout'])->name('logout');

    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::resource('citas', CitaController::class);
    Route::resource('psicologos', PsicologoController::class);
    Route::resource('servicios', ServicioController::class);
    Route::resource('usuarios', UsuarioController::class);
});
