@extends('layout')

@section('title', 'Psicologos')

@section('content')
<div class="d-flex justify-content-between align-items-center mb-3">
    <h2>Psicologos</h2>
    @if(auth()->user()->isAdmin())
    <a href="{{ route('psicologos.create') }}" class="btn btn-success">Nuevo Psicologo</a>
    @endif
</div>

@if($psicologos->isEmpty())
    <div class="alert alert-info">No hay psicologos registrados.</div>
@else
<div class="table-responsive">
    <table class="table table-hover align-middle">
        <thead class="table-primary">
            <tr>
                <th>Nombre</th>
                <th>Especialidad</th>
                <th>Email</th>
                <th>Telefono</th>
                <th>Servicios</th>
                <th>Acciones</th>
            </tr>
        </thead>
        <tbody>
            @foreach($psicologos as $psicologo)
            <tr>
                <td>{{ $psicologo->nombre }}</td>
                <td>{{ $psicologo->especialidad ?? 'N/A' }}</td>
                <td>{{ $psicologo->email }}</td>
                <td>{{ $psicologo->telefono ?? 'N/A' }}</td>
                <td>{{ $psicologo->servicios->pluck('nombre_servicio')->join(', ') ?: 'Ninguno' }}</td>
                <td>
                    <a href="{{ route('psicologos.show', $psicologo->id_psicologo) }}" class="btn btn-sm btn-info">Ver</a>
                    @if(auth()->user()->isAdmin())
                    <a href="{{ route('psicologos.edit', $psicologo->id_psicologo) }}" class="btn btn-sm btn-warning">Editar</a>
                    <form action="{{ route('psicologos.destroy', $psicologo->id_psicologo) }}" method="POST" style="display:inline;">
                        @csrf
                        @method('DELETE')
                        <button type="submit" class="btn btn-sm btn-danger"
                            onclick="return confirm('¿Eliminar este psicologo?')">Eliminar</button>
                    </form>
                    @endif
                </td>
            </tr>
            @endforeach
        </tbody>
    </table>
</div>
@endif
@endsection
