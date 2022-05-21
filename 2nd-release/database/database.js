import pg from 'pg';

const dbData = {
    host: 'localhost',
    user: 'alphauser',
    password: process.env.BD_PASS || "alpha",
    database: process.env.BD_NAME || "game_socket",
    max: process.env.BD_MAX||20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
};

// ==> Conexão com a Base de Dados:
const pool = new pg.Pool(dbData);

pool.on('connect', () => 
{
  //console.log('Base de Dados conectado com sucesso!');
});

export default {
  query: (text, params) => pool.query(text, params),
};