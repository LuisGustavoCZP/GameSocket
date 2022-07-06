function Login() 
{
    //JSON.stringify({ username, userpass }

    return (
    <section className="modal">
        <h2>Login</h2>
        <form className="block">
            <span>
                <label htmlFor="username">Usuario</label>
                <input type="text" name="username" id="username" />
            </span>
            <span>
                <label htmlFor="password">Senha</label>
                <input type="password" name="password" id="password" />
            </span>
            <input type="submit" value="Entrar" />
        </form>
    </section>
    );
}

export { Login };