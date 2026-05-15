<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use App\Enums\RoleSlug;
use Laravel\Sanctum\HasApiTokens;

class Usuario extends Authenticatable
{
    use HasFactory, HasApiTokens, Notifiable;

    protected $table = 'users';

    protected $fillable = [
        'name',
        'apellidos',
        'email',
        'password',
        'telefono',
        'fecha_nacimiento',
        'fecha_registro',
        'id_rol',
    ];

    protected $hidden = ['password'];

    protected function casts(): array
    {
        return [
            'password' => 'hashed',
            'fecha_nacimiento' => 'date',
            'fecha_registro' => 'datetime',
        ];
    }

    public function rol()
    {
        return $this->belongsTo(Rol::class, 'id_rol', 'id_rol');
    }

    public function citas()
    {
        return $this->hasMany(Cita::class, 'id_usuario');
    }

    public function isAdmin(): bool
    {
        return $this->rol && $this->rol->slug === RoleSlug::ADMIN->value;
    }

    public function sendPasswordResetNotification($token)
    {
        $url = env('FRONTEND_URL', 'http://localhost:3000')
            . '/reset-password?token=' . $token
            . '&email=' . urlencode($this->email);

        $this->notify(new \App\Notifications\ResetPasswordNotification($url));
    }
}
