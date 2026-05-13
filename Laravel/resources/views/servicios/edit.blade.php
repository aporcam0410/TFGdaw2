@extends('layout')

@section('title', 'Editar Servicio')

@section('content')
<h2>Editar Servicio</h2>

<form action="{{ route('servicios.update', $servicio->id_servicio) }}" method="POST" class="card p-4">
    @csrf
    @method('PUT')

    <div class="mb-3">
        <label class="form-label">Nombre del servicio *</label>
        <input type="text" name="nombre_servicio" class="form-control @error('nombre_servicio') is-invalid @enderror"
               value="{{ old('nombre_servicio', $servicio->nombre_servicio) }}" required>
    </div>

    <div class="mb-3">
        <label class="form-label">Descripcion</label>
        <textarea name="descripcion" class="form-control" rows="3">{{ old('descripcion', $servicio->descripcion) }}</textarea>
    </div>

    <div class="row">
        <div class="col-md-6 mb-3">
            <label class="form-label">Duracion (minutos) *</label>
            <input type="number" name="duracion_min" class="form-control @error('duracion_min') is-invalid @enderror"
                   value="{{ old('duracion_min', $servicio->duracion_min) }}" required min="15">
        </div>
        <div class="col-md-6 mb-3">
            <label class="form-label">Precio (€) *</label>
            <input type="number" name="precio" class="form-control @error('precio') is-invalid @enderror"
                   value="{{ old('precio', $servicio->precio) }}" required min="0">
        </div>
    </div>

    <div class="d-flex gap-2">
        <button type="submit" class="btn btn-primary">Actualizar</button>
        <a href="{{ route('servicios.index') }}" class="btn btn-secondary">Cancelar</a>
    </div>
</form>
@endsection
