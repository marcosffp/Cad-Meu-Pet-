// Definir a função init() aqui, se necessário
function init() {
  // Implementação da função init(), se houver
}

document.addEventListener("DOMContentLoaded", function () {
  const apiUrl = 'https://bc8bb33f-6175-4214-998c-292c322364a2-00-2ddr60lv3tm7s.worf.replit.dev/relatos';
  const usersApiUrl = 'https://bc8bb33f-6175-4214-998c-292c322364a2-00-2ddr60lv3tm7s.worf.replit.dev/users';

  const menuIcon = document.querySelector(".mobile-menu-icon button");
  const menu = document.querySelector(".menu");

  menuIcon.addEventListener("click", function () {
    menu.classList.toggle("active");
  });

  const formRelato = document.getElementById("form-relato");

  const btnInsert = document.getElementById("btnInsert");
  btnInsert.addEventListener('click', function () {
    if (!formRelato.checkValidity()) {
      displayMessage("Preencha o formulário corretamente.");
      return;
    }

    const campoNome = document.getElementById('inputNome').value;
    const campoData = document.getElementById('inputData').value;
    const campoLocalizacao = document.getElementById('inputLocalizacao').value;
    const campoDescricao = document.getElementById('inputDescricao').value;
    const campoImagemUrl = document.getElementById('inputImagemUrl').value;

    const relato = {
      nome: campoNome,
      data: campoData,
      localizacao: campoLocalizacao,
      descricao: campoDescricao,
      imagemUrl: campoImagemUrl
    };

    createRelato(relato);
    formRelato.reset();
  });

  const observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      if (mutation.addedNodes.length) {
        setTimeout(function () {
          const alert = msg.querySelector(".alert");
          if (alert) alert.remove();
        }, 5000);
      }
    });
  });

  const msg = document.getElementById('msg');
  observer.observe(msg, { childList: true });

  function displayMessage(mensagem) {
    msg.innerHTML = '<div class="alert alert-warning">' + mensagem + '</div>';
  }

  async function createRelato(relato) {
    relato.liked = relato.liked !== undefined ? relato.liked : false;
    relato.likes = relato.likes !== undefined ? relato.likes : 0;

    await fetch(apiUrl, {
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
        linkRelatoToUser(data.id);
        window.location.href = "../html/home.html";
      })
      .catch(error => {
        console.error('Erro ao inserir Relato via API JSONServer:', error);
        displayMessage("Erro ao inserir Relato");
      });
  }

  async function linkRelatoToUser(relatoId) {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.error('Usuário não está logado');
      return;
    }

    await fetch(`${usersApiUrl}/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Erro ao buscar usuário');
        }
        return response.json();
      })
      .then(async (user) => {
        user.relatos.push(relatoId);

        return await fetch(`${usersApiUrl}/${user.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(user)
        });
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Erro ao atualizar usuário');
        }
        console.log('Usuário atualizado com sucesso');
      })
      .catch(error => {
        console.error('Erro ao atualizar usuário:', error);
      });
  }

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
