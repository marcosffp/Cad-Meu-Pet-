// Definir a função init() aqui, se necessário
function init() {
    // Implementação da função init(), se houver
}

document.addEventListener("DOMContentLoaded", function () {
    // Função para inicializar o menu mobile
    const menuIcon = document.querySelector(".mobile-menu-icon button");
    const menu = document.querySelector(".menu");

    menuIcon.addEventListener("click", function () {
        menu.classList.toggle("active");
    });

    // Chamar a função init() após o carregamento do DOM
    init();

    // Adicionar evento aos botões de toggle do FAQ
    const toggleButtons = document.querySelectorAll(".toggle-btn");

    toggleButtons.forEach(button => {
        button.addEventListener("click", function () {
            const contentId = this.getAttribute("data-toggle");
            const content = document.getElementById(contentId);

            if (content.style.display === "none" || content.style.display === "") {
                content.style.display = "block";
                this.textContent = "-";
            } else {
                content.style.display = "none";
                this.textContent = "+";
            }
        });
    });

    // Atualizar botão de cadastro ao carregar a página
    updateCadastroButton();

    // Verificar login ao clicar nos links importantes
    const anunciarLink = document.getElementById('Anunciar');
    const cadastrarLink = document.getElementById('Cadastrar');

    if (anunciarLink) {
        anunciarLink.addEventListener('click', verificarLogin);
    }

    if (cadastrarLink) {
        cadastrarLink.addEventListener('click', verificarLogin);
    }
});

async function verificarLogin(event) {
    const user = sessionStorage.getItem('userName') || localStorage.getItem('userName');

    if (!user) {
        event.preventDefault();
        window.location.href = '../html/cadastro_usuario.html';
    }
}

function updateCadastroButton() {
    const btnCadastrar = document.getElementById('Cadastrar').querySelector('a');
    const user = sessionStorage.getItem('userName') || localStorage.getItem('userName');

    if (btnCadastrar) {
        if (user) {
            btnCadastrar.textContent = 'Logado';
            btnCadastrar.href = '../html/editor_perfil.html';// Link de exemplo, você pode ajustar conforme necessário
        } else {
            btnCadastrar.textContent = 'Cadastrar';
            btnCadastrar.href = '../html/cadastro_usuario.html'; // Link de exemplo, você pode ajustar conforme necessário
        }
    }
}
