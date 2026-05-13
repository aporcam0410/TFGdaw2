<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EstadoCita extends Model
{
    use HasFactory;

    const APROBADO   = 'Aprobado';
    const FINALIZADO = 'Finalizado';
    const ANULADA    = 'Anulada';

    protected $table = 'estados_cita';
    protected $primaryKey = 'id_estado';
    protected $fillable = ['nombre_estado'];

    public static function aprobado():   self { return static::where('nombre_estado', self::APROBADO)->firstOrFail(); }
    public static function finalizado(): self { return static::where('nombre_estado', self::FINALIZADO)->firstOrFail(); }
    public static function anulada():    self { return static::where('nombre_estado', self::ANULADA)->firstOrFail(); }

    public function citas()
    {
        return $this->hasMany(Cita::class, 'id_estado', 'id_estado');
    }
}
