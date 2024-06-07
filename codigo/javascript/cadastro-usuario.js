// URL da API JSONServer - Substitua pela URL correta da sua API
const apiUrl = 'https://bc8bb33f-6175-4214-998c-292c322364a2-00-2ddr60lv3tm7s.worf.replit.dev/cadastros';

document.addEventListener("DOMContentLoaded", function () {
    const menuIcon = document.querySelector(".mobile-menu-icon button");
    const menu = document.querySelector(".menu");

    menuIcon.addEventListener("click", function () {
        menu.classList.toggle("active");
    });

    const formCadastro = document.getElementById("form-contato");

    const btnInsert = document.getElementById("btnInsert");
    btnInsert.addEventListener('click', function () {
        if (!formCadastro.checkValidity()) {
            displayMessage("Preencha o formulário corretamente.");
            return;
        }

        const campoNome = document.getElementById('inputNome').value;
        const campoEmail = document.getElementById('inputEmail').value;
        const campoSenha = document.getElementById('inputSenha').value;

        const usuario = {
            nome: campoNome,
            email: campoEmail,
            senha: campoSenha
        };

        createUsuario(usuario);

        formCadastro.reset();
    });

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
    console.log('Tentando cadastrar usuário:', usuario);

    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(usuario),
    })
    .then(response => {
        console.log('Resposta recebida:', response);
        if (!response.ok) {
            throw new Error('Erro ao cadastrar usuário');
        }
        return response.json();
    })
    .then(data => {
        console.log('Dados recebidos:', data);
        alert("Cadastro efetivo: Usuário cadastrado com sucesso");
    })
    .catch(error => {
        console.error('Erro ao cadastrar usuário via API JSONServer:', error);
        displayMessage("Erro ao cadastrar usuário");
    });
}





// Evento de clique do botão "Inserir"
const btnInsert = document.getElementById("btnInsert");
btnInsert.addEventListener('click', function () {
    if (!formCadastro.checkValidity()) {
        displayMessage("Preencha o formulário corretamente.");
        return;
    }

    const campoNome = document.getElementById('inputNome').value;
    const campoEmail = document.getElementById('inputEmail').value;
    const campoSenha = document.getElementById('inputSenha').value;

    const usuario = {
        nome: campoNome,
        email: campoEmail,
        senha: campoSenha
    };

    createUsuario(usuario);

    formCadastro.reset();
});
