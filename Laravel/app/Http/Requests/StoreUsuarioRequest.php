<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;


class StoreUsuarioRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name'           => 'required|string|max:100',
            'apellidos'      => 'nullable|string|max:100',
            'email'          => 'required|string|email|unique:users,email|max:100',
            'password'       => 'required|string|min:4',
            'telefono'       => 'nullable|string|max:20',
            'fecha_nacimiento'=> 'nullable|date|before:today',
            'id_rol'         => 'required|exists:roles,id_rol',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required'     => 'El nombre es requerido.',
            'email.required'    => 'El correo electrónico es requerido.',
            'email.unique'      => 'El correo electrónico ya está registrado.',
            'password.required' => 'La contraseña es requerida.',
            'password.min'      => 'La contraseña debe tener al menos 4 caracteres.',
            'id_rol.required'   => 'El rol es requerido.',
            'id_rol.exists'     => 'El rol seleccionado no existe.',
        ];
    }
}
