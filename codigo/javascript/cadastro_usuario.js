// URL da API JSONServer - Substitua pela URL correta da sua API
const apiUrl = 'https://bc8bb33f-6175-4214-998c-292c322364a2-00-2ddr60lv3tm7s.worf.replit.dev/cadastros';

document.addEventListener("DOMContentLoaded", function () {
    const menuIcon = document.querySelector(".mobile-menu-icon button");
    const menu = document.querySelector(".menu");

    // Alterna a visibilidade do menu quando o ícone do menu móvel é clicado
    menuIcon.addEventListener("click", function () {
        menu.classList.toggle("active");
    });

    // Define uma variável para o formulário de cadastro de usuário
    const formCadastro = document.getElementById("form-contato");

    // Adiciona funções para tratar os eventos
    const btnInsert = document.getElementById("btnInsert");
    btnInsert.addEventListener('click', function (event) {
        event.preventDefault(); // Previne o envio do formulário até que seja validado

        // Verifica se o formulário está preenchido corretamente
        if (!formCadastro.checkValidity()) {
            displayMessage("Preencha o formulário corretamente.");
            return;
        }

        // Obtém os valores dos campos do formulário
        const nome = document.getElementById('inputNome').value;
        const email = document.getElementById('inputEmail').value;
        const senha = document.getElementById('inputSenha').value;

        // Valida o nome
        if (!validateName(nome)) {
            displayMessage("Nome inválido. Por favor, insira um nome válido.");
            return;
        }

        // Valida o email
        if (!validateEmail(email)) {
            displayMessage("Email inválido. Por favor, insira um email válido.");
            return;
        }

        // Valida a senha
        if (!validatePassword(senha)) {
            displayMessage("Senha fraca. A senha deve conter letras maiúsculas, minúsculas, números e símbolos.");
            return;
        }

        // Cria um objeto com os dados do usuário
        const usuario = {
            nome: nome,
            email: email,
            senha: senha,
            relatos: [], // Inicializa o array de relatos
            animais_perdidos: [] // Inicializa o array de animais perdidos
        };

        // Cria o usuário no banco de dados
        createUsuario(usuario);
    });

    // Oculta a mensagem de aviso após 5 segundos
    const msg = document.getElementById('msg');
    msg.addEventListener("DOMSubtreeModified", function (e) {
        if (e.target.innerHTML == "") return;
        setTimeout(function () {
            const alert = msg.getElementsByClassName("alert");
            if (alert[0]) alert[0].remove();
        }, 5000);
    });

    // Adiciona a funcionalidade de mostrar/ocultar senha
    const togglePasswordButton = document.getElementById("togglePassword");
    const passwordInput = document.getElementById("inputSenha");

    togglePasswordButton.addEventListener('click', function () {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);

        // Alterna a classe do ícone
        this.querySelector('i').classList.toggle('fa-eye');
        this.querySelector('i').classList.toggle('fa-eye-slash');
    });
});

// Função para exibir mensagens de aviso
function displayMessage(mensagem) {
    const msg = document.getElementById('msg');
    msg.innerHTML = '<div class="alert alert-warning">' + mensagem + '</div>';
}

// Função para criar um novo usuário na API JSONServer
function createUsuario(usuario) {
    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(usuario),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao cadastrar usuário');
        }
        return response.json();
    })
    .then(data => {
        // Após o cadastro bem-sucedido, redireciona para a página home com o ID do usuário
        const userId = data.id; // Obtém o ID do usuário recém-criado
        alert("Usuário cadastrado com sucesso");
        window.location.href = `home.html?id=${userId}`; // Redireciona para a página inicial com o ID do usuário
    })
    .catch(error => {
        console.error('Erro ao cadastrar usuário via API JSONServer:', error);
        displayMessage("Erro ao cadastrar usuário");
    });
}

// Função para validar o nome
function validateName(name) {
    const nameRegex = /^[a-zA-Z\s]+$/;
    return nameRegex.test(name);
}

// Função para validar o email
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Função para validar a senha
function validatePassword(password) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
}
