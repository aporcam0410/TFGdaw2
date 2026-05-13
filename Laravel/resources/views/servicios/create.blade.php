@extends('layout')

@section('title', 'Nuevo Servicio')

@section('content')
<h2>Nuevo Servicio</h2>

<form action="{{ route('servicios.store') }}" method="POST" class="card p-4">
    @csrf

    <div class="mb-3">
        <label class="form-label">Nombre del servicio *</label>
        <input type="text" name="nombre_servicio" class="form-control @error('nombre_servicio') is-invalid @enderror"
               value="{{ old('nombre_servicio') }}" required>
    </div>

    <div class="mb-3">
        <label class="form-label">Descripcion</label>
        <textarea name="descripcion" class="form-control" rows="3">{{ old('descripcion') }}</textarea>
    </div>

    <div class="row">
        <div class="col-md-6 mb-3">
            <label class="form-label">Duracion (minutos) *</label>
            <input type="number" name="duracion_min" class="form-control @error('duracion_min') is-invalid @enderror"
                   value="{{ old('duracion_min', 50) }}" required min="15">
        </div>
        <div class="col-md-6 mb-3">
            <label class="form-label">Precio (€) *</label>
            <input type="number" name="precio" class="form-control @error('precio') is-invalid @enderror"
                   value="{{ old('precio', 0) }}" required min="0">
        </div>
    </div>

    <div class="d-flex gap-2">
        <button type="submit" class="btn btn-primary">Guardar</button>
        <a href="{{ route('servicios.index') }}" class="btn btn-secondary">Cancelar</a>
    </div>
</form>
@endsection
