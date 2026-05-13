<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Servicio extends Model
{
    use HasFactory;

    protected $table = 'servicios';
    protected $primaryKey = 'id_servicio';
    protected $fillable = ['nombre_servicio', 'descripcion', 'duracion_min', 'precio'];

    public function psicologos()
    {
        return $this->belongsToMany(Psicologo::class, 'psicologo_servicio', 'id_servicio', 'id_psicologo', 'id_servicio', 'id_psicologo');
    }

    public function citas()
    {
        return $this->hasMany(Cita::class, 'id_servicio', 'id_servicio');
    }
}
