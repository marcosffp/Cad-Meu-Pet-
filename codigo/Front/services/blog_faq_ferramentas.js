function init() {
}

document.addEventListener("DOMContentLoaded", function () {
  const menuIcon = document.querySelector(".mobile-menu-icon button");
  const menu = document.querySelector(".menu");

  menuIcon.addEventListener("click", function () {
    menu.classList.toggle("active");
  });

  init();
});

document.addEventListener("DOMContentLoaded", function () {
  init();


  updateCadastroButton();

  document.getElementById('Anunciar').addEventListener('click', verificarLogin);
  document.getElementById('Cadastrar').addEventListener('click', verificarLogin);
  document.getElementById('CriarAnuncioPet').addEventListener('click', verificarLogin);
});

async function verificarLogin(event) {
  const user = sessionStorage.getItem('userName') || localStorage.getItem('userName');
  if (!user) {
    event.preventDefault();
    window.location.href = '../html/cadastro_usuario.html';
  }
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
