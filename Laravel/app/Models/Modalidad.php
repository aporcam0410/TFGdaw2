<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Modalidad extends Model
{
    use HasFactory;

    protected $table = 'modalidades';
    protected $primaryKey = 'id_modalidad';
    protected $fillable = ['nombre_modalidad'];

    public function citas()
    {
        return $this->hasMany(Cita::class, 'id_modalidad', 'id_modalidad');
    }
}
