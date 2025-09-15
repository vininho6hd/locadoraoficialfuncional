// Elementos da DOM
const addMovieForm = document.getElementById('add-movie-form');
const adminMessage = document.getElementById('admin-message');

// URL base da API
const API_BASE = 'http://localhost:3000/api';

// Event Listeners
document.addEventListener('DOMContentLoaded', initAdmin);
addMovieForm.addEventListener('submit', handleAddMovie);

// Funções
function initAdmin() {
    // Verificar se há uma mensagem na URL (para feedback após adicionar filme)
    const urlParams = new URLSearchParams(window.location.search);
    const message = urlParams.get('message');
    
    if (message) {
        showMessage(message, 'success');
        // Limpar a URL
        window.history.replaceState({}, document.title, window.location.pathname);
    }
}

function handleAddMovie(e) {
    e.preventDefault();
    
    const titulo = document.getElementById('titulo').value;
    const ano_lancamento = document.getElementById('ano_lancamento').value;
    const diretor = document.getElementById('diretor').value;
    const genero = document.getElementById('genero').value;
    const sinopse = document.getElementById('sinopse').value;
    const duracao = document.getElementById('duracao').value;
    const classificacao = document.getElementById('classificacao').value;
    const capa_url = document.getElementById('capa_url').value;
    const valor_aluguel = document.getElementById('valor_aluguel').value;
    
    // Validação básica
    if (!titulo || !ano_lancamento || !diretor || !genero || !sinopse || !duracao || !classificacao || !capa_url || !valor_aluguel) {
        showMessage('Por favor, preencha todos os campos.', 'error');
        return;
    }
    
    const filmeData = {
        titulo,
        ano_lancamento: parseInt(ano_lancamento),
        diretor,
        genero,
        sinopse,
        duracao: parseInt(duracao),
        classificacao,
        capa_url,
        valor_aluguel: parseFloat(valor_aluguel)
    };
    
    fetch(`${API_BASE}/filmes`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(filmeData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro na resposta do servidor');
        }
        return response.json();
    })
    .then(data => {
        if (data.error) {
            showMessage(data.error, 'error');
        } else {
            showMessage(data.message, 'success');
            addMovieForm.reset();
            
            // Redirecionar para a página principal com mensagem de sucesso
            setTimeout(() => {
                window.location.href = 'index.html?message=Filme adicionado com sucesso!';
            }, 2000);
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        showMessage('Erro ao adicionar filme. Verifique se o servidor está rodando.', 'error');
    });
}

function showMessage(text, type) {
    adminMessage.textContent = text;
    adminMessage.className = `message ${type}`;
    adminMessage.style.display = 'block';
    
    // Esconder a mensagem após 5 segundos
    setTimeout(() => {
        adminMessage.style.display = 'none';
    }, 5000);
}