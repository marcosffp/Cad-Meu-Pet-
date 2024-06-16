/* function cadastro() {
    nome = document.getElementById("nome-cadastro").value
    email = document.getElementById("email-cadastro").value
    senha = document.getElementById("senha-cadastro").value
    data = { nome, email, senha }
    if (localStorage.getItem(email)) {
        window.alert("email já cadastrado")
    }
    else {
        localStorage.setItem(email, JSON.stringify(data))
        window.alert("usuario cadastrado com sucesso")
    }
}
function login() {
    email = document.getElementById("email-login").value
    senha = document.getElementById("senha-login").value
    if (localStorage.getItem(email)) {
        data = JSON.parse(localStorage.getItem(email))
        if (data.senha == senha) {
            window.alert("usuario encontrado")
        }
        else {
            window.alert("senha errada")
        }
    }
    else {
        window.alert("email não encontrado")
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const menuIcon = document.querySelector(".mobile-menu-icon button");
    const menu = document.querySelector(".menu");

    menuIcon.addEventListener("click", function () {
        menu.classList.toggle("active");
    });

    init();
}); */

// Função de login
function login() {
    var email = document.getElementById('email-login').value;
    var senha = document.getElementById('senha-login').value;
  
    // Validação de email
    if (!validateEmail(email)) {
      alert('Por favor, insira um email válido.');
      return;
    }
  
    // Verificar se os campos estão preenchidos
    if (email === '' || senha === '') {
      alert('Por favor, preencha todos os campos.');
      return;
    }
  
    // Mock login para demonstração (substituir com lógica real)
    if (email === 'teste@exemplo.com' && senha === '123456') {
      alert('Login realizado com sucesso!');
      window.location.href = 'home.html';
    } else {
      alert('Email ou senha incorretos.');
    }
  }
  
  // Função para validar email
  function validateEmail(email) {
    var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }
  
  // Mostrar/Esconder menu mobile
  document.querySelector('.mobile-menu-icon button').addEventListener('click', () => {
    document.querySelector('.menu').classList.toggle('show');
  });
  