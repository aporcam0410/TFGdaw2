@extends('layout')

@section('title', 'Editar Cita')

@section('content')
<h2>Editar Cita #{{ $cita->id_cita }}</h2>

<form action="{{ route('citas.update', $cita->id_cita) }}" method="POST" class="card p-4">
    @csrf
    @method('PUT')

    <div class="row">
        <div class="col-md-6 mb-3">
            <label class="form-label">Fecha *</label>
            <input type="date" name="fecha" class="form-control @error('fecha') is-invalid @enderror"
                   value="{{ old('fecha', $cita->fecha?->format('Y-m-d')) }}" required
                   min="{{ date('Y-m-d', strtotime('+1 day')) }}">
        </div>
        <div class="col-md-6 mb-3">
            <label class="form-label">Hora *</label>
            <input type="time" name="hora" class="form-control @error('hora') is-invalid @enderror"
                   value="{{ old('hora', $cita->hora) }}" required>
        </div>
    </div>

    <div class="mb-3">
        <label class="form-label">Psicologo *</label>
        <select name="id_psicologo" class="form-select @error('id_psicologo') is-invalid @enderror" required>
            <option value="">-- Seleccionar --</option>
            @foreach($psicologos as $p)
                <option value="{{ $p->id_psicologo }}"
                    @selected(old('id_psicologo', $cita->id_psicologo) == $p->id_psicologo)>
                    {{ $p->nombre }} ({{ $p->especialidad }})
                </option>
            @endforeach
        </select>
    </div>

    <div class="mb-3">
        <label class="form-label">Servicio *</label>
        <select name="id_servicio" class="form-select @error('id_servicio') is-invalid @enderror" required>
            <option value="">-- Seleccionar --</option>
            @foreach($servicios as $s)
                <option value="{{ $s->id_servicio }}"
                    @selected(old('id_servicio', $cita->id_servicio) == $s->id_servicio)>
                    {{ $s->nombre_servicio }} ({{ $s->duracion_min }} min - {{ $s->precio }}€)
                </option>
            @endforeach
        </select>
    </div>

    <div class="mb-3">
        <label class="form-label">Modalidad *</label>
        <select name="id_modalidad" class="form-select @error('id_modalidad') is-invalid @enderror" required>
            <option value="">-- Seleccionar --</option>
            @foreach($modalidades as $m)
                <option value="{{ $m->id_modalidad }}"
                    @selected(old('id_modalidad', $cita->id_modalidad) == $m->id_modalidad)>
                    {{ $m->nombre_modalidad }}
                </option>
            @endforeach
        </select>
    </div>

    <div class="mb-3">
        <label class="form-label">Estado *</label>
        <select name="id_estado" class="form-select @error('id_estado') is-invalid @enderror" required>
            <option value="">-- Seleccionar --</option>
            @foreach($estados as $e)
                <option value="{{ $e->id_estado }}"
                    @selected(old('id_estado', $cita->id_estado) == $e->id_estado)>
                    {{ $e->nombre_estado }}
                </option>
            @endforeach
        </select>
    </div>

    <div class="mb-3">
        <label class="form-label">Observaciones</label>
        <textarea name="observaciones" class="form-control" rows="3">{{ old('observaciones', $cita->observaciones) }}</textarea>
    </div>

    <div class="mb-3">
        <label class="form-label">Precio final (€)</label>
        <input type="number" name="precio_final" class="form-control"
               value="{{ old('precio_final', $cita->precio_final) }}" min="0">
    </div>

    <div class="d-flex gap-2">
        <button type="submit" class="btn btn-primary">Actualizar</button>
        <a href="{{ route('citas.index') }}" class="btn btn-secondary">Cancelar</a>
    </div>
</form>
@endsection
