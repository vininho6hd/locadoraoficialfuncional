const mysql = require('mysql2');

// Configuração do banco de dados
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // altere conforme seu usuário MySQL
    password: '', // altere conforme sua senha MySQL
    database: 'locadora_filmes'
});

// Conectar ao banco de dados
db.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        return;
    }
    console.log('Conectado ao banco de dados MySQL');
});

module.exports = db;