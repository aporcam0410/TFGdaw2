<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Cita extends Model
{
    use HasFactory;

    protected $table = 'citas';
    protected $primaryKey = 'id_cita';
    protected $fillable = [
        'fecha',
        'hora',
        'observaciones',
        'fecha_creacion',
        'precio_final',
        'id_usuario',
        'id_psicologo',
        'id_servicio',
        'id_modalidad',
        'id_estado',
    ];

    protected function casts(): array
    {
        return [
            'fecha' => 'date',
            'fecha_creacion' => 'datetime',
        ];
    }

    public function usuario()
    {
        return $this->belongsTo(Usuario::class, 'id_usuario');
    }

    public function psicologo()
    {
        return $this->belongsTo(Psicologo::class, 'id_psicologo', 'id_psicologo');
    }

    public function servicio()
    {
        return $this->belongsTo(Servicio::class, 'id_servicio', 'id_servicio');
    }

    public function modalidad()
    {
        return $this->belongsTo(Modalidad::class, 'id_modalidad', 'id_modalidad');
    }

    public function estado()
    {
        return $this->belongsTo(EstadoCita::class, 'id_estado', 'id_estado');
    }

    public function puedeAnularse(): bool
    {
        return Carbon::today()->addDay()->lt($this->fecha);
    }
}
