<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CitaController;
use App\Http\Controllers\Api\ServicioController;
use App\Http\Controllers\Api\PsicologoController;
use App\Http\Controllers\Api\UsuarioController;
use App\Http\Controllers\Api\ModalidadController;
use App\Http\Controllers\Api\DisponibilidadController;
use App\Http\Controllers\Api\ContactoController;
use App\Models\EstadoCita;

// Públicas
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);
Route::get('/servicios',             [ServicioController::class,  'index']);
Route::get('/servicios/{servicio}',  [ServicioController::class,  'show']);
Route::get('/psicologos',            [PsicologoController::class, 'index']);
Route::get('/psicologos/{psicologo}',[PsicologoController::class, 'show']);
Route::get('/modalidades',           [ModalidadController::class, 'index']);
Route::get('/estados-cita',          fn() => response()->json(EstadoCita::all()));
Route::post('/contacto',             [ContactoController::class,  'send']);

// Protegidas (usuario autenticado)
Route::middleware('auth:sanctum')->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me',      [AuthController::class, 'me']);
    Route::put('/me',      [AuthController::class, 'updateMe']);

    Route::apiResource('citas', CitaController::class);
    Route::get('/disponibilidad', [DisponibilidadController::class, 'index']);

    // Solo admin
    Route::middleware('can:admin')->group(function () {
        Route::apiResource('usuarios',   UsuarioController::class)->except(['store']);
        Route::apiResource('psicologos', PsicologoController::class)->except(['index', 'show']);
        Route::apiResource('servicios',  ServicioController::class)->except(['index', 'show']);
    });
});
