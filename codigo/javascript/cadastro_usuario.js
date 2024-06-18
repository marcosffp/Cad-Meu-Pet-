// URL da API JSONServer - Substitua pela URL correta da sua API
const apiUrl = 'https://bc8bb33f-6175-4214-998c-292c322364a2-00-2ddr60lv3tm7s.worf.replit.dev/users';

document.addEventListener("DOMContentLoaded", function () {
    const menuIcon = document.querySelector(".mobile-menu-icon button");
    const menu = document.querySelector(".menu");

    menuIcon.addEventListener("click", function () {
        menu.classList.toggle("mobile-menu-visible");
    });

    // Função para exibir mensagens de aviso
    function displayMessage(mensagem) {
        window.alert(mensagem)
    }

    // Função para validar o nome
    function validateName(name) {
        // Expressão regular que verifica se o nome possui apenas letras e espaços
        const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s']+$/;
        return nameRegex.test(name);
    }

    // Função para validar o e-mail
    function validateEmail(email) {
        // Expressão regular para validar o formato do e-mail
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Função para validar a senha
    function validatePassword(password) {
        // Verifica se a senha possui pelo menos 8 caracteres, uma letra maiúscula, uma letra minúscula, um número e um caractere especial
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return passwordRegex.test(password);
    }

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

        // Cria o usuário na API JSONServer
        createUsuario(usuario);
    });

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
                displayMessage("Usuário cadastrado com sucesso");
            })
            .catch(error => {
                console.error('Erro ao cadastrar usuário via API JSONServer:', error);
                displayMessage("Erro ao cadastrar usuário");
            });
    }
});
