<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EstadoCita extends Model
{
    use HasFactory;

    const CONFIRMADA = 'Confirmada';
    const FINALIZADA = 'Finalizada';

    protected $table = 'estados_cita';
    protected $primaryKey = 'id_estado';
    protected $fillable = ['nombre_estado'];

    public static function confirmada(): self { return static::where('nombre_estado', self::CONFIRMADA)->firstOrFail(); }
    public static function finalizada(): self { return static::where('nombre_estado', self::FINALIZADA)->firstOrFail(); }

    public function citas()
    {
        return $this->hasMany(Cita::class, 'id_estado', 'id_estado');
    }
}
