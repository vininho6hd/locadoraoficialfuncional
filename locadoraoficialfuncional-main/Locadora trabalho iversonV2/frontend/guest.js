// Este arquivo contém funcionalidades específicas para usuários convidados
// Pode ser usado para limitar recursos para usuários não logados

document.addEventListener('DOMContentLoaded', function() {
    const user = JSON.parse(localStorage.getItem('loggedUser') || '{}');
    
    // Verificar se é um usuário convidado
    if (user.email === 'guest@example.com') {
        applyGuestRestrictions();
    }
});

function applyGuestRestrictions() {
    // Exemplo: Esconder funcionalidades premium
    const premiumElements = document.querySelectorAll('.premium');
    premiumElements.forEach(el => {
        el.style.display = 'none';
    });
    
    // Adicionar aviso de usuário convidado
    const userInfo = document.querySelector('.user-info');
    if (userInfo) {
        const guestBadge = document.createElement('span');
        guestBadge.textContent = 'Convidado';
        guestBadge.style.background = '#6c757d';
        guestBadge.style.color = 'white';
        guestBadge.style.padding = '5px 10px';
        guestBadge.style.borderRadius = '3px';
        guestBadge.style.fontSize = '0.8rem';
        userInfo.insertBefore(guestBadge, userInfo.firstChild);
    }
    
    // Mostrar mensagem incentivando cadastro
    showGuestMessage();
}

function showGuestMessage() {
    const message = document.createElement('div');
    message.style.background = '#d4edda';
    message.style.color = '#155724';
    message.style.padding = '10px';
    message.style.borderRadius = '5px';
    message.style.margin = '10px 0';
    message.style.textAlign = 'center';
    message.innerHTML = `
        <strong>Acesso como convidado</strong>. 
        <a href="#" id="register-from-guest" style="color: #155724; text-decoration: underline;">
            Cadastre-se
        </a> 
        para acessar recursos exclusivos!
    `;
    
    const searchSection = document.querySelector('.search-section');
    if (searchSection) {
        searchSection.parentNode.insertBefore(message, searchSection.nextSibling);
        
        document.getElementById('register-from-guest').addEventListener('click', function(e) {
            e.preventDefault();
            handleLogout();
            showRegister();
        });
    }
}