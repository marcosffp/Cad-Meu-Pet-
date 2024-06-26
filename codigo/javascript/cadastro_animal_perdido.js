const apiUrl = '/animais_perdidos';
const usersApiUrl = '/users';

async function init() {
  document.addEventListener("DOMContentLoaded", async function () {
    const petForm = document.getElementById("form-relato");

    if (!petForm) {
      console.error("Elemento com ID 'form-relato' não encontrado.");
      return;
    }

    petForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const status = document.getElementById("status").value;
      const especie = document.getElementById("especie").value;
      const genero = document.getElementById("genero").value;
      const nome = document.getElementById("inputNome").value;
      const endereco = document.getElementById("inputEndereco").value;
      const descricao = document.getElementById("inputDescricao").value;
      const imagemUrl = document.getElementById("inputImagemUrl").value;
      const contato = document.getElementById("inputContato").value;

      if (!status || !especie || !genero || !nome || !endereco || !descricao || !imagemUrl || !contato) {
        return alert("Por favor, preencha todos os campos");
      }

      if (!validateContact(contato)) {
        return alert("Por favor, insira um email ou número de telefone válido");
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

          if (updateResponse.ok) {
            console.log("Usuário atualizado com o novo ID de animal perdido");
          } else {
            console.error("Falha ao atualizar o usuário com o novo ID de animal perdido");
          }

          window.alert("Animal cadastrado com sucesso!");
          window.location.href = "../html/desaparecidos_localizados.html";

          document.dispatchEvent(new CustomEvent("animalAdded", { detail: animal }));
        } else {
          console.error("Falha ao salvar o animal no banco de dados");
        }

        petForm.reset();
      } catch (error) {
        console.error("Erro:", error);
        alert("Erro ao cadastrar o animal");
      }
    });

    const menuIcon = document.querySelector(".mobile-menu-icon button");
    const menu = document.querySelector(".menu");

    menuIcon.addEventListener("click", function () {
      menu.classList.toggle("active");
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

    addEditAndDeleteButtons();
  });
}

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

function validateContact(contact) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;

  return emailRegex.test(contact) || phoneRegex.test(contact);
}

function addEditAndDeleteButtons() {
  const userId = localStorage.getItem('userId');
  if (!userId) {
    return;
  }

  const cards = document.querySelectorAll(".card");
  cards.forEach(card => {
    const cardUserId = card.getAttribute('data-user-id');
    if (cardUserId === userId) {
      const editButton = document.createElement("button");
      editButton.textContent = "Editar";
      editButton.classList.add("edit-button");

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Excluir";
      deleteButton.classList.add("delete-button");

      card.appendChild(editButton);
      card.appendChild(deleteButton);
    }
  });
}

init();
