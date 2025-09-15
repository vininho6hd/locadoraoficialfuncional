// Elementos da DOM
const loginContainer = document.getElementById('login-container');
const registerContainer = document.getElementById('register-container');
const mainContainer = document.getElementById('main-container');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const showRegisterLink = document.getElementById('show-register');
const showLoginLink = document.getElementById('show-login');
const showGuestLink = document.getElementById('show-guest');
const showGuestFromRegisterLink = document.getElementById('show-guest-from-register');
const logoutBtn = document.getElementById('logout-btn');
const movieSearch = document.getElementById('movie-search');
const searchBtn = document.getElementById('search-btn');
const filterToggle = document.getElementById('filter-toggle');
const filterPanel = document.getElementById('filter-panel');
const genreFilter = document.getElementById('genre-filter');
const yearFilter = document.getElementById('year-filter');
const directorFilter = document.getElementById('director-filter');
const applyFiltersBtn = document.getElementById('apply-filters');
const clearFiltersBtn = document.getElementById('clear-filters');
const suggestionChips = document.querySelectorAll('.chip');
const movieList = document.getElementById('movie-list');
const movieDetails = document.getElementById('movie-details');
const noResults = document.getElementById('no-results');
const backToListBtn = document.getElementById('back-to-list');
const userNameSpan = document.getElementById('user-name');
const resultsCount = document.getElementById('results-count');
const gridViewBtn = document.getElementById('grid-view');
const listViewBtn = document.getElementById('list-view');

// URL base da API
const API_BASE = 'http://localhost:3000/api';

// Variáveis globais
let currentView = 'grid';
let currentFilters = {
    search: '',
    genero: '',
    ano: '',
    diretor: ''
};

// Event Listeners
document.addEventListener('DOMContentLoaded', initApp);
loginForm.addEventListener('submit', handleLogin);
registerForm.addEventListener('submit', handleRegister);
showRegisterLink.addEventListener('click', showRegister);
showLoginLink.addEventListener('click', showLogin);
showGuestLink.addEventListener('click', handleGuestAccess);
showGuestFromRegisterLink.addEventListener('click', handleGuestAccess);
logoutBtn.addEventListener('click', handleLogout);
searchBtn.addEventListener('click', searchMovie);
filterToggle.addEventListener('click', toggleFilters);
applyFiltersBtn.addEventListener('click', applyFilters);
clearFiltersBtn.addEventListener('click', clearFilters);
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

gridViewBtn.addEventListener('click', () => switchView('grid'));
listViewBtn.addEventListener('click', () => switchView('list'));

// Funções
function initApp() {
    // Verificar se o usuário está logado
    const loggedUser = localStorage.getItem('loggedUser');
    if (loggedUser) {
        showMainScreen(JSON.parse(loggedUser));
        loadFilters();
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
            loadFilters();
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
            showLogin();
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Erro ao registrar. Verifique se o servidor está rodando.');
    });
}

function handleGuestAccess(e) {
    e.preventDefault();
    
    fetch(`${API_BASE}/guest`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro na resposta do servidor');
        }
        return response.json();
    })
    .then(data => {
        localStorage.setItem('loggedUser', JSON.stringify(data.user));
        showMainScreen(data.user);
        loadFilters();
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Erro ao acessar como convidado. Verifique se o servidor está rodando.');
    });
}

function handleLogout() {
    localStorage.removeItem('loggedUser');
    showLoginScreen();
}

function loadFilters() {
    fetch(`${API_BASE}/filtros`)
    .then(response => response.json())
    .then(data => {
        // Preencher filtro de gêneros
        genreFilter.innerHTML = '<option value="">Todos os gêneros</option>';
        data.generos.forEach(genero => {
            const option = document.createElement('option');
            option.value = genero;
            option.textContent = genero;
            genreFilter.appendChild(option);
        });
        
        // Preencher filtro de anos
        yearFilter.innerHTML = '<option value="">Todos os anos</option>';
        data.anos.forEach(ano => {
            const option = document.createElement('option');
            option.value = ano;
            option.textContent = ano;
            yearFilter.appendChild(option);
        });
        
        // Preencher filtro de diretores
        directorFilter.innerHTML = '<option value="">Todos os diretores</option>';
        data.diretores.forEach(diretor => {
            const option = document.createElement('option');
            option.value = diretor;
            option.textContent = diretor;
            directorFilter.appendChild(option);
        });
    })
    .catch(error => {
        console.error('Erro ao carregar filtros:', error);
    });
}

function searchMovie() {
    currentFilters.search = movieSearch.value;
    loadMovies();
}

function toggleFilters() {
    filterPanel.classList.toggle('hidden');
}

function applyFilters() {
    currentFilters.genero = genreFilter.value;
    currentFilters.ano = yearFilter.value;
    currentFilters.diretor = directorFilter.value;
    loadMovies();
}

function clearFilters() {
    genreFilter.value = '';
    yearFilter.value = '';
    directorFilter.value = '';
    movieSearch.value = '';
    currentFilters = {
        search: '',
        genero: '',
        ano: '',
        diretor: ''
    };
    loadMovies();
}

function loadMovies() {
    const queryParams = new URLSearchParams(currentFilters).toString();
    
    fetch(`${API_BASE}/filmes?${queryParams}`)
    .then(response => response.json())
    .then(data => {
        displayMovies(data);
    })
    .catch(error => {
        console.error('Erro ao carregar filmes:', error);
        movieList.innerHTML = '<p>Erro ao carregar filmes. Verifique se o servidor está rodando.</p>';
    });
}

function displayMovies(movies) {
    if (movies.length === 0) {
        movieList.classList.add('hidden');
        movieDetails.classList.add('hidden');
        noResults.classList.remove('hidden');
        resultsCount.textContent = '0 filmes encontrados';
        return;
    }
    
    noResults.classList.add('hidden');
    movieList.classList.remove('hidden');
    movieDetails.classList.add('hidden');
    
    resultsCount.textContent = `${movies.length} ${movies.length === 1 ? 'filme encontrado' : 'filmes encontrados'}`;
    
    movieList.innerHTML = '';
    movieList.className = currentView === 'grid' ? 'movie-grid' : 'movie-list-view';
    
    movies.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.className = 'movie-card';
        movieCard.innerHTML = `
            <img src="${movie.capa_url || 'https://via.placeholder.com/300x450?text=Sem+Imagem'}" alt="${movie.titulo}">
            <div class="movie-card-content">
                <h3>${movie.titulo}</h3>
                <p>${movie.diretor}</p>
                <div class="movie-meta">
                    <span>${movie.ano_lancamento}</span>
                    <span>${movie.duracao}</span>
                </div>
                <p class="price">R$ ${movie.valor_aluguel}</p>
            </div>
        `;
        
        movieCard.addEventListener('click', () => showMovieDetails(movie.id));
        movieList.appendChild(movieCard);
    });
}

function showMovieDetails(movieId) {
    fetch(`${API_BASE}/filmes/${movieId}`)
    .then(response => response.json())
    .then(movie => {
        movieList.classList.add('hidden');
        movieDetails.classList.remove('hidden');
        
        document.getElementById('movie-title').textContent = movie.titulo;
        document.getElementById('movie-year').textContent = movie.ano_lancamento;
        document.getElementById('movie-duration').textContent = movie.duracao;
        document.getElementById('movie-rating').textContent = movie.classificacao;
        document.getElementById('movie-director').textContent = `Diretor: ${movie.diretor}`;
        document.getElementById('movie-genre').textContent = `Gênero: ${movie.genero}`;
        document.getElementById('movie-price').textContent = `R$ ${movie.valor_aluguel}`;
        document.getElementById('movie-synopsis').textContent = movie.sinopse;
        
        const posterImg = document.getElementById('movie-poster');
        posterImg.src = movie.capa_url || 'https://via.placeholder.com/300x450?text=Sem+Imagem';
        posterImg.alt = movie.titulo;
        
        const streamingPlatforms = document.getElementById('streaming-platforms');
        streamingPlatforms.innerHTML = '';
        
        if (movie.streamingInfo && movie.streamingInfo.length > 0) {
            movie.streamingInfo.forEach(platform => {
                const platformEl = document.createElement('div');
                platformEl.className = 'platform available';
                platformEl.innerHTML = `<a href="${platform.link}" target="_blank">${platform.plataforma}</a>`;
                streamingPlatforms.appendChild(platformEl);
            });
        } else {
            streamingPlatforms.innerHTML = '<p>Nenhuma plataforma de streaming disponível no momento.</p>';
        }
    })
    .catch(error => {
        console.error('Erro ao carregar detalhes do filme:', error);
        alert('Erro ao carregar detalhes do filme.');
    });
}

function switchView(viewType) {
    currentView = viewType;
    
    if (viewType === 'grid') {
        gridViewBtn.classList.add('active');
        listViewBtn.classList.remove('active');
        movieList.className = 'movie-grid';
    } else {
        gridViewBtn.classList.remove('active');
        listViewBtn.classList.add('active');
        movieList.className = 'movie-list-view';
    }
}

function showRegister() {
    loginContainer.classList.remove('active');
    registerContainer.classList.add('active');
    mainContainer.classList.remove('active');
}

function showLogin() {
    loginContainer.classList.add('active');
    registerContainer.classList.remove('active');
    mainContainer.classList.remove('active');
}