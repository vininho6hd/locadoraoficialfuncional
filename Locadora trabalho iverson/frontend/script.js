// Elementos da DOM
const loginContainer = document.getElementById('login-container');
const registerContainer = document.getElementById('register-container');
const mainContainer = document.getElementById('main-container');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const showRegisterLink = document.getElementById('show-register');
const showLoginLink = document.getElementById('show-login');
const logoutBtn = document.getElementById('logout-btn');
const movieSearch = document.getElementById('movie-search');
const searchBtn = document.getElementById('search-btn');
const suggestionChips = document.querySelectorAll('.chip');
const movieList = document.getElementById('movie-list');
const movieDetails = document.getElementById('movie-details');
const noResults = document.getElementById('no-results');
const backToListBtn = document.getElementById('back-to-list');
const userNameSpan = document.getElementById('user-name');

// URL base da API
const API_BASE = 'http://localhost:3000/api';

// Event Listeners
document.addEventListener('DOMContentLoaded', initApp);
loginForm.addEventListener('submit', handleLogin);
registerForm.addEventListener('submit', handleRegister);
showRegisterLink.addEventListener('click', showRegister);
showLoginLink.addEventListener('click', showLogin);
logoutBtn.addEventListener('click', handleLogout);
searchBtn.addEventListener('click', searchMovie);
movieSearch.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchMovie();
});

suggestionChips.forEach(chip => {
    chip.addEventListener('click', () => {
        movieSearch.value = chip.getAttribute('data-movie');
        searchMovie();
    });
});

if (backToListBtn) {
    backToListBtn.addEventListener('click', () => {
        movieDetails.classList.add('hidden');
        movieList.classList.remove('hidden');
        noResults.classList.add('hidden');
    });
}

// Funções
function initApp() {
    // Verificar se o usuário está logado
    const loggedUser = localStorage.getItem('loggedUser');
    if (loggedUser) {
        showMainScreen(JSON.parse(loggedUser));
    } else {
        showLoginScreen();
    }
}

function showLoginScreen() {
    loginContainer.classList.add('active');
    registerContainer.classList.remove('active');
    mainContainer.classList.remove('active');
}

function showRegisterScreen() {
    loginContainer.classList.remove('active');
    registerContainer.classList.add('active');
    mainContainer.classList.remove('active');
}

function showMainScreen(user) {
    loginContainer.classList.remove('active');
    registerContainer.classList.remove('active');
    mainContainer.classList.add('active');
    userNameSpan.textContent = user.nome;
    
    // Carregar filmes ao entrar
    loadMovies();
}

function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, senha: password })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro na resposta do servidor');
        }
        return response.json();
    })
    .then(data => {
        if (data.error) {
            alert(data.error);
        } else {
            localStorage.setItem('loggedUser', JSON.stringify(data.user));
            showMainScreen(data.user);
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Erro ao fazer login. Verifique se o servidor está rodando.');
    });
}

function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('new-email').value;
    const password = document.getElementById('new-password').value;
    
    fetch(`${API_BASE}/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nome: name, email, senha: password })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro na resposta do servidor');
        }
        return response.json();
    })
    .then(data => {
        if (data.error) {
            alert(data.error);
        } else {
            alert(data.message);
            showLoginScreen();
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Erro ao registrar. Verifique se o servidor está rodando.');
    });
}

function showRegister(e) {
    e.preventDefault();
    showRegisterScreen();
}

function showLogin(e) {
    e.preventDefault();
    showLoginScreen();
}

function handleLogout() {
    localStorage.removeItem('loggedUser');
    showLoginScreen();
}

function loadMovies() {
    fetch(`${API_BASE}/filmes`)
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao carregar filmes');
        }
        return response.json();
    })
    .then(filmes => {
        displayMovies(filmes);
    })
    .catch(error => {
        console.error('Erro ao carregar filmes:', error);
        movieList.innerHTML = '<p>Erro ao carregar filmes. Verifique se o servidor está rodando.</p>';
    });
}

function searchMovie() {
    const searchTerm = movieSearch.value.trim();
    
    if (searchTerm === '') {
        loadMovies();
        return;
    }
    
    fetch(`${API_BASE}/filmes?search=${encodeURIComponent(searchTerm)}`)
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro na busca');
        }
        return response.json();
    })
    .then(filmes => {
        if (filmes.length > 0) {
            displayMovies(filmes);
        } else {
            movieList.innerHTML = '';
            movieList.classList.add('hidden');
            movieDetails.classList.add('hidden');
            noResults.classList.remove('hidden');
        }
    })
    .catch(error => {
        console.error('Erro ao buscar filmes:', error);
        movieList.innerHTML = '<p>Erro na busca. Verifique se o servidor está rodando.</p>';
    });
}

function displayMovies(filmes) {
    movieList.innerHTML = '';
    movieList.classList.remove('hidden');
    movieDetails.classList.add('hidden');
    noResults.classList.add('hidden');
    
    if (filmes.length === 0) {
        movieList.innerHTML = '<p>Nenhum filme encontrado.</p>';
        return;
    }
    
    filmes.forEach(filme => {
        const movieCard = document.createElement('div');
        movieCard.className = 'movie-card';
        movieCard.innerHTML = `
            <img src="${filme.capa_url}" alt="${filme.titulo}" onerror="this.src='https://via.placeholder.com/200x300/cccccc/666666?text=Imagem+Não+Disponível'">
            <div class="movie-card-content">
                <h3>${filme.titulo}</h3>
                <p>${filme.ano_lancamento} • ${filme.genero}</p>
                <p>Disponível em: ${filme.plataformas || 'Nenhuma plataforma'}</p>
            </div>
        `;
        
        movieCard.addEventListener('click', () => {
            showMovieDetails(filme.id);
        });
        
        movieList.appendChild(movieCard);
    });
}

function showMovieDetails(filmeId) {
    fetch(`${API_BASE}/filmes/${filmeId}`)
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao carregar detalhes');
        }
        return response.json();
    })
    .then(filme => {
        displayMovieDetails(filme);
    })
    .catch(error => {
        console.error('Erro ao carregar detalhes do filme:', error);
        alert('Erro ao carregar detalhes do filme.');
    });
}

function displayMovieDetails(filme) {
    document.getElementById('movie-title').textContent = filme.titulo;
    document.getElementById('movie-year').textContent = `Ano: ${filme.ano_lancamento}`;
    document.getElementById('movie-duration').textContent = `Duração: ${filme.duracao} min`;
    document.getElementById('movie-rating').textContent = `Classificação: ${filme.classificacao}`;
    document.getElementById('movie-director').textContent = `Diretor: ${filme.diretor}`;
    document.getElementById('movie-genre').textContent = `Gênero: ${filme.genero}`;
    document.getElementById('movie-synopsis').textContent = filme.sinopse;
    document.getElementById('movie-poster').src = filme.capa_url;
    document.getElementById('movie-poster').alt = `Poster de ${filme.titulo}`;
    document.getElementById('movie-poster').onerror = "this.src='https://via.placeholder.com/300x450/cccccc/666666?text=Imagem+Não+Disponível'";
    document.getElementById('movie-price').textContent = `R$ ${filme.valor_aluguel}`;
    
    // Exibir plataformas de streaming
    const streamingPlatforms = document.getElementById('streaming-platforms');
    streamingPlatforms.innerHTML = '';
    
    if (filme.streamingInfo && filme.streamingInfo.length > 0) {
        filme.streamingInfo.forEach(platform => {
            const platformEl = document.createElement('div');
            platformEl.className = `platform ${platform.link && platform.link !== '#' ? 'available' : ''}`;
            
            if (platform.link && platform.link !== '#') {
                platformEl.innerHTML = `<a href="${platform.link}" target="_blank">${platform.plataforma}</a>`;
            } else {
                platformEl.textContent = `${platform.plataforma} (Indisponível)`;
            }
            
            streamingPlatforms.appendChild(platformEl);
        });
    } else {
        streamingPlatforms.innerHTML = '<p>Nenhuma plataforma de streaming disponível para este filme.</p>';
    }
    
    movieList.classList.add('hidden');
    movieDetails.classList.remove('hidden');
}