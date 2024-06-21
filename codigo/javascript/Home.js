const RelatosApp = (function() {
    const apiUrl = 'https://bc8bb33f-6175-4214-998c-292c322364a2-00-2ddr60lv3tm7s.worf.replit.dev/relatos';
    const apiPetReunidos = 'https://bc8bb33f-6175-4214-998c-292c322364a2-00-2ddr60lv3tm7s.worf.replit.dev/animais_perdidos';
    let db = [];

    function reloadPage() {
        location.reload();
    }

    function displayMessage(message) {
        alert(message);
    }

    function updateCadastroButton() {
        const btnCadastrar = document.getElementById('btn-cadastrar');
        const user = sessionStorage.getItem('userName') || localStorage.getItem('userName');
        if (user) {
            btnCadastrar.textContent = 'Logado';
            btnCadastrar.href = '../html/editor_perfil.html';
        } else {
            btnCadastrar.textContent = 'Cadastrar';
            btnCadastrar.href = '../html/cadastro_usuario.html';
        }
    }

    function readRelato(userId, processaDados) {
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                db = data;
                processaDados();
            })
            .catch(error => {
                console.error('Erro ao ler Relatos via API JSONServer:', error);
                displayMessage("Erro ao ler Relatos");
            });
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
            if (refreshFunction) refreshFunction();
            reloadPage();
        })
        .catch(error => {
            console.error('Erro ao inserir Relato via API JSONServer:', error);
            displayMessage("Erro ao inserir Relato");
        });
    }

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
            reloadPage();
            if (refreshFunction) refreshFunction();
        })
        .catch(error => {
            console.error('Erro ao atualizar curtidas via API JSONServer:', error);
            displayMessage("Erro ao atualizar curtidas");
        });
    }

    function handleLike(id, liked, likes, refreshFunction) {
        toggleLike(id, liked, likes, refreshFunction);
    }

    function ListaRelatos() {
        const DivRelatos = document.getElementById("relatos-container");
        DivRelatos.innerHTML = "";
        db.forEach(relato => {
            const isTruncated = relato.descricao.length > 100;

            const descricaoElement = document.createElement('p');
            descricaoElement.classList.add('card-text');
            descricaoElement.textContent = isTruncated ? relato.descricao.substring(0, 100) + '...' : relato.descricao;

            if (isTruncated) {
                const showMoreSpan = document.createElement('span');
                showMoreSpan.classList.add('show-more');
                showMoreSpan.textContent = 'Ver mais';
                showMoreSpan.onclick = () => RelatosApp.showMore(relato.id); // Corrigido para chamar RelatosApp.showMore
                descricaoElement.appendChild(showMoreSpan);
            }

            const cardElement = document.createElement('div');
            cardElement.classList.add('col-12', 'col-md-6', 'col-lg-4', 'mb-4');
            cardElement.innerHTML = `
                <div class="card">
                    <img src="${relato.imagemUrl}" class="card-img-top" alt="imagem do relato">
                    <div class="card-body">
                        <h5 class="card-title">${relato.nome}</h5>
                        <p class="card-text">${relato.localizacao}</p>
                        <div id="descricao-${relato.id}" class="card-text">${descricaoElement.innerHTML}</div>
                        <div class="like-section">
                            <span id="like-icon-${relato.id}" class="like-icon" onclick="RelatosApp.handleLike(${relato.id}, ${relato.liked}, ${relato.likes})">
                                <i class="fas fa-thumbs-up" style="color: ${relato.liked ? '#0E3B41' : '#6c757d'};"></i>
                            </span>
                            <span id="likes-${relato.id}">${relato.likes}</span>
                        </div>
                    </div>
                </div>`;

            DivRelatos.appendChild(cardElement);
        });
    }

    function showMore(id) {
        const relato = db.find(r => r.id === id);
        const descricaoElement = document.getElementById(`descricao-${id}`);

        if (descricaoElement) {
            descricaoElement.innerHTML = relato.descricao + ` <span class="show-more" onclick="RelatosApp.showLess(${id})">Ver menos</span>`;
        }
    }

    function showLess(id) {
        const relato = db.find(r => r.id === id);
        const descricaoElement = document.getElementById(`descricao-${id}`);

        if (descricaoElement) {
            descricaoElement.innerHTML = relato.descricao.substring(0, 100) + `... <span class="show-more" onclick="RelatosApp.showMore(${id})">Ver mais</span>`;
        }
    }

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

    function init() {
        readRelato(null, ListaRelatos);
        contarAnimaisencontrados();
        updateCadastroButton();

        const menuIcon = document.querySelector(".mobile-menu-icon button");
        const menu = document.querySelector(".menu");
        menuIcon.addEventListener("click", function () {
            menu.classList.toggle("active");
        });
    }

    document.addEventListener("DOMContentLoaded", function () {
        init();
        updateCadastroButton();

        document.getElementById('Anunciar').addEventListener('click', verificarLogin);
        document.getElementById('Cadastrar').addEventListener('click', verificarLogin);
        document.querySelector('.butao-perdi a').addEventListener('click', verificarLogin);
        document.querySelector('.butao-achei a').addEventListener('click', verificarLogin);
        document.querySelector('.criar-relato a').addEventListener('click', verificarLogin);
        document.querySelector('.criar-relato:nth-child(2) a').addEventListener('click', verificarLogin);

        // Delegação de eventos para os botões Ver mais e Ver menos
        document.getElementById("relatos-container").addEventListener('click', function(event) {
            const target = event.target;
            if (target.classList.contains('show-more')) {
                const relatoId = parseInt(target.dataset.relatoId); // Converte para inteiro
                showMore(relatoId);
            } else if (target.classList.contains('show-less')) {
                const relatoId = parseInt(target.dataset.relatoId); // Converte para inteiro
                showLess(relatoId);
            }
        });
    });

    return {
        handleLike,
        showMore,
        showLess
    };
})();

function verificarLogin(event) {
    const user = sessionStorage.getItem('userName') || localStorage.getItem('userName');
    if (!user) {
        event.preventDefault();
        window.location.href = '../html/cadastro_usuario.html';
    }
}
