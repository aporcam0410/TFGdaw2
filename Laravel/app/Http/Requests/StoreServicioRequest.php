<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreServicioRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nombre_servicio' => 'required|string|max:100',
            'descripcion'     => 'nullable|string',
            'duracion_min'    => 'required|integer|min:15',
            'precio'          => 'required|integer|min:0',
        ];
    }

    public function messages(): array
    {
        return [
            'nombre_servicio.required' => 'El nombre del servicio es obligatorio.',
            'duracion_min.required'    => 'La duración es obligatoria.',
            'duracion_min.min'         => 'La duración mínima es 15 minutos.',
            'precio.required'          => 'El precio es obligatorio.',
        ];
    }
}
