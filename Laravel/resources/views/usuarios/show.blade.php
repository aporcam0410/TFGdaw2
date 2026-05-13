@extends('layout')

@section('title', 'Ver Usuario')

@section('content')
<div class="row">
    <div class="col-md-8">
        <div class="card">
            <div class="card-header bg-primary text-white">
                <h4 class="mb-0">{{ $usuario->name }}</h4>
            </div>
            <div class="card-body">
                <div class="mb-3">
                    <strong>Nombre:</strong> {{ $usuario->name }} {{ $usuario->apellidos }}
                </div>
                <div class="mb-3">
                    <strong>Email:</strong> {{ $usuario->email }}
                </div>
                <div class="mb-3">
                    <strong>Telefono:</strong> {{ $usuario->telefono ?? 'N/A' }}
                </div>
                <div class="mb-3">
                    <strong>Fecha de nacimiento:</strong> {{ $usuario->fecha_nacimiento?->format('d/m/Y') ?? 'N/A' }}
                </div>
                <div class="mb-3">
                    <strong>Fecha de registro:</strong> {{ $usuario->fecha_registro?->format('d/m/Y') ?? 'N/A' }}
                </div>
                <div class="mb-3">
                    <strong>Rol:</strong> {{ $usuario->rol?->nombre_rol ?? 'N/A' }}
                </div>

                <div class="d-flex gap-2">
                    <a href="{{ route('usuarios.edit', $usuario->id) }}" class="btn btn-warning">Editar</a>
                    <a href="{{ route('usuarios.index') }}" class="btn btn-secondary">Volver</a>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
