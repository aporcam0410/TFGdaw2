@extends('layout')

@section('title', 'Usuarios')

@section('content')
<hr>
<div class="row mb-4">
    <div class="col-md-12">
        <h2>Usuarios</h2>
        @if(auth()->user()->isAdmin())
        <a href="{{ route('usuarios.create') }}" class="btn btn-success">Crear Nuevo Usuario</a>
        @endif
    </div>
</div>

@include('usuarios._list', ['usuarios' => $usuarios])
<br>
<div class="mt-3">
    <a href="{{ route('dashboard') }}" class="btn btn-secondary">Volver al Dashboard</a>
</div>
@endsection
