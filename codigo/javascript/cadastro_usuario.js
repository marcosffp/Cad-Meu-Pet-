// URL da API JSONServer - Substitua pela URL correta da sua API
const apiUrl = 'https://c75b6410-fffa-4b73-b82c-d1c21ec77f4a-00-3360t4cd2jp1v.picard.replit.dev/users';

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
            // Após salvar o ID do usuário no localStorage
            localStorage.setItem('userId', data.id);
            localStorage.setItem('userId', data.id);

            // Atualiza a URL do site com o ID do usuário
            const currentUrl = new URL(window.location.href);
            currentUrl.searchParams.set('userId', data.id);
            history.pushState({}, '', currentUrl);



            // Obtém a lista de usuários cadastrados do localStorage
            let usuariosCadastrados = JSON.parse(localStorage.getItem('javascript/usuario_cadastrado')) || [];

            // Cria o objeto com os dados do usuário cadastrado
            const usuarioCadastrado = { userId: data.id };

            // Adiciona o novo usuário à lista
            usuariosCadastrados.push(usuarioCadastrado);

            // Salva a lista atualizada de usuários cadastrados de volta no localStorage
            localStorage.setItem('javascript/usuario_cadastrado', JSON.stringify(usuariosCadastrados));

            displayMessage("Usuário cadastrado com sucesso");
        })
        .catch(error => {
            console.error('Erro ao cadastrar usuário via API JSONServer:', error);
            displayMessage("Erro ao cadastrar usuário");
        });
}

document.addEventListener("DOMContentLoaded", function () {
    const menuIcon = document.querySelector(".mobile-menu-icon button");
    const menu = document.querySelector(".menu");

    menuIcon.addEventListener("click", function () {
        menu.classList.toggle("mobile-menu-visible");
    });
});
