// URL da API JSONServer - Substitua pela URL correta da sua API
const apiUrl = 'https://bc8bb33f-6175-4214-998c-292c322364a2-00-2ddr60lv3tm7s.worf.replit.dev/relatos';
var db = [];

function reloadPage() {
    location.reload();
}

function ListaRelatos() {
    const DivRelatos = document.getElementById("relatos-container");
    DivRelatos.innerHTML = "";

    for (let index = 0; index < db.length; index++) {
        const relato = db[index];

        DivRelatos.innerHTML += `
            <div class="card h-100">
                <div class="card h-100 d-flex flex-column" style="background-color: #cde0d8;">
                    <img src=${relato.imagemUrl} class="card-img-top" alt="imagem do relato">
                    <div class="d-flex justify-content-between">
                        <h5 class="card-title mb-3">${relato.nome}</h5>
                        <span class="date text-muted">${relato.data}</span>
                    </div>
                    <p class="card-text mb-2">${relato.localizacao}</p>
                    <p class="card-text flex-grow-1">${relato.descricao}</p>
                    <div class="like-section">
                        <i id="like-icon-${relato.id}" class="fas fa-thumbs-up like-icon" style="color: ${relato.liked ? '#287a66' : '#6c757d'}" onclick="handleLike(${relato.id}, ${relato.liked}, ${relato.likes})"></i>
                        <span id="likes-${relato.id}">${relato.likes}</span>
                    </div>
                    <button class="btn btn-danger mt-3" onclick="handleDelete(${relato.id})">Excluir</button>
                    <button class="btn btn-warning mt-3" onclick="handleEdit(${relato.id})">Alterar</button>
                    <button class="btn btn-info mt-3" onclick="handleView(${relato.id})">Visualizar</button>
                </div>
            </div>`;
    }
}

function handleDelete(id) {
    if (confirm('Tem certeza que deseja excluir este relato?')) {
        deleteRelato(id, () => {
            reloadPage();
        });
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
        document.getElementById('viewImagemUrl').textContent = relato.imagemUrl;
        const viewModal = new bootstrap.Modal(document.getElementById('viewModal'));
        viewModal.show();
    }
}

document.addEventListener('DOMContentLoaded', function () {
    readRelato(dados => {
        db = dados;
        ListaRelatos();
    });

    document.getElementById('editForm').addEventListener('submit', function (event) {
        event.preventDefault();
        const id = document.getElementById('editId').value;
        const nome = document.getElementById('editNome').value;
        const data = document.getElementById('editData').value;
        const localizacao = document.getElementById('editLocalizacao').value;
        const descricao = document.getElementById('editDescricao').value;
        const imagemUrl = document.getElementById('editImagemUrl').value;
    
        const relato = db.find(r => r.id == id);
        const updatedRelato = { ...relato, nome, data, localizacao, descricao, imagemUrl }; // Preserva likes e liked
    
        updateRelato(id, updatedRelato, () => {
            const editModal = new bootstrap.Modal(document.getElementById('editModal'));
            editModal.hide(); // Fecha a modal após salvar
            location.reload(); // Recarrega a página
        });
    });
    
    
});

// Função para ler os relatos via API JSONServer
function readRelato(processaDados) {
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            processaDados(data);
        })
        .catch(error => {
            console.error('Erro ao ler Relatos via API JSONServer:', error);
            displayMessage("Erro ao ler Relatos");
        });
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
            reloadPage();
        })
        .catch(error => {
            console.error('Erro ao inserir Relato via API JSONServer:', error);
            displayMessage("Erro ao inserir Relato");
        });
}

// Função para atualizar um relato via API JSONServer
function updateRelato(id, relato) {
    fetch(`${apiUrl}/${id}`, {
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

// Função para remover um relato via API JSONServer
function deleteRelato(id, refreshFunction) {
    fetch(`${apiUrl}/${id}`, {
        method: 'DELETE',
    })
        .then(response => response.json())
        .then(data => {
            displayMessage("Relato removido com sucesso");
            if (refreshFunction) refreshFunction();
            reloadPage();
        })
        .catch(error => {
            console.error('Erro ao remover Relato via API JSONServer:', error);
            displayMessage("Erro ao remover Relato");
        });
}

function toggleLike(id, currentLiked, currentLikes, refreshFunction) {
    console.log("ID:", id);
    console.log("Curtido atualmente:", currentLiked);
    console.log("Número de likes atual:", currentLikes);

    // Ajuste para garantir que os likes não sejam negativos
    const newLikes = currentLiked ? Math.max(0, currentLikes - 1) : currentLikes + 1;
    console.log("Novo número de likes:", newLikes);

    const relato = {
        liked: !currentLiked,
        likes: newLikes
    };

    console.log("Novo objeto de relato:", relato);

    fetch(`${apiUrl}/${id}`, {
        method: 'PATCH',  // Usando PATCH para atualizar parcialmente o objeto
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(relato),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao atualizar curtidas');
            }
            return response.json();
        })
        .then(data => {
            // Atualiza o conteúdo da tag <span> com o novo número de likes
            const likesCountElement = document.getElementById(`likes-${id}`);
            if (likesCountElement) {
                likesCountElement.textContent = relato.likes;
            } else {
                console.error(`Elemento com id likes-${id} não foi encontrado.`);
            }

            console.log("Resposta do servidor:", data);
            if (refreshFunction) refreshFunction();
            reloadPage();
        })
        .catch(error => {
            console.error('Erro ao atualizar curtidas via API JSONServer:', error);
            displayMessage("Erro ao atualizar curtidas");
        });
}

// Função para curtir um relato
function handleLike(id, liked, likes, refreshFunction) {
    toggleLike(id, liked, likes, refreshFunction);
}

function displayMessage(message) {
    // Implemente sua lógica para exibir mensagens para o usuário, como um alerta ou uma área dedicada na página.
    console.log(message);
  }
