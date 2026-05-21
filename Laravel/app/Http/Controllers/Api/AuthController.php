<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\EstadoCita;
use App\Models\Rol;
use App\Models\Usuario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $data = $request->validate([
            'nombre'           => 'required|string|max:100',
            'apellidos'        => 'required|string|max:100',
            'email'            => 'required|email|unique:users,email',
            'password'         => 'required|string|min:6',
            'telefono'         => 'nullable|regex:/^\d{9}$/',
            'fecha_nacimiento' => 'nullable|date',
        ]);

        $data['name'] = $data['nombre'];
        unset($data['nombre']);

        $rolPaciente = Rol::where('slug', 'user')->first();

        $data['fecha_registro'] = now();
        $data['id_rol']         = $rolPaciente?->id_rol;

        $usuario = Usuario::create($data);

        $token = $usuario->createToken('api-token')->plainTextToken;

        return response()->json([
            'token'   => $token,
            'usuario' => $this->formatUsuario($usuario),
        ], 201);
    }

    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        if (Auth::attempt($credentials)) {
            /** @var Usuario $usuario */
            $usuario = Auth::user();
            $token   = $usuario->createToken('api-token')->plainTextToken;

            return response()->json([
                'token'   => $token,
                'usuario' => $this->formatUsuario($usuario->load('rol')),
            ]);
        }

        return response()->json(['message' => 'Credenciales incorrectas'], 401);
    }

    public function me(Request $request)
    {
        return response()->json($this->formatUsuario($request->user()->load('rol')));
    }

    public function updateMe(Request $request)
    {
        /** @var Usuario $usuario */
        $usuario = $request->user();

        $data = $request->validate([
            'nombre'           => 'sometimes|string|max:100',
            'apellidos'        => 'sometimes|string|max:100',
            'telefono'         => 'nullable|regex:/^\d{9}$/',
            'fecha_nacimiento' => 'nullable|date',
            'password'         => 'nullable|string|min:6',
        ]);

        if (isset($data['nombre'])) {
            $data['name'] = $data['nombre'];
            unset($data['nombre']);
        }

        if (isset($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        }

        $usuario->update($data);

        return response()->json($this->formatUsuario($usuario->load('rol')));
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Sesión cerrada correctamente']);
    }

    public function forgotPassword(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $status = Password::sendResetLink(['email' => $request->email]);

        if ($status === Password::RESET_LINK_SENT) {
            return response()->json(['message' => 'Te hemos enviado un enlace para restablecer tu contraseña.']);
        }

        return response()->json(['message' => 'No encontramos ninguna cuenta con ese email.'], 422);
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            'token'    => 'required',
            'email'    => 'required|email',
            'password' => 'required|string|min:6',
        ]);

        $status = Password::reset(
            $request->only('email', 'password', 'token'),
            function ($user, $password) {
                $user->password = Hash::make($password);
                $user->save();
            }
        );

        if ($status === Password::PASSWORD_RESET) {
            return response()->json(['message' => 'Contraseña restablecida correctamente.']);
        }

        return response()->json(['message' => 'El enlace no es válido o ha expirado.'], 422);
    }

    private function formatUsuario(Usuario $u): array
    {
        return [
            'id'               => $u->id,
            'nombre'           => $u->name,
            'apellidos'        => $u->apellidos,
            'email'            => $u->email,
            'telefono'         => $u->telefono,
            'fecha_nacimiento' => $u->fecha_nacimiento?->format('Y-m-d'),
            'fecha_registro'   => $u->fecha_registro?->format('Y-m-d'),
            'rol'              => $u->relationLoaded('rol') ? $u->rol?->slug : null,
            'is_admin'         => $u->isAdmin(),
        ];
    }
}
