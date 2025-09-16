-- Criar banco de dados
CREATE DATABASE IF NOT EXISTS locadora_filmes;
USE locadora_filmes;

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de filmes
CREATE TABLE IF NOT EXISTS filmes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    ano_lancamento INT,
    diretor VARCHAR(100),
    genero VARCHAR(50),
    sinopse TEXT,
    duracao VARCHAR(20),
    classificacao VARCHAR(10),
    capa_url VARCHAR(500),
    valor_aluguel DECIMAL(10, 2),
    data_adicao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de plataformas de streaming
CREATE TABLE IF NOT EXISTS streaming (
    id INT AUTO_INCREMENT PRIMARY KEY,
    filme_id INT,
    plataforma VARCHAR(50),
    link VARCHAR(500),
    disponivel BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (filme_id) REFERENCES filmes(id) ON DELETE CASCADE
);

-- Inserir alguns filmes de exemplo
INSERT INTO filmes (titulo, ano_lancamento, diretor, genero, sinopse, duracao, classificacao, capa_url, valor_aluguel) VALUES
('O Poderoso Chefão', 1972, 'Francis Ford Coppola', 'Drama', 'A história da família Corleone, liderada por Vito Corleone.', '175 min', '18+', 'https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_FMjpg_UX1000_.jpg', 9.99),
('Matrix', 1999, 'Lana Wachowski, Lilly Wachowski', 'Ficção Científica', 'Um hacker descobre a verdade sobre sua realidade.', '136 min', '16+', 'https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_FMjpg_UX1000_.jpg', 7.99),
('Interestelar', 2014, 'Christopher Nolan', 'Ficção Científica', 'Uma equipe de exploradores viaja através de um buraco de minhoca no espaço.', '169 min', '12+', 'https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_FMjpg_UX1000_.jpg', 8.99),
('Pulp Fiction', 1994, 'Quentin Tarantino', 'Drama', 'Várias histórias se entrelaçam no submundo de Los Angeles.', '154 min', '18+', 'https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzJjNDymxYzYzYTk2XkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_FMjpg_UX1000_.jpg', 6.99),
('Clube da Luta', 1999, 'David Fincher', 'Drama', 'Um homem insatisfeito forma um clube de luta clandestino.', '139 min', '18+', 'https://m.media-amazon.com/images/M/MV5BMmEzNTkxYjQtZTc0MC00YTVjLTg5ZTEtZWMwOWVlYzY0NWIwXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_FMjpg_UX1000_.jpg', 7.49),
('O Senhor dos Anéis: A Sociedade do Anel', 2001, 'Peter Jackson', 'Fantasia', 'Um hobbit recebe a missão de destruir um anel poderoso.', '178 min', '12+', 'https://m.media-amazon.com/images/M/MV5BN2EyZjM3NzUtNWUzMi00MTgxLWI0NTctMzY4M2VlOTdjZWRiXkEyXkFqcGdeQXVyNDUzOTQ5MjY@._V1_FMjpg_UX1000_.jpg', 8.49);

-- Inserir plataformas de streaming para os filmes
INSERT INTO streaming (filme_id, plataforma, link, disponivel) VALUES
(1, 'Netflix', 'https://www.netflix.com/title/60011152', TRUE),
(1, 'Amazon Prime', 'https://www.primevideo.com/detail/0LPHL2Q6K6S4S2S4S4S4S4S4S4S', TRUE),
(2, 'HBO Max', 'https://www.hbomax.com/br/pt/feature/urn:hbo:feature:GXdbR4gNdwfPDwwEAAAAA', TRUE),
(3, 'Netflix', 'https://www.netflix.com/title/70305903', TRUE),
(4, 'Netflix', 'https://www.netflix.com/title/60013537', TRUE),
(5, 'Amazon Prime', 'https://www.primevideo.com/detail/0LPHL2Q6K6S4S2S4S4S4S4S4S4S', TRUE),
(6, 'HBO Max', 'https://www.hbomax.com/br/pt/feature/urn:hbo:feature:GXdbR4gNdwfPDwwEAAAAA', TRUE);

-- Criar um usuário admin padrão (senha: admin123)
INSERT INTO usuarios (nome, email, senha) VALUES 
('Administrador', 'admin@locadora.com', '$2b$10$Vw/6OfY3c7l5fJX5w5p5E.X5w5p5E.X5w5p5E.X5w5p5E.X5w5p5E');