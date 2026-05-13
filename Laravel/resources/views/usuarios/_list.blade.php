@if ($usuarios->isNotEmpty())
    <table class="table table-hover">
        <thead class="table-primary">
            <tr>
                <th>Nombre</th>
                <th>Apellidos</th>
                <th>Email</th>
                <th>Telefono</th>
                <th>Rol</th>
                <th>Acciones</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($usuarios as $usuario)
                <tr>
                    <td>{{ $usuario->name }}</td>
                    <td>{{ $usuario->apellidos ?? 'N/A' }}</td>
                    <td>{{ $usuario->email }}</td>
                    <td>{{ $usuario->telefono ?? 'N/A' }}</td>
                    <td>{{ $usuario->rol?->nombre_rol ?? 'N/A' }}</td>
                    <td>
                        <a href="{{ route('usuarios.show', $usuario) }}" class="btn btn-sm btn-info">Ver</a>
                        <a href="{{ route('usuarios.edit', $usuario) }}" class="btn btn-sm btn-warning">Editar</a>
                        @if(auth()->user()->isAdmin())
                        <form action="{{ route('usuarios.destroy', $usuario) }}" method="POST" style="display:inline">
                            @csrf
                            @method('DELETE')
                            <button type="submit" class="btn btn-sm btn-danger"
                                onclick="return confirm('¿Eliminar este usuario?')">Eliminar</button>
                        </form>
                        @endif
                    </td>
                </tr>
            @endforeach
        </tbody>
    </table>
@else
    <p>No hay usuarios para mostrar.</p>
@endif
