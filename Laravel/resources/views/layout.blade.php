<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title', 'Clinica Psicologia')</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
</head>
<body>
    @if(auth()->check())
    <nav class="navbar navbar-expand-lg navbar-dark" style="background-color: #4a6fa5;">
        <div class="container">
            <a class="navbar-brand fw-bold" href="{{ route('dashboard') }}">Clinica Psicologia</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav me-auto">
                    <li class="nav-item"><a class="nav-link" href="{{ route('dashboard') }}">Dashboard</a></li>
                    <li class="nav-item"><a class="nav-link" href="{{ route('citas.index') }}">Citas</a></li>
                    <li class="nav-item"><a class="nav-link" href="{{ route('psicologos.index') }}">Psicologos</a></li>
                    <li class="nav-item"><a class="nav-link" href="{{ route('servicios.index') }}">Servicios</a></li>
                    @if(auth()->user()->isAdmin())
                    <li class="nav-item"><a class="nav-link" href="{{ route('usuarios.index') }}">Usuarios</a></li>
                    @endif
                </ul>
                <ul class="navbar-nav">
                    <li class="nav-item">
                        <span class="nav-link text-light">{{ auth()->user()->name }}</span>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="{{ route('logout') }}">Cerrar sesion</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
    @endif

    <div class="container mt-4">
        @if($errors->any())
        <div class="alert alert-danger">
            <strong>Errores:</strong>
            <ul class="mb-0">
                @foreach($errors->all() as $error)
                    <li>{{ $error }}</li>
                @endforeach
            </ul>
        </div>
        @endif

        @if(session()->has('success'))
        <div class="alert alert-success">{{ session('success') }}</div>
        @endif

        @if(session()->has('error'))
        <div class="alert alert-danger">{{ session('error') }}</div>
        @endif

        @yield('content')
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
