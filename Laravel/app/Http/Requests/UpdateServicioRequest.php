<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateServicioRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nombre_servicio' => 'sometimes|required|string|max:100',
            'descripcion'     => 'nullable|string',
            'duracion_min'    => 'sometimes|required|integer|min:15',
            'precio'          => 'sometimes|required|integer|min:0',
        ];
    }
}
