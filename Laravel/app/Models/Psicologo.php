<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Psicologo extends Model
{
    use HasFactory;

    protected $table = 'psicologos';
    protected $primaryKey = 'id_psicologo';
    protected $fillable = ['nombre', 'especialidad', 'email', 'telefono', 'descripcion', 'foto'];

    public function servicios()
    {
        return $this->belongsToMany(Servicio::class, 'psicologo_servicio', 'id_psicologo', 'id_servicio', 'id_psicologo', 'id_servicio');
    }

    public function citas()
    {
        return $this->hasMany(Cita::class, 'id_psicologo', 'id_psicologo');
    }
}
