<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePsicologoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $psicologoId = $this->route('psicologo')?->id_psicologo;
        return [
            'nombre'       => 'sometimes|required|string|max:100',
            'especialidad' => 'nullable|string|max:100',
            'email'        => "sometimes|required|email|max:100|unique:psicologos,email,{$psicologoId},id_psicologo",
            'telefono'     => 'nullable|string|max:20',
        ];
    }
}
