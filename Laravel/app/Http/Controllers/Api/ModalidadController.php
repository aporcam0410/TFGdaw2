<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Modalidad;

class ModalidadController extends Controller
{
    public function index()
    {
        return response()->json(
            Modalidad::all()->map(fn($m) => [
                'id_modalidad'    => $m->id_modalidad,
                'nombre_modalidad'=> $m->nombre_modalidad,
            ])
        );
    }
}
