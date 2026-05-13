<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class StoreCitaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'fecha'         => 'required|date|after_or_equal:today',
            'hora'          => 'required|date_format:H:i',
            'observaciones' => 'nullable|string|max:500',
            'id_servicio'   => 'required|exists:servicios,id_servicio',
            'id_modalidad'  => 'required|exists:modalidades,id_modalidad',
            'id_usuario'    => 'nullable|exists:users,id',
        ];
    }

    public function messages(): array
    {
        return [
            'fecha.required'        => 'La fecha es obligatoria.',
            'fecha.after_or_equal'  => 'La fecha debe ser hoy o posterior.',
            'hora.required'         => 'La hora es obligatoria.',
            'hora.date_format'      => 'La hora debe tener formato HH:MM.',
            'id_servicio.required'  => 'Debe seleccionar un servicio.',
            'id_modalidad.required' => 'Debe seleccionar una modalidad.',
        ];
    }
}
