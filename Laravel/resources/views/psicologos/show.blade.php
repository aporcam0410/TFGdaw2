@extends('layout')

@section('title', 'Psicologo')

@section('content')
<div class="col-md-8">
    <div class="card">
        <div class="card-header bg-primary text-white">
            <h4 class="mb-0">{{ $psicologo->nombre }}</h4>
        </div>
        <div class="card-body">
            <p><strong>Especialidad:</strong> {{ $psicologo->especialidad ?? 'N/A' }}</p>
            <p><strong>Email:</strong> {{ $psicologo->email }}</p>
            <p><strong>Telefono:</strong> {{ $psicologo->telefono ?? 'N/A' }}</p>
            <p><strong>Servicios:</strong>
                @if($psicologo->servicios->isNotEmpty())
                    {{ $psicologo->servicios->pluck('nombre_servicio')->join(', ') }}
                @else
                    Ninguno asignado
                @endif
            </p>
            <div class="d-flex gap-2 mt-3">
                @if(auth()->user()->isAdmin())
                <a href="{{ route('psicologos.edit', $psicologo->id_psicologo) }}" class="btn btn-warning">Editar</a>
                <form action="{{ route('psicologos.destroy', $psicologo->id_psicologo) }}" method="POST" style="display:inline;">
                    @csrf
                    @method('DELETE')
                    <button type="submit" class="btn btn-danger"
                        onclick="return confirm('¿Eliminar este psicologo?')">Eliminar</button>
                </form>
                @endif
                <a href="{{ route('psicologos.index') }}" class="btn btn-secondary">Volver</a>
            </div>
        </div>
    </div>
</div>
@endsection
