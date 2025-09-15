CREATE DATABASE locadora_filmes;
USE locadora_filmes;

-- Tabela de usuários
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de filmes
CREATE TABLE filmes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    ano_lancamento INT,
    diretor VARCHAR(100),
    genero VARCHAR(50),
    sinopse TEXT,
    duracao INT,
    classificacao VARCHAR(10),
    capa_url VARCHAR(500),
    valor_aluguel DECIMAL(5,2) DEFAULT 9.99
);

-- Tabela de streaming
CREATE TABLE streaming (
    id INT AUTO_INCREMENT PRIMARY KEY,
    filme_id INT,
    plataforma VARCHAR(50) NOT NULL,
    disponivel BOOLEAN DEFAULT TRUE,
    link VARCHAR(500),
    FOREIGN KEY (filme_id) REFERENCES filmes(id) ON DELETE CASCADE
);

-- Inserir alguns usuários de exemplo
INSERT INTO usuarios (nome, email, senha) VALUES 
('João Silva', 'joao@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
('Maria Santos', 'maria@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');

-- Inserir filmes de exemplo
INSERT INTO filmes (titulo, ano_lancamento, diretor, genero, sinopse, duracao, classificacao, capa_url) VALUES 
('O Poderoso Chefão', 1972, 'Francis Ford Coppola', 'Drama', 'A saga da família Corleone, liderada por Don Vito Corleone.', 175, '18+', 'https://br.web.img3.acsta.net/c_310_420/medias/nmedia/18/90/93/20/20120876.jpg'),
('Matrix', 1999, 'Lana e Lilly Wachowski', 'Ficção Científica', 'Um hacker descobre a verdade sobre sua realidade.', 136, '14+', 'https://br.web.img2.acsta.net/c_310_420/medias/nmedia/18/91/08/82/20123856.jpg'),
('Interestelar', 2014, 'Christopher Nolan', 'Ficção Científica', 'Exploradores espaciais em busca de um novo lar para a humanidade.', 169, '10+', 'https://br.web.img2.acsta.net/c_310_420/pictures/14/10/31/20/39/476171.jpg'),
('Pulp Fiction', 1994, 'Quentin Tarantino', 'Drama/Crime', 'Várias histórias de criminosos de Los Angeles se entrelaçam.', 154, '18+', 'https://br.web.img2.acsta.net/c_310_420/medias/nmedia/18/90/95/20/20120827.jpg'),
('O Senhor dos Anéis: A Sociedade do Anel', 2001, 'Peter Jackson', 'Fantasia/Aventura', 'Um hobbit tem a missão de destruir um anel poderoso.', 178, '12+', 'https://br.web.img2.acsta.net/c_310_420/medias/nmedia/18/92/91/47/20224867.jpg'),
('Clube da Luta', 1999, 'David Fincher', 'Drama', 'Um homem insatisfeito forma um clube de luta subterrâneo.', 139, '18+', 'https://br.web.img2.acsta.net/c_310_420/medias/nmedia/18/90/95/32/20120866.jpg'),
('Forrest Gump', 1994, 'Robert Zemeckis', 'Drama/Romance', 'A vida de um homem com QI baixo que testemunha eventos históricos.', 142, '12+', 'https://br.web.img2.acsta.net/c_310_420/medias/nmedia/18/87/84/28/19962110.jpg'),
('Os Infiltrados', 2006, 'Martin Scorsese', 'Drama/Policial', 'Um policial se infiltra na máfia, enquanto um gângster infiltra a polícia.', 151, '16+', 'https://br.web.img3.acsta.net/c_310_420/medias/nmedia/18/91/67/77/20157514.jpg'),
('Gladiador', 2000, 'Ridley Scott', 'Ação/Drama', 'Um general romano é traído e busca vingança como gladiador.', 155, '16+', 'https://br.web.img2.acsta.net/c_310_420/medias/nmedia/18/89/80/68/20061127.jpg'),
('A Origem', 2010, 'Christopher Nolan', 'Ficção Científica/Ação', 'Um ladrão invade os sonhos de suas vítimas para roubar segredos.', 148, '12+', 'https://br.web.img2.acsta.net/c_310_420/medias/nmedia/18/87/93/13/20028771.jpg');

-- Inserir informações de streaming
INSERT INTO streaming (filme_id, plataforma, disponivel, link) VALUES 
(1, 'Netflix', TRUE, 'https://www.netflix.com/title/60011152'),
(1, 'Amazon Prime Video', TRUE, 'https://www.primevideo.com/detail/0L3VZQ5JZ5JZ5JZ5JZ5JZ5JZ5J'),
(2, 'HBO Max', TRUE, 'https://www.hbomax.com/br/pt/feature/urn:hbo:feature:GXdbR4gLrlEvJwwEAAAAD'),
(2, 'Netflix', FALSE, NULL),
(3, 'Netflix', TRUE, 'https://www.netflix.com/title/70305903'),
(3, 'Disney+', FALSE, NULL),
(4, 'Netflix', TRUE, 'https://www.netflix.com/title/60011152'),
(4, 'Amazon Prime Video', TRUE, 'https://www.primevideo.com/detail/0L3VZQ5JZ5JZ5JZ5JZ5JZ5JZ5J'),
(5, 'HBO Max', TRUE, 'https://www.hbomax.com/br/pt/feature/urn:hbo:feature:GXdbR4gLrlEvJwwEAAAAD'),
(5, 'Netflix', FALSE, NULL),
(6, 'Netflix', TRUE, 'https://www.netflix.com/title/70305903'),
(6, 'Disney+', FALSE, NULL),
(7, 'Netflix', TRUE, 'https://www.netflix.com/title/60011152'),
(7, 'Amazon Prime Video', TRUE, 'https://www.primevideo.com/detail/0L3VZQ5JZ5JZ5JZ5JZ5JZ5JZ5J'),
(8, 'HBO Max', TRUE, 'https://www.hbomax.com/br/pt/feature/urn:hbo:feature:GXdbR4gLrlEvJwwEAAAAD'),
(8, 'Netflix', FALSE, NULL),
(9, 'Netflix', TRUE, 'https://www.netflix.com/title/70305903'),
(9, 'Disney+', FALSE, NULL),
(10, 'Netflix', TRUE, 'https://www.netflix.com/title/60011152'),
(10, 'Amazon Prime Video', TRUE, 'https://www.primevideo.com/detail/0L3VZQ5JZ5JZ5JZ5JZ5JZ5JZ5J');