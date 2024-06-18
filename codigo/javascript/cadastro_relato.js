const apiUrl = 'https://bc8bb33f-6175-4214-998c-292c322364a2-00-2ddr60lv3tm7s.worf.replit.dev/relatos';
const usersApiUrl = 'https://bc8bb33f-6175-4214-998c-292c322364a2-00-2ddr60lv3tm7s.worf.replit.dev/users';

document.addEventListener("DOMContentLoaded", function () {
    const menuIcon = document.querySelector(".mobile-menu-icon button");
    const menu = document.querySelector(".menu");

    menuIcon.addEventListener("click", function () {
        menu.classList.toggle("active");
    });

    const formRelato = document.getElementById("form-relato");

    const btnInsert = document.getElementById("btnInsert");
    btnInsert.addEventListener('click', function () {
        if (!formRelato.checkValidity()) {
            displayMessage("Preencha o formulário corretamente.");
            return;
        }

        const campoNome = document.getElementById('inputNome').value;
        const campoData = document.getElementById('inputData').value;
        const campoLocalizacao = document.getElementById('inputLocalizacao').value;
        const campoDescricao = document.getElementById('inputDescricao').value;
        const campoImagemUrl = document.getElementById('inputImagemUrl').value;

        const relato = {
            nome: campoNome,
            data: campoData,
            localizacao: campoLocalizacao,
            descricao: campoDescricao,
            imagemUrl: campoImagemUrl
        };

        createRelato(relato);
        formRelato.reset();
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

function createRelato(relato, refreshFunction) {
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
        linkRelatoToUser(data.id);
        if (refreshFunction) refreshFunction();
    })
    .catch(error => {
        console.error('Erro ao inserir Relato via API JSONServer:', error);
        displayMessage("Erro ao inserir Relato");
    });
}

function linkRelatoToUser(relatoId) {
    const userId = localStorage.getItem('userId');
    if (!userId) {
        console.error('Usuário não está logado');
        return;
    }

    fetch(`${usersApiUrl}/${userId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao buscar usuário');
        }
        return response.json();
    })
    .then(user => {
        user.relatos.push(relatoId);

        return fetch(`${usersApiUrl}/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user)
        });
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao atualizar usuário');
        }
        console.log('Usuário atualizado com sucesso');
    })
    .catch(error => {
        console.error('Erro ao atualizar usuário:', error);
    });
}
