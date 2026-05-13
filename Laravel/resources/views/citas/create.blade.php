@extends('layout')

@section('title', 'Nueva Cita')

@section('content')
<h2>Nueva Cita</h2>

<form action="{{ route('citas.store') }}" method="POST" class="card p-4">
    @csrf

    <div class="row">
        <div class="col-md-6 mb-3">
            <label class="form-label">Fecha *</label>
            <input type="date" name="fecha" class="form-control @error('fecha') is-invalid @enderror"
                   value="{{ old('fecha') }}" required min="{{ date('Y-m-d', strtotime('+1 day')) }}">
            @error('fecha')<div class="invalid-feedback">{{ $message }}</div>@enderror
        </div>
        <div class="col-md-6 mb-3">
            <label class="form-label">Hora *</label>
            <input type="time" name="hora" class="form-control @error('hora') is-invalid @enderror"
                   value="{{ old('hora') }}" required>
            @error('hora')<div class="invalid-feedback">{{ $message }}</div>@enderror
        </div>
    </div>

    <div class="mb-3">
        <label class="form-label">Servicio *</label>
        <select id="id_servicio" name="id_servicio" class="form-select @error('id_servicio') is-invalid @enderror" required>
            <option value="">-- Seleccionar --</option>
            @foreach($servicios as $s)
                <option value="{{ $s->id_servicio }}" @selected(old('id_servicio') == $s->id_servicio)>
                    {{ $s->nombre_servicio }} ({{ $s->duracion_min }} min)
                </option>
            @endforeach
        </select>
        @error('id_servicio')<div class="invalid-feedback">{{ $message }}</div>@enderror
    </div>

    <div class="row">
        <div class="col-md-6 mb-3">
            <label class="form-label">Psicólogo asignado</label>
            <input type="text" id="psicologo_display" class="form-control" readonly placeholder="Se asigna al elegir servicio">
        </div>
        <div class="col-md-6 mb-3">
            <label class="form-label">Precio final (€)</label>
            <input type="text" id="precio_display" class="form-control" readonly placeholder="Se rellena al elegir servicio">
        </div>
    </div>

    <div class="mb-3">
        <label class="form-label">Modalidad *</label>
        <select name="id_modalidad" class="form-select @error('id_modalidad') is-invalid @enderror" required>
            <option value="">-- Seleccionar --</option>
            @foreach($modalidades as $m)
                <option value="{{ $m->id_modalidad }}" @selected(old('id_modalidad') == $m->id_modalidad)>
                    {{ $m->nombre_modalidad }}
                </option>
            @endforeach
        </select>
        @error('id_modalidad')<div class="invalid-feedback">{{ $message }}</div>@enderror
    </div>

    <div class="mb-3">
        <label class="form-label">Observaciones</label>
        <textarea name="observaciones" class="form-control" rows="3">{{ old('observaciones') }}</textarea>
    </div>

    <div class="d-flex gap-2">
        <button type="submit" class="btn btn-primary">Guardar</button>
        <a href="{{ route('citas.index') }}" class="btn btn-secondary">Cancelar</a>
    </div>
</form>

<script>
const serviciosData = @json($serviciosData);

document.getElementById('id_servicio').addEventListener('change', function () {
    const data = serviciosData[this.value];
    if (data) {
        document.getElementById('psicologo_display').value = data.psicologo_nombre;
        document.getElementById('precio_display').value = data.precio + ' €';
    } else {
        document.getElementById('psicologo_display').value = '';
        document.getElementById('precio_display').value = '';
    }
});
</script>
@endsection
