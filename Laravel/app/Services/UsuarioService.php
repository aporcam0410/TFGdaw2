<?php

namespace App\Services;
use App\Models\Usuario;

class UsuarioService
  {
public function crearUsuario( array $datos ) :Usuario
    {
        return Usuario::create( $datos );
    }


  }  