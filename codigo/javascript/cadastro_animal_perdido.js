// Definir a função init() aqui, se necessário
function init() {
  // Implementação da função init(), se houver
}

document.addEventListener("DOMContentLoaded", async function () {
const apiUrl = "https://bc8bb33f-6175-4214-998c-292c322364a2-00-2ddr60lv3tm7s.worf.replit.dev/animais_perdidos";
const usersApiUrl = "https://bc8bb33f-6175-4214-998c-292c322364a2-00-2ddr60lv3tm7s.worf.replit.dev/users";

document.getElementById("petForm").addEventListener("submit", async (event) => {
  event.preventDefault();

  const status = document.getElementById("status").value;
  const especie = document.getElementById("especie").value;
  const genero = document.getElementById("genero").value;
  const nome = document.getElementById("nome").value;
  const endereco = document.getElementById("endereco").value;
  const descricao = document.getElementById("descricao").value;
  const imagemUrl = document.getElementById("imagemUrl").value;
  const contato = document.getElementById("contatos").value;

  if (!status || !especie || !genero || !nome || !endereco || !descricao || !imagemUrl || !contato) {
    return alert("Por favor, preencha todos os campos");
  }

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    const nextId = data.length ? Math.max(...data.map((animal) => animal.id)) + 1 : 1;

    const userId = localStorage.getItem('userId');
    if (!userId) {
      return alert("Usuário não está logado");
    }

    const animal = {
      id: nextId,
      status: status,
      especie: especie,
      genero: genero,
      nome: nome,
      endereco: endereco,
      descricao: descricao,
      imagemUrl: imagemUrl,
      contatos: contato,
      userId: parseInt(userId)
    };

    const postResponse = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(animal),
    });

    if (postResponse.ok) {
      const userResponse = await fetch(`${usersApiUrl}/${userId}`);
      const userData = await userResponse.json();
      userData.animais_perdidos.push(nextId);

      const updateResponse = await fetch(`${usersApiUrl}/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      window.alert("Animal cadastrado com sucesso!");
      window.location.href = "../html/desaparecidos_localizados.html";

      if (updateResponse.ok) {
        console.log("Usuário atualizado com o novo ID de animal perdido");
      } else {
        console.error("Falha ao atualizar o usuário com o novo ID de animal perdido");
      }

      document.dispatchEvent(new CustomEvent("animalAdded", { detail: animal }));
    } else {
      console.error("Falha ao salvar o animal no banco de dados");
    }

    document.getElementById("petForm").reset();
  } catch (error) {
    console.error("Erro:", error);
    alert("Erro ao cadastrar o animal");
  }

});

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
