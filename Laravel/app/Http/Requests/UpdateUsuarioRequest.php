<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Symfony\Component\Mime\Email;

class UpdateUsuarioRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $usuarioAuth = auth()->user();
        if ( $usuarioAuth->isAdmin() || $this->usuario == $usuarioAuth) {
            return true;
        }
        return false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name'            => 'sometimes|required|string|max:100',
            'apellidos'       => 'nullable|string|max:100',
            'email'           => ['sometimes', 'required', 'email', 'string', 'max:100', Rule::unique('users')->ignore($this->usuario)],
            'id_rol'          => 'sometimes|required|exists:roles,id_rol',
            'password'        => 'sometimes|required|string|min:4|confirmed',
            'telefono'        => 'nullable|string|max:20',
            'fecha_nacimiento' => 'nullable|date|before:today',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required'     => 'El nombre es requerido.',
            'email.required'    => 'El correo electrónico es requerido.',
            'email.unique'      => 'El correo electrónico ya está registrado.',
            'id_rol.required'   => 'El rol es requerido.',
            'id_rol.exists'     => 'El rol seleccionado no existe.',
        ];
    }
}
