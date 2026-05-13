<?php

namespace App\Enums;

enum Estado: string
{
    case PENDIENTE = 'Pendiente';
    case EN_PROGRESO = 'En progreso';
    case VALIDADA = 'Validada';
    case DESPLEGADA = 'Desplegada';
    case FINALIZADA = 'Finalizada';
}