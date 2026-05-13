<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ClaseResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'titulo' => $this->titulo,
            'estado' => $this->estado,

            'usuario' => $this->whenLoaded('usuario', function () {
                return [
                    'id' => $this->usuario->id,
                    'nombre' => $this->usuario->name,
                    'email' => $this->usuario->email,
                ];
            }),

            'asignatura' => $this->whenLoaded('asignatura', function () {
                return [
                    'id' => $this->asignatura->id,
                    'nombre' => $this->asignatura->nombre,
                ];
            }),

            'modalidad' => $this->whenLoaded('modalidad', function () {
                return [
                    'id' => $this->modalidad->id,
                    'nombre' => $this->modalidad->nombre,
                ];
            }),

        ];
    }
}


