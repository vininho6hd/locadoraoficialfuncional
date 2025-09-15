const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('../frontend'));

// Configuração do banco de dados
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
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

// Rotas da API

// Rota para a página inicial
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Rota para a página admin
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/admin.html'));
});

// Rota para acesso como convidado
app.post('/api/guest', (req, res) => {
    res.json({ 
        message: 'Acesso como convidado bem-sucedido', 
        user: { id: 0, nome: 'Convidado', email: 'guest@example.com' } 
    });
});

// Rota para registro de usuários
app.post('/api/register', async (req, res) => {
    const { nome, email, senha } = req.body;
    
    try {
        // Verificar se o usuário já existe
        const checkUserQuery = 'SELECT * FROM usuarios WHERE email = ?';
        db.query(checkUserQuery, [email], async (err, results) => {
            if (err) {
                console.error('Erro ao verificar usuário:', err);
                return res.status(500).json({ error: 'Erro no servidor' });
            }
            
            if (results.length > 0) {
                return res.status(400).json({ error: 'Usuário já existe' });
            }
            
            // Criptografar a senha
            const hashedPassword = await bcrypt.hash(senha, 10);
            
            // Inserir novo usuário
            const insertUserQuery = 'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)';
            db.query(insertUserQuery, [nome, email, hashedPassword], (err, results) => {
                if (err) {
                    console.error('Erro ao criar usuário:', err);
                    return res.status(500).json({ error: 'Erro ao criar usuário' });
                }
                
                res.status(201).json({ message: 'Usuário criado com sucesso' });
            });
        });
    } catch (error) {
        console.error('Erro no registro:', error);
        res.status(500).json({ error: 'Erro no servidor' });
    }
});

// Rota para login de usuários
app.post('/api/login', (req, res) => {
    const { email, senha } = req.body;
    
    // Buscar usuário pelo email
    const getUserQuery = 'SELECT * FROM usuarios WHERE email = ?';
    db.query(getUserQuery, [email], async (err, results) => {
        if (err) {
            console.error('Erro ao buscar usuário:', err);
            return res.status(500).json({ error: 'Erro no servidor' });
        }
        
        if (results.length === 0) {
            return res.status(400).json({ error: 'Credenciais inválidas' });
        }
        
        const user = results[0];
        
        // Verificar senha
        try {
            const validPassword = await bcrypt.compare(senha, user.senha);
            if (!validPassword) {
                return res.status(400).json({ error: 'Credenciais inválidas' });
            }
            
            res.json({ 
                message: 'Login bem-sucedido', 
                user: { id: user.id, nome: user.nome, email: user.email } 
            });
        } catch (error) {
            console.error('Erro ao verificar senha:', error);
            res.status(500).json({ error: 'Erro no servidor' });
        }
    });
});

// Rota para buscar filmes com filtros
app.get('/api/filmes', (req, res) => {
    const search = req.query.search || '';
    const genero = req.query.genero || '';
    const ano = req.query.ano || '';
    const diretor = req.query.diretor || '';
    
    let query = `
        SELECT f.*, 
               GROUP_CONCAT(DISTINCT s.plataforma SEPARATOR ', ') as plataformas
        FROM filmes f
        LEFT JOIN streaming s ON f.id = s.filme_id AND s.disponivel = true
        WHERE f.titulo LIKE ?
    `;
    
    let params = [`%${search}%`];
    
    if (genero) {
        query += ' AND f.genero LIKE ?';
        params.push(`%${genero}%`);
    }
    
    if (ano) {
        query += ' AND f.ano_lancamento = ?';
        params.push(ano);
    }
    
    if (diretor) {
        query += ' AND f.diretor LIKE ?';
        params.push(`%${diretor}%`);
    }
    
    query += ' GROUP BY f.id ORDER BY f.titulo';
    
    db.query(query, params, (err, results) => {
        if (err) {
            console.error('Erro ao buscar filmes:', err);
            return res.status(500).json({ error: 'Erro ao buscar filmes' });
        }
        
        res.json(results);
    });
});

// Rota para obter opções de filtro
app.get('/api/filtros', (req, res) => {
    const query = `
        SELECT 
            GROUP_CONCAT(DISTINCT genero ORDER BY genero) as generos,
            GROUP_CONCAT(DISTINCT ano_lancamento ORDER BY ano_lancamento DESC) as anos,
            GROUP_CONCAT(DISTINCT diretor ORDER BY diretor) as diretores
        FROM filmes
    `;
    
    db.query(query, (err, results) => {
        if (err) {
            console.error('Erro ao buscar filtros:', err);
            return res.status(500).json({ error: 'Erro ao buscar filtros' });
        }
        
        const filtros = results[0];
        res.json({
            generos: filtros.generos ? filtros.generos.split(',') : [],
            anos: filtros.anos ? filtros.anos.split(',').map(ano => parseInt(ano)) : [],
            diretores: filtros.diretores ? filtros.diretores.split(',') : []
        });
    });
});

// Rota para obter detalhes de um filme
app.get('/api/filmes/:id', (req, res) => {
    const filmeId = req.params.id;
    
    const query = `
        SELECT f.*, 
               GROUP_CONCAT(DISTINCT s.plataforma SEPARATOR ', ') as plataformas,
               GROUP_CONCAT(DISTINCT s.link SEPARATOR '|||') as links
        FROM filmes f
        LEFT JOIN streaming s ON f.id = s.filme_id AND s.disponivel = true
        WHERE f.id = ?
        GROUP BY f.id
    `;
    
    db.query(query, [filmeId], (err, results) => {
        if (err) {
            console.error('Erro ao buscar filme:', err);
            return res.status(500).json({ error: 'Erro ao buscar filme' });
        }
        
        if (results.length === 0) {
            return res.status(404).json({ error: 'Filme não encontrado' });
        }
        
        const filme = results[0];
        
        // Processar links de streaming
        if (filme.links) {
            const linksArray = filme.links.split('|||');
            const plataformasArray = filme.plataformas.split(', ');
            
            filme.streamingInfo = plataformasArray.map((plataforma, index) => ({
                plataforma,
                link: linksArray[index] || '#'
            }));
        } else {
            filme.streamingInfo = [];
        }
        
        res.json(filme);
    });
});

// Rota para adicionar um novo filme (admin)
app.post('/api/filmes', (req, res) => {
    const { titulo, ano_lancamento, diretor, genero, sinopse, duracao, classificacao, capa_url, valor_aluguel } = req.body;
    
    const query = `
        INSERT INTO filmes (titulo, ano_lancamento, diretor, genero, sinopse, duracao, classificacao, capa_url, valor_aluguel)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    db.query(query, [titulo, ano_lancamento, diretor, genero, sinopse, duracao, classificacao, capa_url, valor_aluguel], (err, results) => {
        if (err) {
            console.error('Erro ao adicionar filme:', err);
            return res.status(500).json({ error: 'Erro ao adicionar filme' });
        }
        
        res.status(201).json({ message: 'Filme adicionado com sucesso', id: results.insertId });
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Acesse: http://localhost:${PORT}`);
});