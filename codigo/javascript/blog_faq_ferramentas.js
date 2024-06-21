// Definir a função init() aqui, se necessário
function init() {
  // Implementação da função init(), se houver
}

// Função do navbar mobile
document.addEventListener("DOMContentLoaded", function () {
  const menuIcon = document.querySelector(".mobile-menu-icon button");
  const menu = document.querySelector(".menu");

  menuIcon.addEventListener("click", function () {
      menu.classList.toggle("active");
  });

  // Inicializar outras funcionalidades JavaScript
  init(); // Chamando a função init() depois de definida
});

document.addEventListener("DOMContentLoaded", function () {
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
});

document.addEventListener("DOMContentLoaded", function () {
  // Inicializar outras funcionalidades JavaScript
  init(); // Chamando a função init() novamente se necessário

  // Atualizar botão de cadastro ao carregar a página
  updateCadastroButton();

  // Verificar login ao clicar nos links importantes
  document.getElementById('Anunciar').addEventListener('click', verificarLogin);
  document.getElementById('Cadastrar').addEventListener('click', verificarLogin);
});

async function verificarLogin(event) {
  const user = sessionStorage.getItem('userName') || localStorage.getItem('userName'); // Verifica em sessionStorage ou localStorage
  if (!user) {
      event.preventDefault(); // Prevenir o comportamento padrão de navegação
      window.location.href = '../html/cadastro_usuario.html'; // Redirecionar para a página de cadastro de usuário
  }
}

function updateCadastroButton() {
  const btnCadastrar = document.getElementById('btn-cadastrar');
  const user = sessionStorage.getItem('userName') || localStorage.getItem('userName'); // Verifica em sessionStorage ou localStorage
  if (user) {
      btnCadastrar.textContent = 'Logado';
      btnCadastrar.href = '../html/editor_perfil.html';
  } else {
      btnCadastrar.textContent = 'Cadastrar';
      btnCadastrar.href = '../html/cadastro_usuario.html';
  }
}
