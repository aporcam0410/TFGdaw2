<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePsicologoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nombre'       => 'required|string|max:100',
            'especialidad' => 'nullable|string|max:100',
            'email'        => 'required|email|max:100|unique:psicologos,email',
            'telefono'     => 'nullable|string|max:20',
        ];
    }

    public function messages(): array
    {
        return [
            'nombre.required' => 'El nombre del psicólogo es obligatorio.',
            'email.required'  => 'El email es obligatorio.',
            'email.unique'    => 'Este email ya está registrado.',
        ];
    }
}
