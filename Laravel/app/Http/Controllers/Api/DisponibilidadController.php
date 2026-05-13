<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cita;
use App\Models\Servicio;
use Carbon\Carbon;
use Illuminate\Http\Request;

class DisponibilidadController extends Controller
{
    // Horario laboral: Lun-Vie 9-20h, Sáb 9-14h, Dom cerrado
    private const HORARIO = [
        1 => ['open' => '09:00', 'close' => '20:00'], // Lun
        2 => ['open' => '09:00', 'close' => '20:00'], // Mar
        3 => ['open' => '09:00', 'close' => '20:00'], // Mié
        4 => ['open' => '09:00', 'close' => '20:00'], // Jue
        5 => ['open' => '09:00', 'close' => '20:00'], // Vie
        6 => ['open' => '09:00', 'close' => '14:00'], // Sáb
        7 => null,                                      // Dom cerrado
    ];

    public function index(Request $request)
    {
        $request->validate([
            'fecha'       => 'required|date|after_or_equal:today',
            'id_servicio' => 'required|exists:servicios,id_servicio',
        ]);

        $fecha      = $request->fecha;
        $idServicio = $request->id_servicio;

        $date     = Carbon::parse($fecha);
        $diaSemana = $date->isoWeekday(); // 1=Lun, 7=Dom

        $horario = self::HORARIO[$diaSemana] ?? null;
        if (!$horario) {
            return response()->json([]); // domingo cerrado
        }

        $servicio   = Servicio::with('psicologos')->findOrFail($idServicio);
        $psicologos = $servicio->psicologos;

        if ($psicologos->isEmpty()) {
            return response()->json([]);
        }

        // Paso del slot: duración del servicio (mínimo 60 min)
        $pasoMinutos = max(60, (int) $servicio->duracion_min);

        // Citas ya reservadas ese día para esos psicólogos (no anuladas)
        $citasDelDia = Cita::whereDate('fecha', $fecha)
            ->whereIn('id_psicologo', $psicologos->pluck('id_psicologo'))
            ->whereHas('estado', fn($q) => $q->where('nombre_estado', '!=', 'Anulada'))
            ->get()
            ->groupBy('id_psicologo');

        // Generar slots dentro del horario
        [$hOpen, $mOpen]   = explode(':', $horario['open']);
        [$hClose, $mClose] = explode(':', $horario['close']);

        $inicioMin = (int)$hOpen  * 60 + (int)$mOpen;
        $cierreMin = (int)$hClose * 60 + (int)$mClose;

        $esHoy      = Carbon::parse($fecha)->isToday();
        $ahoraMin   = $esHoy ? (now()->hour * 60 + now()->minute) : 0;

        $slots   = [];
        $current = $inicioMin;

        while ($current + $servicio->duracion_min <= $cierreMin) {
            $hora = sprintf('%02d:%02d', intdiv($current, 60), $current % 60);

            if ($esHoy && $current <= $ahoraMin) {
                $current += $pasoMinutos;
                continue;
            }

            // Buscar el primer psicólogo libre a esa hora
            foreach ($psicologos as $psic) {
                $citasPsic = $citasDelDia->get($psic->id_psicologo, collect());

                // Verificar colisión: ocupado si existe cita en [hora, hora+duracion)
                $ocupado = $citasPsic->contains(function ($c) use ($current, $pasoMinutos) {
                    [$ch, $cm] = explode(':', substr($c->hora, 0, 5));
                    $citaMin = (int)$ch * 60 + (int)$cm;
                    return $citaMin >= $current && $citaMin < $current + $pasoMinutos;
                });

                if (!$ocupado) {
                    $slots[] = [
                        'hora'             => $hora,
                        'id_psicologo'     => $psic->id_psicologo,
                        'nombre_psicologo' => $psic->nombre,
                        'especialidad'     => $psic->especialidad,
                    ];
                    break; // primer psicólogo libre para este slot
                }
            }

            $current += $pasoMinutos;
        }

        return response()->json($slots);
    }
}
