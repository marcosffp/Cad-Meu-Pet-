//função do navbar mobile
document.addEventListener("DOMContentLoaded", function () {
    const menuIcon = document.querySelector(".mobile-menu-icon button");
    const menu = document.querySelector(".menu");
  
    menuIcon.addEventListener("click", function () {
        menu.classList.toggle("active");
    });
  
    init();
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
  init(); // Função init() a ser definida conforme necessidade

  // Atualizar botão de cadastro ao carregar a página
  updateCadastroButton();

  // Verificar login ao clicar nos links importantes
  document.getElementById('Anunciar').addEventListener('click', verificarLogin);
  document.getElementById('Cadastrar').addEventListener('click', verificarLogin);
  document.querySelector('.butao-perdi a').addEventListener('click', verificarLogin);
  document.querySelector('.butao-achei a').addEventListener('click', verificarLogin);
  document.querySelector('.criar-relato a').addEventListener('click', verificarLogin);
  document.querySelector('.criar-relato:nth-child(2) a').addEventListener('click', verificarLogin);
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
      btnCadastrar.href = '#';
  } else {
      btnCadastrar.textContent = 'Cadastrar';
      btnCadastrar.href = '../html/cadastro_usuario.html';
  }
}

