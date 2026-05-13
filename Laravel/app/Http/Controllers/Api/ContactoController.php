<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\ContactoMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;

class ContactoController extends Controller
{
    public function send(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nombre'  => 'required|string|max:100',
            'email'   => 'required|email|max:150',
            'asunto'  => 'required|string|max:200',
            'mensaje' => 'required|string|max:2000',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $validator->validated();

        Mail::to('aporcam0410@g.educaand.es')->send(
            new ContactoMail($data['nombre'], $data['email'], $data['asunto'], $data['mensaje'])
        );

        return response()->json(['message' => 'Mensaje enviado correctamente.'], 200);
    }
}
