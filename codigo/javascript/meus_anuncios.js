const apiUrl = "/animais_perdidos";
const usersApiUrl = "/users";

document.addEventListener("DOMContentLoaded", function () {
  const menuIcon = document.querySelector(".mobile-menu-icon button");
  const menu = document.querySelector(".menu");

  if (menuIcon && menu) {
    menuIcon.addEventListener("click", function () {
      menu.classList.toggle("active");
    });
  }

  loadAndDisplayPets();
  updateCadastroButton();

  // Verificações e adições de event listeners
  const anunciarButton = document.getElementById('Anunciar');
  const cadastrarButton = document.getElementById('Cadastrar');
  const buttonsPerdi = document.querySelectorAll('.butao-perdi a');
  const buttonsAchei = document.querySelectorAll('.butao-achei a');
  const buttonsRelato = document.querySelectorAll('.criar-relato a');

  if (anunciarButton) {
    anunciarButton.addEventListener('click', verificarLogin);
  }
  if (cadastrarButton) {
    cadastrarButton.addEventListener('click', verificarLogin);
  }
  if (buttonsPerdi) {
    buttonsPerdi.forEach(button => button.addEventListener('click', verificarLogin));
  }
  if (buttonsAchei) {
    buttonsAchei.forEach(button => button.addEventListener('click', verificarLogin));
  }
  if (buttonsRelato) {
    buttonsRelato.forEach(button => button.addEventListener('click', verificarLogin));
  }

  // Event listener para filtro
  const btnFiltrar = document.getElementById("btnFiltrar");
  if (btnFiltrar) {
    btnFiltrar.addEventListener("click", () => {
      const selectedStatus = document.querySelector('input[name="status"]:checked')?.value;
      const selectedTipo = document.querySelector('input[name="tipo"]:checked')?.value;
      const localizacao = document.getElementById('inputLocalizacao').value;
      loadAndDisplayPets(selectedStatus, selectedTipo, localizacao);
    });
  }

  // Event listener para resetar filtros
  const btnResetar = document.getElementById("btnResetar");
  if (btnResetar) {
    btnResetar.addEventListener("click", () => {
      document.querySelectorAll('input[name="status"]').forEach((input) => (input.checked = false));
      document.querySelectorAll('input[name="tipo"]').forEach((input) => (input.checked = false));
      loadAndDisplayPets();
    });
  }

  // Event listener para formulário de edição
  const editForm = document.getElementById("editForm");
  if (editForm) {
    editForm.addEventListener("submit", function (event) {
      event.preventDefault();
      const id = document.getElementById("editId").value;
      const relato = {
        status: document.getElementById("status").value,
        especie: document.getElementById("especie").value,
        genero: document.getElementById("genero").value,
        nome: document.getElementById("nome").value,
        endereco: document.getElementById("endereco").value,
        contatos: document.getElementById("contatos").value,
        descricao: document.getElementById("descricao").value,
        imagemUrl: document.getElementById("imagemUrl").value
      };
      updatePet(id, relato);
    });
  }
});

// Função para carregar e exibir pets
async function loadAndDisplayPets(filterStatus = null, filterTipo = null, filterLocalizacao = null) {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    const resultsSection = document.getElementById("results");
    const userId = parseInt(localStorage.getItem('userId'));

    // Filtra os pets conforme os filtros fornecidos
    let filteredPets = data;
    if (filterStatus) {
      filteredPets = filteredPets.filter(pet => pet.status === filterStatus);
    }
    if (filterTipo) {
      filteredPets = filteredPets.filter(pet => pet.especie === filterTipo);
    }
    if (filterLocalizacao) {
      filteredPets = filteredPets.filter(pet => pet.endereco.includes(filterLocalizacao));
    }

    resultsSection.innerHTML = "";  // Limpa os resultados anteriores

    filteredPets.forEach((pet) => {
      if (pet.userId === userId) {  // Verifica se o pet pertence ao usuário logado
        const content = document.createElement("div");
        content.classList.add("pet-card");
        content.setAttribute("data-id", pet.id);

        const petImage = document.createElement("img");
        petImage.src = pet.imagemUrl;
        petImage.alt = `Imagem de ${pet.nome}`;

        const box = document.createElement("div");
        box.classList.add("pet-info");

        const h3 = document.createElement("h3");
        h3.textContent = pet.nome;

        const species = document.createElement("strong");
        species.textContent = pet.especie;

        const description = document.createElement("p");
        description.textContent = pet.descricao;

        const address = document.createElement("p");
        address.textContent = pet.endereco;

        const status = document.createElement("strong");
        status.classList.add("status");
        status.textContent = pet.status;

        const contacts = document.createElement("strong");
        contacts.textContent = "Contatos: " + pet.contatos;

        box.appendChild(h3);
        box.appendChild(species);
        box.appendChild(address);
        box.appendChild(description);
        box.appendChild(contacts);
        box.appendChild(status);

        const editDeleteContainer = document.createElement("div");
        editDeleteContainer.classList.add("edit-delete-container");

        const editButton = document.createElement("button");
        editButton.setAttribute("type", "button");
        editButton.classList.add("btn", "btn-custom-green");
        editButton.setAttribute("data-bs-toggle", "modal");
        editButton.setAttribute("data-bs-target", "#editModal");
        editButton.textContent = "Editar";
        editButton.addEventListener("click", function () {
          document.getElementById("editId").value = pet.id;
          document.getElementById("status").value = pet.status;
          document.getElementById("especie").value = pet.especie;
          document.getElementById("genero").value = pet.genero;
          document.getElementById("nome").value = pet.nome;
          document.getElementById("endereco").value = pet.endereco;
          document.getElementById("contatos").value = pet.contatos;
          document.getElementById("descricao").value = pet.descricao;
          document.getElementById("imagemUrl").value = pet.imagemUrl;
        });
        editDeleteContainer.appendChild(editButton);

        const deleteButton = document.createElement("button");
        deleteButton.setAttribute("type", "button");
        deleteButton.classList.add("btn", "btn-danger", "mx-2");
        deleteButton.textContent = "Excluir";
        deleteButton.addEventListener("click", function () {
          if (confirm("Tem certeza que deseja excluir este animal perdido?")) {
            deletePet(pet.id, loadAndDisplayPets);
          }
        });
        editDeleteContainer.appendChild(deleteButton);
        box.appendChild(editDeleteContainer);

        content.appendChild(petImage);
        content.appendChild(box);
        resultsSection.appendChild(content);
      }
    });
  } catch (error) {
    console.error("Erro ao carregar e exibir os pets:", error);
  }
}

// Função para atualizar informações do pet
async function updatePet(id, pet) {
  try {
    const response = await fetch(`${apiUrl}/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(pet),
    });
    const data = await response.json();
    console.log("Anúncio alterado com sucesso:", data);
    displayMessage("Anúncio alterado com sucesso");
    updatePetCard(id, pet);
  } catch (error) {
    console.error('Erro ao atualizar Anúncio via API JSONServer:', error);
    displayMessage("Erro ao atualizar Anúncio");
  }
}

// Função para excluir um pet
async function deletePet(id, refreshFunction) {
  try {
    const response = await fetch(`${apiUrl}/${id}`, {
      method: 'DELETE',
    });
    const data = await response.json();
    console.log("Anúncio removido com sucesso:", data);
    displayMessage("Anúncio removido com sucesso");

    const usersResponse = await fetch(usersApiUrl);
    const usersData = await usersResponse.json();
    usersData.forEach(async (user) => {
      const index = user.animais_perdidos.indexOf(id);
      if (index !== -1) {
        user.animais_perdidos.splice(index, 1);
        try {
          const updateUserResponse = await fetch(`${usersApiUrl}/${user.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
          });
          const updateUserData = await updateUserResponse.json();
          console.log(`ID ${id} removido da lista animais_perdidos do usuário ${user.id}`);
        } catch (error) {
          console.error(`Erro ao atualizar usuário ${user.id} na API:`, error);
        }
      }
    });

    if (refreshFunction) refreshFunction();
  } catch (error) {
    console.error('Erro ao remover Anúncio via API JSONServer:', error);
  }
}

// Função para verificar o login antes de permitir ação
async function verificarLogin(event) {
  const user = sessionStorage.getItem('userName') || localStorage.getItem('userName');
  if (!user) {
    event.preventDefault();
    window.location.href = '../html/cadastro_usuario.html';
  }
}

// Função para atualizar o texto e link do botão de cadastro
function updateCadastroButton() {
  const btnCadastrar = document.getElementById('btn-cadastrar');
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

// Função para exibir mensagens no console
function displayMessage(message) {
  console.log(message);
}

// Função de inicialização
function init() {
  // Não implementado neste exemplo
}

// Função para atualizar o card do pet após edição
function updatePetCard(id, updatedPet) {
  const card = document.querySelector(`.pet-card[data-id="${id}"]`);
  if (card) {
    card.querySelector('img').src = updatedPet.imagemUrl;
    card.querySelector('h3').textContent = updatedPet.nome;
    card.querySelector('.pet-info strong').textContent = updatedPet.especie;
    card.querySelector('.pet-info p:nth-child(3)').textContent = updatedPet.endereco;
    card.querySelector('.pet-info p:nth-child(4)').textContent = updatedPet.descricao;
    card.querySelector('.pet-info strong:nth-child(5)').textContent = "Contatos: " + updatedPet.contatos;
    card.querySelector('.status').textContent = updatedPet.status;
  }
}
