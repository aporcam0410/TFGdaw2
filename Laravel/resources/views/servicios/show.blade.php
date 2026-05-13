@extends('layout')

@section('title', 'Servicio')

@section('content')
<div class="col-md-8">
    <div class="card">
        <div class="card-header bg-primary text-white">
            <h4 class="mb-0">{{ $servicio->nombre_servicio }}</h4>
        </div>
        <div class="card-body">
            <p><strong>Descripcion:</strong> {{ $servicio->descripcion ?? 'N/A' }}</p>
            <p><strong>Duracion:</strong> {{ $servicio->duracion_min }} minutos</p>
            <p><strong>Precio:</strong> {{ $servicio->precio }} €</p>
            <p><strong>Psicologos que lo ofrecen:</strong>
                @if($servicio->psicologos->isNotEmpty())
                    {{ $servicio->psicologos->pluck('nombre')->join(', ') }}
                @else
                    Ninguno asignado
                @endif
            </p>
            <div class="d-flex gap-2 mt-3">
                @if(auth()->user()->isAdmin())
                <a href="{{ route('servicios.edit', $servicio->id_servicio) }}" class="btn btn-warning">Editar</a>
                <form action="{{ route('servicios.destroy', $servicio->id_servicio) }}" method="POST" style="display:inline;">
                    @csrf
                    @method('DELETE')
                    <button type="submit" class="btn btn-danger"
                        onclick="return confirm('¿Eliminar este servicio?')">Eliminar</button>
                </form>
                @endif
                <a href="{{ route('servicios.index') }}" class="btn btn-secondary">Volver</a>
            </div>
        </div>
    </div>
</div>
@endsection
