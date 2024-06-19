const apiUrl = 'https://bc8bb33f-6175-4214-998c-292c322364a2-00-2ddr60lv3tm7s.worf.replit.dev/relatos';
const usersApiUrl = 'https://bc8bb33f-6175-4214-998c-292c322364a2-00-2ddr60lv3tm7s.worf.replit.dev/users';
let db = [];
let userRelatos = [];

// Função para recarregar a página
function reloadPage() {
    location.reload();
}

// Função para listar relatos na interface
function ListaRelatos() {
    const DivRelatos = document.getElementById("relatos-container");
    DivRelatos.innerHTML = "";

    for (let index = 0; index < db.length; index++) {
        const relato = db[index];

        // Verifica se o relato pertence ao usuário logado
        if (!userRelatos.includes(relato.id)) continue;

        DivRelatos.innerHTML += `
            <div class="card h-100">
                <img src="${relato.imagemUrl}" class="card-img-top" alt="imagem do relato">
                <div class="card-body">
                    <h5 class="card-title">${relato.nome}</h5>
                    <p class="card-text">${relato.data}</p>
                    <p class="card-text">${relato.localizacao}</p>
                    <p class="card-text">${relato.descricao}</p>
                    <button class="btn btn-danger" onclick="handleDelete(${relato.id})">Excluir</button>
                    <button class="btn btn-warning" onclick="handleEdit(${relato.id})">Alterar</button>
                    <button class="btn btn-info" onclick="handleView(${relato.id})">Visualizar</button>
                </div>
            </div>`;
    }
}

// Função para lidar com a exclusão de um relato
function handleDelete(id) {
    if (confirm('Tem certeza que deseja excluir este relato?')) {
        deleteRelato(id, reloadPage);
    }
}

// Função para lidar com a edição de um relato
function handleEdit(id) {
    const relato = db.find(r => r.id === id);
    if (relato) {
        // Preenche o formulário de edição com os dados do relato
        document.getElementById('editId').value = relato.id;
        document.getElementById('editNome').value = relato.nome;
        document.getElementById('editData').value = relato.data;
        document.getElementById('editLocalizacao').value = relato.localizacao;
        document.getElementById('editDescricao').value = relato.descricao;
        document.getElementById('editImagemUrl').value = relato.imagemUrl;

        // Mostra o modal de edição
        const editModal = new bootstrap.Modal(document.getElementById('editModal'));
        editModal.show();
    }
}

// Função para lidar com a visualização de um relato
function handleView(id) {
    const relato = db.find(r => r.id === id);
    if (relato) {
        // Preenche o modal de visualização com os dados do relato
        document.getElementById('viewNome').textContent = relato.nome;
        document.getElementById('viewData').textContent = relato.data;
        document.getElementById('viewLocalizacao').textContent = relato.localizacao;
        document.getElementById('viewDescricao').textContent = relato.descricao;

        // Define a imagem no modal de visualização
        const imgElement = document.getElementById('viewImagemUrl');
        imgElement.src = relato.imagemUrl;

        // Mostra o modal de visualização
        const viewModal = new bootstrap.Modal(document.getElementById('viewModal'));
        viewModal.show();
    }
}

// Função para inicializar a página
document.addEventListener('DOMContentLoaded', function () {
    const userId = localStorage.getItem('userId');
    if (userId) {
        // Obter dados do usuário logado
        fetch(`${usersApiUrl}/${userId}`)
            .then(response => response.json())
            .then(user => {
                userRelatos = user.relatos || [];
                // Ler os relatos após obter o usuário
                readRelato(data => {
                    db = data;
                    ListaRelatos();
                });
            })
            .catch(error => {
                console.error('Erro ao obter dados do usuário:', error);
            });
    } else {
        console.error('Usuário não está logado');
    }

    // Event listener para o formulário de edição
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

        // Atualizar o relato
        updateRelato(id, updatedRelato, () => {
            const editModal = new bootstrap.Modal(document.getElementById('editModal'));
            editModal.hide(); // Fecha o modal após salvar
            reloadPage(); // Recarrega a página
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

// Função para criar um relato via API JSONServer
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
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao remover Relato via API JSONServer');
        }
        return response.json();
    })
    .then(data => {
        // Atualizar array de relatos do usuário após a exclusão
        const userId = localStorage.getItem('userId');
        if (userId) {
            fetch(`${usersApiUrl}/${userId}`)
                .then(response => response.json())
                .then(user => {
                    const updatedRelatos = user.relatos.filter(r => r !== id);
                    const updatedUser = { ...user, relatos: updatedRelatos };

                    // Atualizar usuário na API
                    fetch(`${usersApiUrl}/${userId}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(updatedUser),
                    })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Erro ao atualizar relatos do usuário via API JSONServer');
                        }
                        return response.json();
                    })
                    .then(data => {
                        displayMessage("Relato removido com sucesso");
                        if (refreshFunction) refreshFunction();
                        reloadPage();
                    })
                    .catch(error => {
                        console.error('Erro ao atualizar relatos do usuário:', error);
                        displayMessage("Erro ao remover Relato");
                    });
                })
                .catch(error => {
                    console.error('Erro ao obter usuário após remover relato:', error);
                    displayMessage("Erro ao remover Relato");
                });
        } else {
            console.error('Usuário não está logado');
            displayMessage("Erro ao remover Relato");
        }
    })
    .catch(error => {
        console.error('Erro ao remover Relato via API JSONServer:', error);
        displayMessage("Erro ao remover Relato");
    });
}

// Função para exibir mensagens na interface do usuário
function displayMessage(message) {
    console.log(message);
}

// Event listener para o ícone de menu mobile
document.addEventListener("DOMContentLoaded", function () {
    const menuIcon = document.querySelector(".mobile-menu-icon button");
    const menu = document.querySelector(".menu");

    menuIcon.addEventListener("click", function () {
        menu.classList.toggle("active");
    });

    init(); // Função init() a ser definida conforme necessidade
});

// Event listener para verificar login ao clicar em links importantes
document.addEventListener("DOMContentLoaded", function () {
    updateCadastroButton();

    document.getElementById('Anunciar').addEventListener('click', verificarLogin);
    document.getElementById('Cadastrar').addEventListener('click', verificarLogin);
    document.querySelector('.butao-perdi a').addEventListener('click', verificarLogin);
    document.querySelector('.butao-achei a').addEventListener('click', verificarLogin);
    document.querySelector('.criar-relato a').addEventListener('click', verificarLogin);
    document.querySelector('.criar-relato:nth-child(2) a').addEventListener('click', verificarLogin);
});

// Função assíncrona para verificar se o usuário está logado
async function verificarLogin(event) {
    const user = sessionStorage.getItem('userName') || localStorage.getItem('userName');
    if (!user) {
        event.preventDefault(); // Prevenir o comportamento padrão de navegação
        window.location.href = '../html/cadastro_usuario.html'; // Redirecionar para a página de cadastro de usuário
    }
}

// Função para atualizar o botão de cadastro dependendo do login do usuário
function updateCadastroButton() {
    const btnCadastrar = document.getElementById('btn-cadastrar');
    const user = sessionStorage.getItem('userName') || localStorage.getItem('userName');
    if (user) {
        btnCadastrar.textContent = 'Logado';
        btnCadastrar.href = '#';
    } else {
        btnCadastrar.textContent = 'Cadastrar';
        btnCadastrar.href = '../html/cadastro_usuario.html';
    }
}
