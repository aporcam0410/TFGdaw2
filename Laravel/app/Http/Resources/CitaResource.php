<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CitaResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id_cita'       => $this->id_cita,
            'fecha'         => $this->fecha?->format('Y-m-d'),
            'hora'          => $this->hora,
            'observaciones' => $this->observaciones,
            'fecha_creacion'=> $this->fecha_creacion,
            'precio_final'  => $this->precio_final,

            'usuario' => $this->whenLoaded('usuario', fn() => [
                'id'       => $this->usuario->id,
                'nombre'   => $this->usuario->name,
                'apellidos'=> $this->usuario->apellidos,
                'email'    => $this->usuario->email,
            ]),

            'psicologo' => $this->whenLoaded('psicologo', fn() => [
                'id_psicologo' => $this->psicologo->id_psicologo,
                'nombre'       => $this->psicologo->nombre,
                'especialidad' => $this->psicologo->especialidad,
            ]),

            'servicio' => $this->whenLoaded('servicio', fn() => [
                'id_servicio'    => $this->servicio->id_servicio,
                'nombre_servicio'=> $this->servicio->nombre_servicio,
                'duracion_min'   => $this->servicio->duracion_min,
                'precio'         => $this->servicio->precio,
            ]),

            'modalidad' => $this->whenLoaded('modalidad', fn() => [
                'id_modalidad'    => $this->modalidad->id_modalidad,
                'nombre_modalidad'=> $this->modalidad->nombre_modalidad,
            ]),

            'estado' => $this->whenLoaded('estado', fn() => [
                'id_estado'    => $this->estado->id_estado,
                'nombre_estado'=> $this->estado->nombre_estado,
            ]),

            'puede_anularse' => $this->puedeAnularse(),
        ];
    }
}
