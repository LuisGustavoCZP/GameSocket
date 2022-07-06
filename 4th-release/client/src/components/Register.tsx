function Register() 
{
    return (
    <section className="modal">
        <h2>Register</h2>
        <form className="block">
            <span>
                <label htmlFor="username">Usuario</label>
                <input type="text" name="username" id="username" />
            </span>
            <span>
                <label htmlFor="password">Senha</label>
                <input type="password" name="password" id="password" />
            </span>
            <input type="submit" value="Registrar" />
        </form>
    </section>
    );
}

export { Register };