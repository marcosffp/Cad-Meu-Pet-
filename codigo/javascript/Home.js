const RelatosApp = (function() {
    // Variáveis privadas
    const apiUrl = 'https://bc8bb33f-6175-4214-998c-292c322364a2-00-2ddr60lv3tm7s.worf.replit.dev/relatos'; 
    const apiPetReunidos = 'https://bc8bb33f-6175-4214-998c-292c322364a2-00-2ddr60lv3tm7s.worf.replit.dev/animais_perdidos';
    let db = [];

    // Função privada para exibir mensagens
    function displayMessage(message) {
        alert(message);
    }

    // Função privada para ler os relatos via API JSONServer
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

    // Função privada para criar um relato via API JSONServer
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
        })
        .catch(error => {
            console.error('Erro ao inserir Relato via API JSONServer:', error);
            displayMessage("Erro ao inserir Relato");
        });
    }

    // Função privada para atualizar curtidas de um relato
    function toggleLike(id, currentLiked, currentLikes, refreshFunction) {
        const newLikes = currentLiked ? Math.max(0, currentLikes - 1) : currentLikes + 1;
        const relato = {
            liked: !currentLiked,
            likes: newLikes
        };

        fetch(`${apiUrl}/${id}`, {
            method: 'PATCH',
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
            const likesCountElement = document.getElementById(`likes-${id}`);
            if (likesCountElement) {
                likesCountElement.textContent = relato.likes;
            } else {
                console.error(`Elemento com id likes-${id} não foi encontrado.`);
            }
            if (refreshFunction) refreshFunction();
        })
        .catch(error => {
            console.error('Erro ao atualizar curtidas via API JSONServer:', error);
            displayMessage("Erro ao atualizar curtidas");
        });
    }

    // Função privada para curtir um relato
    function handleLike(id, liked, likes, refreshFunction) {
        toggleLike(id, liked, likes, refreshFunction);
    }

    // Função privada para listar os relatos na interface
    function ListaRelatos() {
        const DivRelatos = document.getElementById("relatos-container");
        DivRelatos.innerHTML = "";

        db.forEach(relato => {
            DivRelatos.innerHTML += `
            <div class="col">
                <div class="card h-100 d-flex flex-column">
                    <img src=${relato.imagemUrl} class="card-img-top" alt="imagem do relato">
                    <div class="card-body d-flex flex-column align-items-stretch">
                        <div class="d-flex justify-content-between mb-2">
                            <h5 class="card-title">${relato.nome}</h5>
                            <span class="date text-muted">${relato.data}</span>
                        </div>
                        <p class="card-text mb-2">${relato.localizacao}</p>
                        <p class="card-text flex-grow-1">${relato.descricao}</p>
                        <div class="mt-auto">
                            <div class="like-section">
                                <span id="like-icon-${relato.id}" class="like-icon" onclick="RelatosApp.handleLike(${relato.id}, ${relato.liked}, ${relato.likes})">
                                    <i class="fas fa-thumbs-up" style="color: ${relato.liked ? '#287a66' : '#6c757d'};"></i>
                                </span>
                                <span id="likes-${relato.id}" style="margin-right: 5px;">${relato.likes}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
        });
    }

    // Função privada para contar os animais encontrados
    function contarAnimaisencontrados() {
        fetch(apiPetReunidos)
            .then(response => response.json())
            .then(data => {
                const animaisencontrados = data.filter(animal => animal.status === 'encontrado').length;
                document.getElementById('pets-reunidos').textContent = animaisencontrados;
            })
            .catch(error => {
                console.error('Erro ao contar animais encontrados via API JSONServer:', error);
                displayMessage("Erro ao contar animais encontrados");
            });
    }

    // Inicializa o módulo
    function init() {
        readRelato(dados => {
            db = dados;
            ListaRelatos();
        });
        contarAnimaisencontrados();
    }

    // Espera o DOM ser carregado para garantir que todos os elementos estão disponíveis
    document.addEventListener("DOMContentLoaded", function () {
        const menuIcon = document.querySelector(".mobile-menu-icon button");
        const menu = document.querySelector(".menu");

        menuIcon.addEventListener("click", function () {
            menu.classList.toggle("active");
        });

        init();
    });

    // Retorna funções públicas
    return {
        handleLike
    };
})();

// Inicializa a aplicação
document.addEventListener("DOMContentLoaded", RelatosApp.init);
