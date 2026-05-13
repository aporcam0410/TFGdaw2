<form method="POST" action="{{ route('login') }}">
    @csrf

    <div>
        <input 
            type="text" 
            name="email"
            placeholder="Email"
            value="{{ old('email') }}"
        >

    </div>

    <div>
        <input 
            type="password" 
            name="password"
            placeholder="Contraseña"
        >

    </div>

    <button type="submit">Entrar</button>
    @error('fail')
        <div>
            <small style="color:red;">
                {{ $message }}
            </small>
        </div>
    @enderror
</form>
