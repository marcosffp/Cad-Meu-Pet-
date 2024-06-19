const apiUrl = "https://bc8bb33f-6175-4214-998c-292c322364a2-00-2ddr60lv3tm7s.worf.replit.dev/animais_perdidos";
const usersApiUrl = "https://bc8bb33f-6175-4214-998c-292c322364a2-00-2ddr60lv3tm7s.worf.replit.dev/users";

document.addEventListener("DOMContentLoaded", function () {
  const menuIcon = document.querySelector(".mobile-menu-icon button");
  const menu = document.querySelector(".menu");

  menuIcon.addEventListener("click", function () {
    menu.classList.toggle("active");
  });

  loadAndDisplayPets();
});

function loadAndDisplayPets(filterStatus = null, filterTipo = null) {
  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      const resultsSection = document.getElementById("results");
      resultsSection.innerHTML = "";

      const filteredPets = data.filter(
        (pet) =>
          (!filterStatus || pet.status.toLowerCase() === filterStatus.toLowerCase()) &&
          (!filterTipo || pet.especie.toLowerCase() === filterTipo.toLowerCase())
      );

      const userId = parseInt(localStorage.getItem('userId'));

      filteredPets.forEach((pet) => {
        const content = document.createElement("div");
        content.classList.add("pet-card");
      
        const petImage = document.createElement("img");
        petImage.src = pet.imagemUrl;
        petImage.alt = `Imagem de ${pet.nome}`; // Alt para acessibilidade
      
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

        if (pet.userId === userId) {
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

          box.appendChild(editDeleteContainer); // Adicionando o container com os botões
        }
      
        content.appendChild(petImage);
        content.appendChild(box);
      
        resultsSection.appendChild(content);
      });
    })
    .catch((error) => console.error("Erro ao carregar os dados:", error));
}

document.getElementById("btnFiltrar").addEventListener("click", () => {
  const selectedStatus = document.querySelector('input[name="status"]:checked')?.value;
  const selectedTipo = document.querySelector('input[name="tipo"]:checked')?.value;
  loadAndDisplayPets(selectedStatus, selectedTipo);
});

document.getElementById("btnResetar").addEventListener("click", () => {
  document.querySelectorAll('input[name="status"]').forEach((input) => (input.checked = false));
  document.querySelectorAll('input[name="tipo"]').forEach((input) => (input.checked = false));
  loadAndDisplayPets();
});

document.getElementById("editForm").addEventListener("submit", function (event) {
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

function updatePet(id, pet) {
  fetch(`${apiUrl}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(pet),
  })
    .then(response => response.json())
    .then(data => {
      console.log("Anúncio alterado com sucesso:", data);
      displayMessage("Anúncio alterado com sucesso");

      // Atualizar o anúncio na lista de animais perdidos na interface
      const petCard = document.querySelector(`.pet-card[data-pet-id="${id}"]`);
      if (petCard) {
        const petInfo = petCard.querySelector(".pet-info");
        petInfo.querySelector("strong.status").textContent = pet.status;
        petInfo.querySelector("strong.species").textContent = pet.especie;
        petInfo.querySelector("p.description").textContent = pet.descricao;
        petInfo.querySelector("p.address").textContent = pet.endereco;
        petInfo.querySelector("strong.contacts").textContent = "Contatos: " + pet.contatos;

        // Atualizar os dados na lista de animais perdidos
        const foundPet = animaisPerdidos.find(item => item.id === id);
        if (foundPet) {
          foundPet.status = pet.status;
          foundPet.especie = pet.especie;
          foundPet.descricao = pet.descricao;
          foundPet.endereco = pet.endereco;
          foundPet.contatos = pet.contatos;
        }
      }

      // Fechar o modal após salvar as alterações
      $('#editModal').modal('hide');

      // Limpar os campos do formulário de edição
      document.getElementById("editForm").reset();
    })
    .catch(error => {
      console.error('Erro ao atualizar Anúncio via API JSONServer:', error);
      displayMessage("Erro ao atualizar Anúncio");
    });
}


function deletePet(id, refreshFunction) {
  fetch(`${apiUrl}/${id}`, {
    method: 'DELETE',
  })
    .then(response => response.json())
    .then(data => {
      console.log("Anúncio removido com sucesso:", data);
      displayMessage("Anúncio removido com sucesso");

      // Remover o ID do animal perdido da lista animais_perdidos no usuário correspondente
      fetch(usersApiUrl)
        .then(response => response.json())
        .then(usersData => {
          usersData.forEach(user => {
            const index = user.animais_perdidos.indexOf(id);
            if (index !== -1) {
              user.animais_perdidos.splice(index, 1); // Remove o ID da lista animais_perdidos
              // Atualiza o usuário na API
              fetch(`${usersApiUrl}/${user.id}`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(user),
              })
                .then(response => response.json())
                .then(data => {
                  console.log(`ID ${id} removido da lista animais_perdidos do usuário ${user.id}`);
                })
                .catch(error => {
                  console.error(`Erro ao atualizar usuário ${user.id} na API:`, error);
                });
            }
          });
        })
        .catch(error => {
          console.error('Erro ao carregar dados de usuários:', error);
        });

      if (refreshFunction) refreshFunction();
    })
    .catch(error => {
      console.error('Erro ao remover Anúncio via API JSONServer:', error);
      displayMessage("Erro ao remover Anúncio");
    });
}


function displayMessage(message) {
  // Implemente sua lógica para exibir mensagens para o usuário, como um alerta ou uma área dedicada na página.
  console.log(message);
}


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