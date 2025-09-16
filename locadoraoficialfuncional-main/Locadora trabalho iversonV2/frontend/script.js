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
const showAdminLoginLink = document.getElementById('show-admin-login');
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
const userTypeSpan = document.getElementById('user-type');
const resultsCount = document.getElementById('results-count');
const gridViewBtn = document.getElementById('grid-view');
const listViewBtn = document.getElementById('list-view');
const adminPanel = document.getElementById('admin-panel');
const addMovieForm = document.getElementById('add-movie-form');
const adminMessage = document.getElementById('admin-message');
const closeAdminBtn = document.getElementById('close-admin');
const adminMoviesList = document.getElementById('admin-movies-list');
const editMovieModal = document.getElementById('edit-movie-modal');
const editMovieForm = document.getElementById('edit-movie-form');
const closeModalBtn = document.querySelector('.close');

// URL base da API
const API_BASE = 'http://localhost:3000/api';

// Dados iniciais dos filmes (para modo offline)
const initialMovies = [
    {
        id: 1,
        titulo: "O Poderoso Chefão",
        ano_lancamento: 1972,
        diretor: "Francis Ford Coppola",
        genero: "Drama",
        sinopse: "A saga da família Corleone, liderada por Don Vito Corleone.",
        duracao: 175,
        classificacao: "18+",
        capa_url: "https://br.web.img3.acsta.net/c_310_420/medias/nmedia/18/90/93/20/20120876.jpg",
        valor_aluguel: 9.99,
        streamingInfo: [
            { plataforma: "Netflix", link: "https://www.netflix.com/title/60011152", classe: "netflix" },
            { plataforma: "Amazon Prime Video", link: "https://www.primevideo.com/detail/0L3VZQ5JZ5JZ5JZ5JZ5JZ5JZ5J", classe: "prime" }
        ]
    },
    {
        id: 2,
        titulo: "Matrix",
        ano_lancamento: 1999,
        diretor: "Lana e Lilly Wachowski",
        genero: "Ficção Científica",
        sinopse: "Um hacker descobre a verdade sobre sua realidade.",
        duracao: 136,
        classificacao: "14+",
        capa_url: "https://br.web.img2.acsta.net/c_310_420/medias/nmedia/18/91/08/82/20123856.jpg",
        valor_aluguel: 7.99,
        streamingInfo: [
            { plataforma: "HBO Max", link: "https://www.hbomax.com/br/pt/feature/urn:hbo:feature:GXdbR4gLrlEvJwwEAAAAD", classe: "hbo" }
        ]
    },
    {
        id: 3,
        titulo: "Interestelar",
        ano_lancamento: 2014,
        diretor: "Christopher Nolan",
        genero: "Ficção Científica",
        sinopse: "Exploradores espaciais em busca de um novo lar para a humanidade.",
        duracao: 169,
        classificacao: "10+",
        capa_url: "https://br.web.img2.acsta.net/c_310_420/pictures/14/10/31/20/39/476171.jpg",
        valor_aluguel: 8.99,
        streamingInfo: [
            { plataforma: "Netflix", link: "https://www.netflix.com/title/70305903", classe: "netflix" }
        ]
    },
    {
        id: 4,
        titulo: "Pulp Fiction",
        ano_lancamento: 1994,
        diretor: "Quentin Tarantino",
        genero: "Drama/Crime",
        sinopse: "Várias histórias de criminosos de Los Angeles se entrelaçam.",
        duracao: 154,
        classificacao: "18+",
        capa_url: "https://br.web.img2.acsta.net/c_310_420/medias/nmedia/18/90/95/20/20120827.jpg",
        valor_aluguel: 6.99,
        streamingInfo: [
            { plataforma: "Netflix", link: "https://www.netflix.com/title/60011152", classe: "netflix" },
            { plataforma: "Amazon Prime Video", link: "https://www.primevideo.com/detail/0L3VZQ5JZ5JZ5JZ5JZ5JZ5JZ5J", classe: "prime" },
            { plataforma: "Disney+", link: "https://www.disneyplus.com", classe: "disney" }
        ]
    }
];

// Variáveis globais
let currentView = 'grid';
let currentFilters = {
    search: '',
    genero: '',
    ano: '',
    diretor: ''
};
let isOnlineMode = false;
let currentUser = null;

// Event Listeners
document.addEventListener('DOMContentLoaded', initApp);
loginForm.addEventListener('submit', handleLogin);
registerForm.addEventListener('submit', handleRegister);
showRegisterLink.addEventListener('click', showRegister);
showLoginLink.addEventListener('click', showLogin);
showGuestLink.addEventListener('click', handleGuestAccess);
showGuestFromRegisterLink.addEventListener('click', handleGuestAccess);
showAdminLoginLink.addEventListener('click', showAdminLogin);
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

// Funções administrativas
if (addMovieForm) {
    addMovieForm.addEventListener('submit', handleAddMovie);
}

if (closeAdminBtn) {
    closeAdminBtn.addEventListener('click', () => {
        adminPanel.classList.add('hidden');
    });
}

if (editMovieForm) {
    editMovieForm.addEventListener('submit', handleEditMovie);
}

if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
        editMovieModal.classList.add('hidden');
    });
}

// Fechar modal clicando fora dele
window.addEventListener('click', (e) => {
    if (e.target === editMovieModal) {
        editMovieModal.classList.add('hidden');
    }
});

// Funções
function initApp() {
    // Verificar modo de operação (online/offline)
    checkServerStatus();
    
    // Verificar se o usuário está logado
    const loggedUser = localStorage.getItem('loggedUser');
    if (loggedUser) {
        currentUser = JSON.parse(loggedUser);
        showMainScreen(currentUser);
        loadFilters();
    } else {
        showLoginScreen();
    }
}

function checkServerStatus() {
    fetch(`${API_BASE}/filmes`, { 
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            isOnlineMode = true;
            console.log("Modo online: Conectado ao servidor");
        } else {
            throw new Error("Servidor não disponível");
        }
    })
    .catch(error => {
        isOnlineMode = false;
        console.log("Modo offline: Usando dados locais");
        // Carregar filmes do localStorage ou usar os iniciais
        let movies = JSON.parse(localStorage.getItem('movies')) || initialMovies;
        localStorage.setItem('movies', JSON.stringify(movies));
    });
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
    userTypeSpan.textContent = user.email === 'guest@example.com' ? 'Convidado' : 'Usuário';
    
    if (user.email === 'admin@locadora.com') {
        userTypeSpan.textContent = 'Administrador';
        userTypeSpan.style.background = '#1a2a6c';
    }
    
    // Carregar filmes ao entrar
    loadMovies();
    loadFilters();
}

function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    if (isOnlineMode) {
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
                currentUser = data.user;
                showMainScreen(data.user);
                loadFilters();
            }
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Erro ao fazer login. Verifique se o servidor está rodando.');
        });
    } else {
        // Modo offline - verificação simulada
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.email === email && u.senha === password);
        
        if (user) {
            localStorage.setItem('loggedUser', JSON.stringify(user));
            currentUser = user;
            showMainScreen(user);
            loadFilters();
        } else {
            alert('Credenciais inválidas. No modo offline, use: admin@locadora.com / admin123');
        }
    }
}

function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('new-email').value;
    const password = document.getElementById('new-password').value;
    
    if (isOnlineMode) {
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
    } else {
        // Modo offline - registro local
        const users = JSON.parse(localStorage.getItem('users')) || [];
        
        // Verificar se usuário já existe
        if (users.some(u => u.email === email)) {
            alert('Usuário já existe');
            return;
        }
        
        // Adicionar novo usuário
        const newUser = {
            id: Date.now(),
            nome: name,
            email: email,
            senha: password // Em produção, isso deve ser criptografado
        };
        
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        
        alert('Usuário criado com sucesso!');
        showLogin();
    }
}

function handleGuestAccess(e) {
    e.preventDefault();
    
    if (isOnlineMode) {
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
            currentUser = data.user;
            showMainScreen(data.user);
            loadFilters();
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Erro ao acessar como convidado. Verifique se o servidor está rodando.');
        });
    } else {
        // Modo offline - usuário convidado
        const guestUser = {
            id: 0,
            nome: 'Convidado',
            email: 'guest@example.com'
        };
        
        localStorage.setItem('loggedUser', JSON.stringify(guestUser));
        currentUser = guestUser;
        showMainScreen(guestUser);
        loadFilters();
    }
}

function showAdminLogin() {
    document.getElementById('email').value = 'admin@locadora.com';
    document.getElementById('password').value = 'admin123';
    alert('Credenciais de administrador preenchidas. Clique em Entrar para acessar.');
}

function handleLogout() {
    localStorage.removeItem('loggedUser');
    currentUser = null;
    showLoginScreen();
}

function searchMovie() {
    const searchTerm = movieSearch.value.trim();
    currentFilters.search = searchTerm;
    loadMovies();
}

function toggleFilters() {
    filterPanel.classList.toggle('hidden');
}

function loadFilters() {
    if (isOnlineMode) {
        fetch(`${API_BASE}/filtros`)
        .then(response => response.json())
        .then(data => {
            populateFilterOptions(data);
        })
        .catch(error => {
            console.error('Erro ao carregar filtros:', error);
        });
    } else {
        // Modo offline - carregar filtros dos filmes locais
        const movies = JSON.parse(localStorage.getItem('movies')) || initialMovies;
        
        const generos = [...new Set(movies.map(movie => movie.genero))];
        const anos = [...new Set(movies.map(movie => movie.ano_lancamento))].sort((a, b) => b - a);
        const diretores = [...new Set(movies.map(movie => movie.diretor))];
        
        populateFilterOptions({ generos, anos, diretores });
    }
}

function populateFilterOptions(filters) {
    // Limpar opções existentes
    genreFilter.innerHTML = '<option value="">Todos os gêneros</option>';
    yearFilter.innerHTML = '<option value="">Todos os anos</option>';
    directorFilter.innerHTML = '<option value="">Todos os diretores</option>';
    
    // Popular gêneros
    filters.generos.forEach(genero => {
        const option = document.createElement('option');
        option.value = genero;
        option.textContent = genero;
        genreFilter.appendChild(option);
    });
    
    // Popular anos
    filters.anos.forEach(ano => {
        const option = document.createElement('option');
        option.value = ano;
        option.textContent = ano;
        yearFilter.appendChild(option);
    });
    
    // Popular diretores
    filters.diretores.forEach(diretor => {
        const option = document.createElement('option');
        option.value = diretor;
        option.textContent = diretor;
        directorFilter.appendChild(option);
    });
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
    currentFilters.genero = '';
    currentFilters.ano = '';
    currentFilters.diretor = '';
    loadMovies();
}

function loadMovies() {
    if (isOnlineMode) {
        fetch(`${API_BASE}/filmes`)
        .then(response => response.json())
        .then(data => {
            displayMovies(data);
        })
        .catch(error => {
            console.error('Erro ao carregar filmes:', error);
            // Fallback para modo offline
            const movies = JSON.parse(localStorage.getItem('movies')) || initialMovies;
            displayMovies(movies);
        });
    } else {
        // Modo offline
        const movies = JSON.parse(localStorage.getItem('movies')) || initialMovies;
        displayMovies(movies);
    }
}

function displayMovies(movies) {
    // Aplicar filtros
    let filteredMovies = movies.filter(movie => {
        // Filtro de busca
        if (currentFilters.search && 
            !movie.titulo.toLowerCase().includes(currentFilters.search.toLowerCase()) &&
            !movie.diretor.toLowerCase().includes(currentFilters.search.toLowerCase()) &&
            !movie.genero.toLowerCase().includes(currentFilters.search.toLowerCase())) {
            return false;
        }
        
        // Filtro de gênero
        if (currentFilters.genero && movie.genero !== currentFilters.genero) {
            return false;
        }
        
        // Filtro de ano
        if (currentFilters.ano && movie.ano_lancamento != currentFilters.ano) {
            return false;
        }
        
        // Filtro de diretor
        if (currentFilters.diretor && movie.diretor !== currentFilters.diretor) {
            return false;
        }
        
        return true;
    });
    
    // Atualizar contador
    resultsCount.textContent = `${filteredMovies.length} filme${filteredMovies.length !== 1 ? 's' : ''} encontrado${filteredMovies.length !== 1 ? 's' : ''}`;
    
    // Limpar lista
    movieList.innerHTML = '';
    
    // Exibir mensagem se não houver resultados
    if (filteredMovies.length === 0) {
        movieList.classList.add('hidden');
        noResults.classList.remove('hidden');
        return;
    }
    
    // Exibir filmes
    movieList.classList.remove('hidden');
    noResults.classList.add('hidden');
    
    filteredMovies.forEach(movie => {
        const movieCard = createMovieCard(movie);
        movieList.appendChild(movieCard);
    });
    
    // Se o usuário for admin, carregar também a lista administrativa
    if (currentUser && currentUser.email === 'admin@locadora.com') {
        loadAdminMoviesList(filteredMovies);
    }
}

function createMovieCard(movie) {
    const card = document.createElement('div');
    card.className = 'movie-card';
    card.dataset.id = movie.id;
    
    card.innerHTML = `
        <img src="${movie.capa_url}" alt="${movie.titulo}">
        <div class="movie-card-content">
            <h3>${movie.titulo}</h3>
            <p>${movie.diretor} (${movie.ano_lancamento})</p>
            <div class="movie-meta">
                <span>${movie.genero}</span>
                <span>${movie.duracao} min</span>
            </div>
            <p class="price">R$ ${movie.valor_aluguel.toFixed(2)}</p>
        </div>
    `;
    
    card.addEventListener('click', () => showMovieDetails(movie));
    
    return card;
}

function showMovieDetails(movie) {
    movieList.classList.add('hidden');
    movieDetails.classList.remove('hidden');
    
    document.getElementById('movie-poster').src = movie.capa_url;
    document.getElementById('movie-title').textContent = movie.titulo;
    document.getElementById('movie-year').textContent = movie.ano_lancamento;
    document.getElementById('movie-duration').textContent = `${movie.duracao} min`;
    document.getElementById('movie-rating').textContent = movie.classificacao;
    document.getElementById('movie-director').textContent = `Diretor: ${movie.diretor}`;
    document.getElementById('movie-genre').textContent = `Gênero: ${movie.genero}`;
    document.getElementById('movie-price').textContent = `R$ ${movie.valor_aluguel.toFixed(2)}`;
    document.getElementById('movie-synopsis').textContent = movie.sinopse;
    
    // Exibir plataformas de streaming
    const streamingPlatforms = document.getElementById('streaming-platforms');
    streamingPlatforms.innerHTML = '';
    
    if (movie.streamingInfo && movie.streamingInfo.length > 0) {
        movie.streamingInfo.forEach(platform => {
            const platformEl = document.createElement('div');
            platformEl.className = `platform ${platform.classe || ''}`;
            platformEl.innerHTML = `<a href="${platform.link}" target="_blank">${platform.plataforma}</a>`;
            streamingPlatforms.appendChild(platformEl);
        });
    } else {
        streamingPlatforms.innerHTML = '<p>Nenhuma plataforma de streaming disponível para este filme.</p>';
    }
}

function switchView(viewType) {
    currentView = viewType;
    
    if (viewType === 'grid') {
        movieList.className = 'movie-grid';
        gridViewBtn.classList.add('active');
        listViewBtn.classList.remove('active');
    } else {
        movieList.className = 'movie-list-view';
        gridViewBtn.classList.remove('active');
        listViewBtn.classList.add('active');
    }
    
    // Recarregar filmes para aplicar a nova visualização
    loadMovies();
}

// Funções administrativas
function handleAddMovie(e) {
    e.preventDefault();
    
    const newMovie = {
        titulo: document.getElementById('titulo').value,
        ano_lancamento: parseInt(document.getElementById('ano_lancamento').value),
        diretor: document.getElementById('diretor').value,
        genero: document.getElementById('genero').value,
        sinopse: document.getElementById('sinopse').value,
        duracao: parseInt(document.getElementById('duracao').value),
        classificacao: document.getElementById('classificacao').value,
        capa_url: document.getElementById('capa_url').value,
        valor_aluguel: parseFloat(document.getElementById('valor_aluguel').value)
    };
    
    if (isOnlineMode) {
        fetch(`${API_BASE}/filmes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newMovie)
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                showAdminMessage(data.error, 'error');
            } else {
                showAdminMessage('Filme adicionado com sucesso!', 'success');
                addMovieForm.reset();
                loadMovies();
            }
        })
        .catch(error => {
            console.error('Erro:', error);
            showAdminMessage('Erro ao adicionar filme. Verifique se o servidor está rodando.', 'error');
        });
    } else {
        // Modo offline - adicionar ao localStorage
        const movies = JSON.parse(localStorage.getItem('movies')) || [];
        newMovie.id = Date.now();
        movies.push(newMovie);
        localStorage.setItem('movies', JSON.stringify(movies));
        
        showAdminMessage('Filme adicionado com sucesso!', 'success');
        addMovieForm.reset();
        loadMovies();
    }
}

function loadAdminMoviesList(movies) {
    adminMoviesList.innerHTML = '';
    
    movies.forEach(movie => {
        const adminCard = document.createElement('div');
        adminCard.className = 'admin-movie-card';
        adminCard.innerHTML = `
            <img src="${movie.capa_url}" alt="${movie.titulo}">
            <div class="admin-movie-card-content">
                <h4>${movie.titulo}</h4>
                <p>${movie.diretor} (${movie.ano_lancamento})</p>
                <div class="admin-movie-actions">
                    <button class="btn btn-edit" data-id="${movie.id}">Editar</button>
                    <button class="btn btn-danger" data-id="${movie.id}">Excluir</button>
                </div>
            </div>
        `;
        
        adminCard.querySelector('.btn-edit').addEventListener('click', () => editMovie(movie));
        adminCard.querySelector('.btn-danger').addEventListener('click', () => deleteMovie(movie.id));
        
        adminMoviesList.appendChild(adminCard);
    });
}

function editMovie(movie) {
    // Preencher o formulário de edição com os dados do filme
    document.getElementById('edit-id').value = movie.id;
    document.getElementById('edit-titulo').value = movie.titulo;
    document.getElementById('edit-ano_lancamento').value = movie.ano_lancamento;
    document.getElementById('edit-diretor').value = movie.diretor;
    document.getElementById('edit-genero').value = movie.genero;
    document.getElementById('edit-sinopse').value = movie.sinopse;
    document.getElementById('edit-duracao').value = movie.duracao;
    document.getElementById('edit-classificacao').value = movie.classificacao;
    document.getElementById('edit-capa_url').value = movie.capa_url;
    document.getElementById('edit-valor_aluguel').value = movie.valor_aluguel;
    
    // Exibir o modal
    editMovieModal.classList.remove('hidden');
}

function handleEditMovie(e) {
    e.preventDefault();
    
    const updatedMovie = {
        id: document.getElementById('edit-id').value,
        titulo: document.getElementById('edit-titulo').value,
        ano_lancamento: parseInt(document.getElementById('edit-ano_lancamento').value),
        diretor: document.getElementById('edit-diretor').value,
        genero: document.getElementById('edit-genero').value,
        sinopse: document.getElementById('edit-sinopse').value,
        duracao: parseInt(document.getElementById('edit-duracao').value),
        classificacao: document.getElementById('edit-classificacao').value,
        capa_url: document.getElementById('edit-capa_url').value,
        valor_aluguel: parseFloat(document.getElementById('edit-valor_aluguel').value)
    };
    
    if (isOnlineMode) {
        fetch(`${API_BASE}/filmes/${updatedMovie.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedMovie)
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                showAdminMessage(data.error, 'error');
            } else {
                showAdminMessage('Filme atualizado com sucesso!', 'success');
                editMovieModal.classList.add('hidden');
                loadMovies();
            }
        })
        .catch(error => {
            console.error('Erro:', error);
            showAdminMessage('Erro ao atualizar filme. Verifique se o servidor está rodando.', 'error');
        });
    } else {
        // Modo offline - atualizar no localStorage
        const movies = JSON.parse(localStorage.getItem('movies')) || [];
        const index = movies.findIndex(m => m.id == updatedMovie.id);
        
        if (index !== -1) {
            movies[index] = updatedMovie;
            localStorage.setItem('movies', JSON.stringify(movies));
            
            showAdminMessage('Filme atualizado com sucesso!', 'success');
            editMovieModal.classList.add('hidden');
            loadMovies();
        } else {
            showAdminMessage('Filme não encontrado.', 'error');
        }
    }
}

function deleteMovie(movieId) {
    if (!confirm('Tem certeza que deseja excluir este filme?')) {
        return;
    }
    
    if (isOnlineMode) {
        fetch(`${API_BASE}/filmes/${movieId}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                showAdminMessage(data.error, 'error');
            } else {
                showAdminMessage('Filme excluído com sucesso!', 'success');
                loadMovies();
            }
        })
        .catch(error => {
            console.error('Erro:', error);
            showAdminMessage('Erro ao excluir filme. Verifique se o servidor está rodando.', 'error');
        });
    } else {
        // Modo offline - remover do localStorage
        const movies = JSON.parse(localStorage.getItem('movies')) || [];
        const filteredMovies = movies.filter(m => m.id != movieId);
        localStorage.setItem('movies', JSON.stringify(filteredMovies));
        
        showAdminMessage('Filme excluído com sucesso!', 'success');
        loadMovies();
    }
}

function showAdminMessage(message, type) {
    adminMessage.textContent = message;
    adminMessage.className = `message ${type}`;
    
    // Esconder a mensagem após 3 segundos
    setTimeout(() => {
        adminMessage.textContent = '';
        adminMessage.className = 'message';
    }, 3000);
}

// Funções auxiliares para navegação
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