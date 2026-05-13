<?php

namespace App\Http\Controllers;

use App\Models\Usuario;
use App\Http\Requests\LoginRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;


class AuthController extends Controller
{
    // Muestra la vista con el formulario de login
    public function form()
    {
        return view('auth.login');
    }

    // Procesa el login del usuario
    public function login(LoginRequest $request)
    {
        $credentials = $request->validated();

        if (Auth::attempt($credentials)) {
            $request->session()->regenerate();
            return redirect()->route('dashboard');
        } else {
            return back()->withErrors([
                'fail' => 'Error al intentar iniciar sesion'
            ]);
        }
    }

    // Procesa el logout del usuario
    public function logout()
    {
        Auth::logout();

        return redirect()->route('login');
    }
}
