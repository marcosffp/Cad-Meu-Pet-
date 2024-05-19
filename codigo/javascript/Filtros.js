function loadJSON(callback) {
  const data = localStorage.getItem("pets") || "[]";

  return JSON.parse(data);
}


document.getElementById("btnFiltrar").addEventListener("click", () => {
  const resultsSection = document.getElementById("results");
  resultsSection.innerHTML = "";

  const selectedStatus = document.querySelector(
    'input[name="status"]:checked'
  )?.value.toLowerCase();
  const selectedTipo = document.querySelector(
    'input[name="tipo"]:checked'
  )?.value.toLowerCase();

  // 1 - Criar uma lista temporária
  let tempArray = [];

  const db = loadJSON();

  // 2 - Iterar sobre todos objetos
  db.forEach(function (pet) { 

    // 3 - Verificar se é do status 'Desaparecido'
    if (pet["status"].toLowerCase() === selectedStatus && pet["especie"].toLowerCase() === selectedTipo) {
        // 4 - Se for, adicionar a lista temporária
        tempArray.push(pet);
    }
  });

  console.log(tempArray);

  // 5 - Iterar sobre a lista temporária que contem os objetos de acordo a filtragem
  tempArray.forEach(function (pet) {

    const content = document.createElement("div");
    content.classList.add("pet-card");
  
    const petImage = document.createElement("img");
    petImage.src = pet["imagemdopet"];
  
    const box = document.createElement("div");
    box.classList.add("pet-info");
  
    const h3 = document.createElement("h3");
    const span = document.createElement("span");
    span.textContent = pet["nome"];
  
    const description = document.createElement("p");
    description.textContent = pet["descricao"]

    const address = document.createElement("p");
    address.textContent = pet["endereco"]

    const status = document.createElement("p");
    const strong = document.createElement("strong");
    strong.textContent = pet["especie"];
 
    content.append(petImage, box);
    h3.appendChild(span);
    status.appendChild(strong);
    box.append(h3, address, description, status);
    resultsSection.append(content);

  });

});