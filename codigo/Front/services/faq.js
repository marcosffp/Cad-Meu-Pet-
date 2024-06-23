function init() {

}

document.addEventListener("DOMContentLoaded", function () {

    const menuIcon = document.querySelector(".mobile-menu-icon button");
    const menu = document.querySelector(".menu");

    menuIcon.addEventListener("click", function () {
        menu.classList.toggle("active");
    });

    init();

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

    updateCadastroButton();

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
            btnCadastrar.href = '../html/editor_perfil.html';
        } else {
            btnCadastrar.textContent = 'Cadastrar';
            btnCadastrar.href = '../html/cadastro_usuario.html';
        }
    }
}
