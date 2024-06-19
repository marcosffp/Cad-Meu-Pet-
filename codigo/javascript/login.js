async function login() {
  const senha = document.getElementById('senha-login').value;
  const email = document.getElementById('email-login').value;

  try {
      const res = await fetch("https://bc8bb33f-6175-4214-998c-292c322364a2-00-2ddr60lv3tm7s.worf.replit.dev/users", {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
          }
      });

      if (!res.ok) {
          throw new Error('Erro ao buscar usuários');
      }

      const users = await res.json();
      const usuario = users.find((user) => user.email === email);

      if (!usuario) {
          window.alert("Usuário não encontrado");
          return;
      }

      if (usuario.senha === senha) {
          // Armazena ou substitui os dados no localStorage
          localStorage.setItem('userId', usuario.id);
          localStorage.setItem('userName', usuario.nome);
          localStorage.setItem('userEmail', usuario.email);
          window.location.href = "../html/home.html";
      } else {
          window.alert("Senha incorreta");
      }
  } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      window.alert("Ocorreu um erro ao fazer login. Por favor, tente novamente mais tarde.");
  }
}

const menuIcon = document.querySelector(".mobile-menu-icon button");
const menu = document.querySelector(".menu");

menuIcon.addEventListener("click", function () {
    menu.classList.toggle("mobile-menu-visible");
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