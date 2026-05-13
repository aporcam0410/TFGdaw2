<?php

namespace App\Http\Controllers;

use App\Models\Usuario;
use App\Models\Rol;
use App\Http\Requests\StoreUsuarioRequest;
use App\Http\Requests\UpdateUsuarioRequest;
use Illuminate\Support\Facades\Auth;

class UsuarioController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function index()
    {
        /** @var \App\Models\Usuario $usuarioAuth */
        $usuarioAuth = Auth::user();

        $usuarios = $usuarioAuth->isAdmin()
            ? Usuario::with('rol')->get()
            : Usuario::with('rol')->where('id', $usuarioAuth->id)->get();

        return view('usuarios.index', compact('usuarios'));
    }

    public function show(Usuario $usuario)
    {
        /** @var \App\Models\Usuario $usuarioAuth */
        $usuarioAuth = Auth::user();

        if (!$usuarioAuth->isAdmin() && $usuario->id !== $usuarioAuth->id) {
            abort(403);
        }

        return view('usuarios.show', compact('usuario'));
    }

    public function create()
    {
        if (!Auth::user()->isAdmin()) {
            abort(403, 'No tienes permiso para crear usuarios.');
        }

        $roles = Rol::all();
        return view('usuarios.create', compact('roles'));
    }

    public function store(StoreUsuarioRequest $request)
    {
        $data = $request->validated();
        $data['fecha_registro'] = now();
        Usuario::create($data);

        return redirect()->route('usuarios.index')->with('success', 'Usuario creado correctamente.');
    }

    public function edit(Usuario $usuario)
    {
        /** @var \App\Models\Usuario $usuarioAuth */
        $usuarioAuth = Auth::user();

        if (!$usuarioAuth->isAdmin() && $usuario->id !== $usuarioAuth->id) {
            abort(403);
        }

        $roles = $usuarioAuth->isAdmin() ? Rol::all() : null;

        return view('usuarios.edit', [
            'usuario' => $usuario,
            'roles'   => $roles,
            'isAdmin' => $usuarioAuth->isAdmin(),
        ]);
    }

    public function update(UpdateUsuarioRequest $request, Usuario $usuario)
    {
        $usuario->update($request->validated());

        $redirectRoute = Auth::user()->isAdmin() ? 'usuarios.index' : 'usuarios.show';
        return redirect()->route($redirectRoute, Auth::user()->isAdmin() ? [] : $usuario)->with('success', 'Usuario actualizado correctamente.');
    }

    public function destroy(Usuario $usuario)
    {
        /** @var \App\Models\Usuario $usuarioAuth */
        $usuarioAuth = Auth::user();

        if (!$usuarioAuth->isAdmin()) {
            abort(403, 'No tienes permiso para eliminar usuarios.');
        }

        if ($usuario->id === $usuarioAuth->id) {
            return redirect()->route('usuarios.index')->with('error', 'No puedes eliminar tu propio usuario.');
        }

        $usuario->delete();
        return redirect()->route('usuarios.index')->with('success', 'Usuario eliminado correctamente.');
    }
}
