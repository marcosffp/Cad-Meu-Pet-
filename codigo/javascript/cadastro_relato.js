

// URL da API JSONServer - Substitua pela URL correta da sua API
const apiUrl = 'https://bc8bb33f-6175-4214-998c-292c322364a2-00-2ddr60lv3tm7s.worf.replit.dev/relatos';

document.addEventListener("DOMContentLoaded", function () {
    const menuIcon = document.querySelector(".mobile-menu-icon button");
    const menu = document.querySelector(".menu");

    menuIcon.addEventListener("click", function () {
        menu.classList.toggle("active");
    });

    // Define uma variável para o formulário de relato
    const formRelato = document.getElementById("form-relato");

    // Adiciona funções para tratar os eventos 
    const btnInsert = document.getElementById("btnInsert");
    btnInsert.addEventListener('click', function () {
        // Verifica se o formulário está preenchido corretamente
        if (!formRelato.checkValidity()) {
            displayMessage("Preencha o formulário corretamente.");
            return;
        }

        // Obtem os valores dos campos do formulário
        const campoNome = document.getElementById('inputNome').value;
        const campoData = document.getElementById('inputData').value;
        const campoLocalizacao = document.getElementById('inputLocalizacao').value;
        const campoDescricao = document.getElementById('inputDescricao').value;
        const campoImagemUrl = document.getElementById('inputImagemUrl').value;

        // Cria um objeto com os dados do relato
        const relato = {
            nome: campoNome,
            data: campoData,
            localizacao: campoLocalizacao,
            descricao: campoDescricao,
            imagemUrl: campoImagemUrl
        };

        // Cria o relato no banco de dados
        createRelato(relato);

        // Limpa o formulario
        formRelato.reset();
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



function createRelato(relato, refreshFunction) {
    // Garante que os campos liked e likes sejam definidos corretamente
    relato.liked = relato.liked !== undefined ? relato.liked : false;
    relato.likes = relato.likes !== undefined ? relato.likes : 0;

    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(relato),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao inserir relato');
            }
            return response.json();
        })
        .then(data => {
            displayMessage("Relato inserido com sucesso");
            if (refreshFunction) refreshFunction();
        })
        .catch(error => {
            console.error('Erro ao inserir Relato via API JSONServer:', error);
            displayMessage("Erro ao inserir Relato");
        });
}



