const apiUrl = "https://bc8bb33f-6175-4214-998c-292c322364a2-00-2ddr60lv3tm7s.worf.replit.dev/animais_perdidos";
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
      
        const deleteButton = document.createElement("button");
        deleteButton.setAttribute("type", "button");
        deleteButton.classList.add("btn", "btn-danger", "mx-2");
        deleteButton.textContent = "Excluir";
        deleteButton.addEventListener("click", function () {
          if (confirm("Tem certeza que deseja excluir este animal perdido?")) {
            deletePet(pet.id, loadAndDisplayPets);
          }
        });
      
        const editDeleteContainer = document.createElement("div");
        editDeleteContainer.classList.add("edit-delete-container");
        editDeleteContainer.appendChild(editButton);
        editDeleteContainer.appendChild(deleteButton);
      
        box.appendChild(h3);
        box.appendChild(species);
        box.appendChild(address);
        box.appendChild(description);
        box.appendChild(contacts);
        box.appendChild(status);
        box.appendChild(editDeleteContainer); // Adicionando o container com os botões
      
        content.appendChild(petImage);
        content.appendChild(box);
      
        resultsSection.appendChild(content);
      });

    })
    .catch((error) => console.error("Erro ao carregar os dados:", error));
}

document.getElementById("btnFiltrar").addEventListener("click", () => {
  const selectedStatus = document.querySelector(
    'input[name="status"]:checked'
  )?.value;
  const selectedTipo = document.querySelector(
    'input[name="tipo"]:checked'
  )?.value;
  loadAndDisplayPets(selectedStatus, selectedTipo);
});

document.getElementById("btnResetar").addEventListener("click", () => {
  document
    .querySelectorAll('input[name="status"]')
    .forEach((input) => (input.checked = false));
  document
    .querySelectorAll('input[name="tipo"]')
    .forEach((input) => (input.checked = false));
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

  updatePet(id, relato, loadAndDisplayPets);
});

function updatePet(id, pet, refreshFunction) {
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
      if (refreshFunction) {
        refreshFunction();
      }
      $('#editModal').modal('hide');  // Fechar o modal após salvar as alterações
    })
    .catch(error => {
      console.error('Erro ao atualizar Anúncio via API JSONServer:', error);
      displayMessage("Erro ao atualizar Anúncio");
    });
}

function displayMessage(message) {
  // Implemente sua lógica para exibir mensagens para o usuário, como um alerta ou uma área dedicada na página.
  console.log(message);
}
