@extends('layout')

@section('title', 'Editar Usuario')

@section('content')
<div class="row">
    <div class="col-md-8">
        <h2>Editar Usuario</h2>
        
        <form method="POST" action="{{ route('usuarios.update', $usuario->id) }}" class="card p-4">
            @csrf
            @method('PUT')

            <div class="row">
                <div class="col-md-6 mb-3">
                    <label class="form-label">Nombre *</label>
                    <input type="text" name="name" class="form-control @error('name') is-invalid @enderror"
                           value="{{ old('name', $usuario->name) }}" required>
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label">Apellidos</label>
                    <input type="text" name="apellidos" class="form-control"
                           value="{{ old('apellidos', $usuario->apellidos) }}">
                </div>
            </div>

            <div class="mb-3">
                <label class="form-label">Email *</label>
                <input type="email" name="email" class="form-control @error('email') is-invalid @enderror"
                       value="{{ old('email', $usuario->email) }}" required>
            </div>

            <div class="row">
                <div class="col-md-6 mb-3">
                    <label class="form-label">Telefono</label>
                    <input type="text" name="telefono" class="form-control"
                           value="{{ old('telefono', $usuario->telefono) }}">
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label">Fecha de nacimiento</label>
                    <input type="date" name="fecha_nacimiento" class="form-control"
                           value="{{ old('fecha_nacimiento', $usuario->fecha_nacimiento?->format('Y-m-d')) }}">
                </div>
            </div>

            @if ($isAdmin && !empty($roles))
            <div class="mb-3">
                <label class="form-label">Rol *</label>
                <select name="id_rol" class="form-select @error('id_rol') is-invalid @enderror" required>
                    <option value="">-- Seleccionar --</option>
                    @foreach($roles as $rol)
                        <option value="{{ $rol->id_rol }}"
                            @selected(old('id_rol', $usuario->id_rol) == $rol->id_rol)>
                            {{ $rol->nombre_rol }}
                        </option>
                    @endforeach
                </select>
            </div>
            @endif

            <div class="mb-3">
                <label class="form-label">Contrasena</label>
                <input type="password" name="password" class="form-control @error('password') is-invalid @enderror">
                <small class="text-muted">Dejar en blanco para no cambiarla.</small>
            </div>
            <div class="mb-3">
                <label class="form-label">Confirmar Contrasena</label>
                <input type="password" name="password_confirmation" class="form-control">
            </div>

            <div class="d-flex gap-2">
                <button type="submit" class="btn btn-primary">Actualizar</button>
                <a href="{{ route('usuarios.index') }}" class="btn btn-secondary">Cancelar</a>
            </div>
        </form>
    </div>
</div>
@endsection
