@extends('layout')

@section('title', 'Servicios')

@section('content')
<div class="d-flex justify-content-between align-items-center mb-3">
    <h2>Servicios</h2>
    @if(auth()->user()->isAdmin())
    <a href="{{ route('servicios.create') }}" class="btn btn-success">Nuevo Servicio</a>
    @endif
</div>

@if($servicios->isEmpty())
    <div class="alert alert-info">No hay servicios registrados.</div>
@else
<div class="table-responsive">
    <table class="table table-hover align-middle">
        <thead class="table-primary">
            <tr>
                <th>Nombre</th>
                <th>Descripcion</th>
                <th>Duracion (min)</th>
                <th>Precio (€)</th>
                <th>Acciones</th>
            </tr>
        </thead>
        <tbody>
            @foreach($servicios as $servicio)
            <tr>
                <td>{{ $servicio->nombre_servicio }}</td>
                <td>{{ Str::limit($servicio->descripcion, 60) ?? 'N/A' }}</td>
                <td>{{ $servicio->duracion_min }}</td>
                <td>{{ $servicio->precio }}</td>
                <td>
                    <a href="{{ route('servicios.show', $servicio->id_servicio) }}" class="btn btn-sm btn-info">Ver</a>
                    @if(auth()->user()->isAdmin())
                    <a href="{{ route('servicios.edit', $servicio->id_servicio) }}" class="btn btn-sm btn-warning">Editar</a>
                    <form action="{{ route('servicios.destroy', $servicio->id_servicio) }}" method="POST" style="display:inline;">
                        @csrf
                        @method('DELETE')
                        <button type="submit" class="btn btn-sm btn-danger"
                            onclick="return confirm('¿Eliminar este servicio?')">Eliminar</button>
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
