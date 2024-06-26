
    const apiUrl = 'http://localhost:3000/users';

function init() {
}
document.addEventListener("DOMContentLoaded", function () {
    const menuIcon = document.querySelector(".mobile-menu-icon button");
    const menu = document.querySelector(".menu");

    menuIcon.addEventListener("click", function () {
        menu.classList.toggle("active");
    });

    const togglePassword = document.getElementById('togglePassword');
    const passwordField = document.getElementById('inputSenha');

    togglePassword.addEventListener('click', function () {
        const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordField.setAttribute('type', type);
        this.querySelector('i').classList.toggle('fa-eye');
        this.querySelector('i').classList.toggle('fa-eye-slash');
    });

    init();
    updateCadastroButton();

    document.getElementById('Anunciar').addEventListener('click', verificarLogin);
    document.getElementById('Cadastrar').addEventListener('click', verificarLogin);

    document.getElementById("btnLogin").addEventListener("click", function (event) {
        event.preventDefault();
        login();
    });
});

async function login() {
    const senha = document.getElementById('inputSenha').value;
    const email = document.getElementById('inputEmail').value;

    try {
        const res = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        if (!res.ok) {
            throw new Error('Erro ao buscar usuários');
        }

        const users = await res.json();
        const usuario = users.find((user) => user.email === email);

        if (!usuario) {
            window.alert("Usuário não encontrado");
            return;
        }

        if (usuario.senha === senha) {
            localStorage.setItem('userId', usuario.id);
            localStorage.setItem('userName', usuario.nome);
            localStorage.setItem('userEmail', usuario.email);
            window.location.href = "../html/home.html";
        } else {
            window.alert("Senha incorreta");
        }
    } catch (error) {
        console.error('Erro ao buscar usuários:', error);
        window.alert("Ocorreu um erro ao fazer login. Por favor, tente novamente mais tarde.");
    }
}

function verificarLogin(event) {
    const user = sessionStorage.getItem('userName') || localStorage.getItem('userName');
    if (!user) {
        event.preventDefault();
        window.location.href = '../html/cadastro_usuario.html';
    }
}

function updateCadastroButton() {
    const btnCadastrar = document.getElementById('btn-cadastrar');
    const user = sessionStorage.getItem('userName') || localStorage.getItem('userName');
    if (user) {
        btnCadastrar.textContent = 'Logado';
        btnCadastrar.href = '../html/editor_perfil.html';
    } else {
        btnCadastrar.textContent = 'Cadastrar';
        btnCadastrar.href = '../html/cadastro_usuario.html';
    }
}

