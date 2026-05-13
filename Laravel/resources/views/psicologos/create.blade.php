@extends('layout')

@section('title', 'Nuevo Psicologo')

@section('content')
<h2>Nuevo Psicologo</h2>

<form action="{{ route('psicologos.store') }}" method="POST" class="card p-4">
    @csrf

    <div class="mb-3">
        <label class="form-label">Nombre *</label>
        <input type="text" name="nombre" class="form-control @error('nombre') is-invalid @enderror"
               value="{{ old('nombre') }}" required>
    </div>

    <div class="mb-3">
        <label class="form-label">Especialidad</label>
        <input type="text" name="especialidad" class="form-control"
               value="{{ old('especialidad') }}">
    </div>

    <div class="mb-3">
        <label class="form-label">Email *</label>
        <input type="email" name="email" class="form-control @error('email') is-invalid @enderror"
               value="{{ old('email') }}" required>
    </div>

    <div class="mb-3">
        <label class="form-label">Telefono</label>
        <input type="text" name="telefono" class="form-control"
               value="{{ old('telefono') }}">
    </div>

    <div class="mb-3">
        <label class="form-label">Servicios</label>
        <select name="servicios[]" class="form-select" multiple>
            @foreach($servicios as $s)
                <option value="{{ $s->id_servicio }}"
                    @if(in_array($s->id_servicio, old('servicios', []))) selected @endif>
                    {{ $s->nombre_servicio }}
                </option>
            @endforeach
        </select>
        <small class="text-muted">Mantener Ctrl para seleccionar varios</small>
    </div>

    <div class="d-flex gap-2">
        <button type="submit" class="btn btn-primary">Guardar</button>
        <a href="{{ route('psicologos.index') }}" class="btn btn-secondary">Cancelar</a>
    </div>
</form>
@endsection
