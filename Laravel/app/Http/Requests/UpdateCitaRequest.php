<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCitaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'fecha'        => 'sometimes|required|date|after:today',
            'hora'         => 'sometimes|required|date_format:H:i',
            'observaciones'=> 'nullable|string|max:500',
            'precio_final' => 'nullable|integer|min:0',
            'id_psicologo' => 'sometimes|required|exists:psicologos,id_psicologo',
            'id_servicio'  => 'sometimes|required|exists:servicios,id_servicio',
            'id_modalidad' => 'sometimes|required|exists:modalidades,id_modalidad',
            'id_estado'    => 'sometimes|required|exists:estados_cita,id_estado',
        ];
    }
}
