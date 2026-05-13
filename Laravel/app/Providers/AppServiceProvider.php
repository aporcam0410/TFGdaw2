<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Route;
use Symfony\Component\Mailer\Transport\Smtp\EsmtpTransport;
use App\Models\Cita;
use App\Models\Psicologo;
use App\Models\Servicio;
use App\Models\Usuario;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        Route::model('cita', Cita::class);
        Route::bind('cita',      fn($v) => Cita::where('id_cita', $v)->firstOrFail());
        Route::bind('psicologo', fn($v) => Psicologo::where('id_psicologo', $v)->firstOrFail());
        Route::bind('servicio',  fn($v) => Servicio::where('id_servicio', $v)->firstOrFail());
        Route::bind('usuario',   fn($v) => Usuario::where('id', $v)->firstOrFail());

        Gate::define('admin', fn(Usuario $user) => $user->isAdmin());

        Mail::extend('smtp-noverify', function (array $config) {
            $transport = new EsmtpTransport($config['host'], $config['port'], false);
            $transport->getStream()->setStreamOptions([
                'ssl' => [
                    'verify_peer'       => false,
                    'verify_peer_name'  => false,
                    'allow_self_signed' => true,
                ],
            ]);
            $transport->setUsername($config['username']);
            $transport->setPassword($config['password']);
            return $transport;
        });
    }
}
