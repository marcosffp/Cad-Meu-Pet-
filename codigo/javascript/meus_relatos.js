import CONFIG from "../alterar_aqui_link_json_server.js";

const apiUrlRelato = CONFIG.baseUrl + 'relatos';
const usersapiUrlRelato = CONFIG.baseUrl + 'users';
let db = [];
let userRelatos = [];


function reloadPage() {
    location.reload();
}

function displayMessage(message) {
    console.log(message);
}


function updateCadastroButton() {
    const btnCadastrar = document.getElementById('Cadastrar').querySelector('a');
    const user = sessionStorage.getItem('userName') || localStorage.getItem('userName');

    if (btnCadastrar) {
        if (user) {
            btnCadastrar.textContent = 'Logado';
            btnCadastrar.href = '../html/editor_perfil.html';
        } else {
            btnCadastrar.textContent = 'Cadastrar';
            btnCadastrar.href = '../html/cadastro_usuario.html';
        }
    }
}

async function readRelato(processaDados) {
    try {
        const response = await fetch(apiUrlRelato);
        if (!response.ok) {
            throw new Error('Erro ao ler Relatos via API JSONServer');
        }
        const data = await response.json();
        processaDados(data);
    } catch (error) {
        console.error('Erro ao ler Relatos via API JSONServer:', error);
        displayMessage("Erro ao ler Relatos");
    }
}

function createRelato(relato, refreshFunction) {
    relato.liked = relato.liked !== undefined ? relato.liked : false;
    relato.likes = relato.likes !== undefined ? relato.likes : 0;

    fetch(apiUrlRelato, {
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
            reloadPage();
        })
        .catch(error => {
            console.error('Erro ao inserir Relato via API JSONServer:', error);
            displayMessage("Erro ao inserir Relato");
        });
}

function updateRelato(id, relato) {
    fetch(`${apiUrlRelato}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(relato),
    })
        .then(response => response.json())
        .then(data => {
            displayMessage("Relato alterado com sucesso");
            reloadPage();
        })
        .catch(error => {
            console.error('Erro ao atualizar Relato via API JSONServer:', error);
            displayMessage("Erro ao atualizar Relato");
        });
}

async function deleteRelato(id, refreshFunction) {
    try {
        const response = await fetch(`${apiUrlRelato}/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error('Erro ao remover Relato via API JSONServer');
        }
        const data = await response.json();

        const userId = localStorage.getItem('userId');
        if (userId) {
            const userResponse = await fetch(`${usersapiUrlRelato}/${userId}`);
            if (!userResponse.ok) {
                throw new Error('Erro ao obter usuário após remover relato');
            }
            const user = await userResponse.json();
            const updatedRelatos = user.relatos.filter(r => r !== id);
            const updatedUser = { ...user, relatos: updatedRelatos };
            const updateUserResponse = await fetch(`${usersapiUrlRelato}/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedUser),
            });
            if (!updateUserResponse.ok) {
                throw new Error('Erro ao atualizar relatos do usuário via API JSONServer');
            }
            const updatedUserData = await updateUserResponse.json();
        }

        displayMessage("Relato removido com sucesso");
        if (refreshFunction) refreshFunction();
        reloadPage();
    } catch (error) {
        console.error('Erro ao remover Relato via API JSONServer:', error);
        displayMessage("Erro ao remover Relato");
    }
}

function ListaRelatos() {
    const DivRelatos = document.getElementById("relatos-container");
    DivRelatos.innerHTML = "";

    for (let index = 0; index < db.length; index++) {
        const relato = db[index];
        if (!userRelatos.includes(relato.id)) continue;

        DivRelatos.innerHTML += `
  <div class="container">
    <!-- Início do loop para renderizar os cards -->
    <div class="col">
      <div class="card h-100" >
        <img src="${relato.imagemUrl}" class="card-img-top" alt="Imagem do Relato">
        <div class="card-body">
          <h5 class="card-title">${relato.nome}</h5>
          <p class="card-text">${relato.data}</p>
          <p class="card-text">${relato.localizacao}</p>
          <p class="card-text">${relato.descricao}</p>
          <div class="d-grid gap-2">
            <button class="btn btn-danger" onclick="handleDelete(${relato.id})">Excluir</button>
            <button class="btn btn-warning" onclick="handleEdit(${relato.id})">Alterar</button>
            <button class="btn btn-info" onclick="handleView(${relato.id})">Visualizar</button>
          </div>
        </div>
      </div>
    </div>
    <!-- Final do loop para renderizar os cards -->
  </div>
</div>`;
    }
}


function handleDelete(id) {
    if (confirm('Tem certeza que deseja excluir este relato?')) {
        deleteRelato(id, reloadPage);
    }
}

function handleEdit(id) {
    const relato = db.find(r => r.id === id);
    if (relato) {

        document.getElementById('editId').value = relato.id;
        document.getElementById('editNome').value = relato.nome;
        document.getElementById('editData').value = relato.data;
        document.getElementById('editLocalizacao').value = relato.localizacao;
        document.getElementById('editDescricao').value = relato.descricao;
        document.getElementById('editImagemUrl').value = relato.imagemUrl;


        const editModal = new bootstrap.Modal(document.getElementById('editModal'));
        editModal.show();
    }
}

function handleView(id) {
    const relato = db.find(r => r.id === id);
    if (relato) {

        document.getElementById('viewNome').textContent = relato.nome;
        document.getElementById('viewData').textContent = relato.data;
        document.getElementById('viewLocalizacao').textContent = relato.localizacao;
        document.getElementById('viewDescricao').textContent = relato.descricao;


        const imgElement = document.getElementById('viewImagemUrl');
        imgElement.src = relato.imagemUrl;

        const viewModal = new bootstrap.Modal(document.getElementById('viewModal'));
        viewModal.show();
    }
}

document.addEventListener('DOMContentLoaded', async function () {
    const userId = localStorage.getItem('userId');
    if (userId) {
        try {
            const userResponse = await fetch(`${usersapiUrlRelato}/${userId}`);
            if (!userResponse.ok) {
                throw new Error('Erro ao obter dados do usuário');
            }
            const user = await userResponse.json();
            userRelatos = user.relatos || [];

            await readRelato(data => {
                db = data;
                ListaRelatos();
            });
        } catch (error) {
            console.error('Erro ao obter dados do usuário:', error);
        }
    } else {
        console.error('Usuário não está logado');
    }
    document.getElementById('editForm').addEventListener('submit', function (event) {
        event.preventDefault();
        const id = document.getElementById('editId').value;
        const nome = document.getElementById('editNome').value;
        const data = document.getElementById('editData').value;
        const localizacao = document.getElementById('editLocalizacao').value;
        const descricao = document.getElementById('editDescricao').value;
        const imagemUrl = document.getElementById('editImagemUrl').value;

        const relato = db.find(r => r.id == id);
        const updatedRelato = { ...relato, nome, data, localizacao, descricao, imagemUrl };


        updateRelato(id, updatedRelato, () => {
            const editModal = new bootstrap.Modal(document.getElementById('editModal'));
            editModal.hide();
            reloadPage();
        });
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const menuIcon = document.querySelector(".mobile-menu-icon button");
    if (menuIcon) {
        menuIcon.addEventListener("click", function () {
            const menu = document.querySelector(".menu");
            if (menu) {
                menu.classList.toggle("active");
            }
        });
    } else {
        console.error("Ícone do menu mobile não encontrado.");
    }

    const anunciarLink = document.getElementById('Anunciar');
    if (anunciarLink) {
        anunciarLink.addEventListener('click', verificarLogin);
    }

    const cadastrarLink = document.getElementById('Cadastrar');
    if (cadastrarLink) {
        cadastrarLink.addEventListener('click', verificarLogin);
    }
});

function verificarLogin(event) {
    const user = sessionStorage.getItem('userName') || null;
    if (!user) {
        event.preventDefault();
        window.location.href = '../html/cadastro_usuario.html';
    }
}


document.addEventListener("DOMContentLoaded", function () {
    updateCadastroButton();

    document.getElementById('Anunciar').addEventListener('click', verificarLogin);
    document.getElementById('Cadastrar').addEventListener('click', verificarLogin);
});


