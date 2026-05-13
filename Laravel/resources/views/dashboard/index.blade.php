@extends('layout')
@section('title', 'Dashboard')
@section('content')
<h1>Dashboard - Clinica Psicologia</h1>
<p class="text-muted">Bienvenido, {{ $usuario->name }} {{ $usuario->apellidos }}</p>
<hr>

<h4>Proximas Citas</h4>
@if($citas->isEmpty())
    <div class="alert alert-info">No tienes citas registradas.</div>
@else
<div class="table-responsive mb-4">
    <table class="table table-sm table-hover">
        <thead class="table-primary">
            <tr>
                <th>Fecha</th>
                <th>Hora</th>
                <th>Psicologo</th>
                <th>Servicio</th>
                <th>Estado</th>
                <th></th>
            </tr>
        </thead>
        <tbody>
            @foreach($citas as $cita)
            <tr>
                <td>{{ $cita->fecha?->format('d/m/Y') }}</td>
                <td>{{ $cita->hora }}</td>
                <td>{{ $cita->psicologo?->nombre }}</td>
                <td>{{ $cita->servicio?->nombre_servicio }}</td>
                <td><span class="badge bg-secondary">{{ $cita->estado?->nombre_estado }}</span></td>
                <td><a href="{{ route('citas.show', $cita->id_cita) }}" class="btn btn-sm btn-info">Ver</a></td>
            </tr>
            @endforeach
        </tbody>
    </table>
</div>
@endif
<a href="{{ route('citas.index') }}" class="btn btn-outline-primary btn-sm mb-4">Ver todas las citas</a>

@if($usuario->isAdmin())
<h4>Ultimos Pacientes</h4>
@include('usuarios._list', ['usuarios' => $usuarios])
@endif
@endsection