@extends('layout')

@section('title', 'Detalle de Cita')

@section('content')
<div class="row">
    <div class="col-md-8">
        <div class="card">
            <div class="card-header bg-primary text-white d-flex justify-content-between">
                <h4 class="mb-0">Cita #{{ $cita->id_cita }}</h4>
                <span class="badge bg-light text-dark fs-6">{{ $cita->estado?->nombre_estado }}</span>
            </div>
            <div class="card-body">
                <div class="row mb-3">
                    <div class="col-md-6">
                        <p><strong>Fecha:</strong> {{ $cita->fecha?->format('d/m/Y') }}</p>
                        <p><strong>Hora:</strong> {{ $cita->hora }}</p>
                        <p><strong>Precio final:</strong> {{ $cita->precio_final ? $cita->precio_final . ' €' : 'N/A' }}</p>
                    </div>
                    <div class="col-md-6">
                        <p><strong>Psicologo:</strong> {{ $cita->psicologo?->nombre }}</p>
                        <p><strong>Servicio:</strong> {{ $cita->servicio?->nombre_servicio }}</p>
                        <p><strong>Modalidad:</strong> {{ $cita->modalidad?->nombre_modalidad }}</p>
                    </div>
                </div>
                <div class="row mb-3">
                    <div class="col-12">
                        <p><strong>Paciente:</strong> {{ $cita->usuario?->name }} {{ $cita->usuario?->apellidos }}</p>
                        <p><strong>Observaciones:</strong> {{ $cita->observaciones ?? 'Ninguna' }}</p>
                        <p><strong>Fecha de creacion:</strong> {{ $cita->fecha_creacion?->format('d/m/Y H:i') }}</p>
                    </div>
                </div>

                <div class="d-flex gap-2">
                    <a href="{{ route('citas.edit', $cita->id_cita) }}" class="btn btn-warning">Editar</a>
                    <a href="{{ route('citas.index') }}" class="btn btn-secondary">Volver</a>
                    @if(auth()->user()->isAdmin() || $cita->puedeAnularse())
                    <form action="{{ route('citas.destroy', $cita->id_cita) }}" method="POST" style="display:inline;">
                        @csrf
                        @method('DELETE')
                        <button type="submit" class="btn btn-danger"
                            onclick="return confirm('¿Anular esta cita?')">Anular</button>
                    </form>
                    @else
                    <span class="text-muted align-self-center">No se puede anular (menos de 1 dia de antelacion)</span>
                    @endif
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
