@extends('layout')

@section('title', 'Mis Citas')

@section('content')
<div class="d-flex justify-content-between align-items-center mb-3">
    <h2>Citas</h2>
    <a href="{{ route('citas.create') }}" class="btn btn-success">Nueva Cita</a>
</div>

@if($citas->isEmpty())
    <div class="alert alert-info">No hay citas registradas.</div>
@else
<div class="table-responsive">
    <table class="table table-hover align-middle">
        <thead class="table-primary">
            <tr>
                <th>Fecha</th>
                <th>Hora</th>
                <th>Psicologo</th>
                <th>Servicio</th>
                <th>Modalidad</th>
                <th>Estado</th>
                <th>Acciones</th>
            </tr>
        </thead>
        <tbody>
            @foreach($citas as $cita)
            <tr>
                <td>{{ $cita->fecha?->format('d/m/Y') }}</td>
                <td>{{ $cita->hora }}</td>
                <td>{{ $cita->psicologo?->nombre ?? 'N/A' }}</td>
                <td>{{ $cita->servicio?->nombre_servicio ?? 'N/A' }}</td>
                <td>{{ $cita->modalidad?->nombre_modalidad ?? 'N/A' }}</td>
                <td>
                    <span class="badge bg-secondary">{{ $cita->estado?->nombre_estado ?? 'N/A' }}</span>
                </td>
                <td>
                    <a href="{{ route('citas.show', $cita->id_cita) }}" class="btn btn-sm btn-info">Ver</a>
                    <a href="{{ route('citas.edit', $cita->id_cita) }}" class="btn btn-sm btn-warning">Editar</a>
                    @if(auth()->user()->isAdmin() || $cita->puedeAnularse())
                    <form action="{{ route('citas.destroy', $cita->id_cita) }}" method="POST" style="display:inline;">
                        @csrf
                        @method('DELETE')
                        <button type="submit" class="btn btn-sm btn-danger"
                            onclick="return confirm('¿Anular esta cita?')">Anular</button>
                    </form>
                    @else
                    <span class="text-muted small">No anulable</span>
                    @endif
                </td>
            </tr>
            @endforeach
        </tbody>
    </table>
</div>
@endif

<a href="{{ route('dashboard') }}" class="btn btn-secondary mt-2">Volver al Dashboard</a>
@endsection
