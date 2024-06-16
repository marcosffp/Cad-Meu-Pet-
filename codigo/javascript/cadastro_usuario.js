// URL da API JSONServer - Substitua pela URL correta da sua API
const apiUrl = 'https://bc8bb33f-6175-4214-998c-292c322364a2-00-2ddr60lv3tm7s.worf.replit.dev/cadastros';

document.addEventListener("DOMContentLoaded", function () {
    const menuIcon = document.querySelector(".mobile-menu-icon button");
    const menu = document.querySelector(".menu");

    menuIcon.addEventListener("click", function () {
        menu.classList.toggle("active");
    });

    // Define uma variável para o formulário de cadastro de usuário
    const formCadastro = document.getElementById("form-contato");

    // Adiciona funções para tratar os eventos 
    const btnInsert = document.getElementById("btnInsert");
    btnInsert.addEventListener('click', function () {
        // Verifica se o formulário está preenchido corretamente
        if (!formCadastro.checkValidity()) {
            displayMessage("Preencha o formulário corretamente.");
            return;
        }

        // Obtem os valores dos campos do formulário
        const nome = document.getElementById('inputNome').value;
        const email = document.getElementById('inputEmail').value;
        const senha = document.getElementById('inputSenha').value;

        // Cria um objeto com os dados do usuário
        const usuario = {
            nome: nome,
            email: email,
            senha: senha
        };

        // Cria o usuário no banco de dados
        createUsuario(usuario);

        // Limpa o formulário
        formCadastro.reset();
    });

    // Oculta a mensagem de aviso após alguns 5 segundos
    const msg = document.getElementById('msg');
    msg.addEventListener("DOMSubtreeModified", function (e) {
        if (e.target.innerHTML == "") return;
        setTimeout(function () {
            const alert = msg.getElementsByClassName("alert");
            if (alert[0]) alert[0].remove();
        }, 5000);
    });
});

function displayMessage(mensagem) {
    const msg = document.getElementById('msg');
    msg.innerHTML = '<div class="alert alert-warning">' + mensagem + '</div>';
}

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

document.addEventListener("DOMContentLoaded", function () {
    const menuIcon = document.querySelector(".mobile-menu-icon button");
    const menu = document.querySelector(".menu");

    menuIcon.addEventListener("click", function () {
        menu.classList.toggle("mobile-menu-visible");
    });
});
