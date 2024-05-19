document.getElementById("submit").addEventListener("click", (event) => {
  event.preventDefault();

  const status = document.getElementById("status").value;
  const especie = document.getElementById("especie").value;
  const genero = document.getElementById("genero").value;
  const nome = document.getElementById("nome").value;
  const endereco = document.getElementById("endereco").value;
  const descricao = document.getElementById("descricao").value;

  if (!status || !especie || !genero || !nome || !endereco || !descricao)
    return alert("Por favor, preencha todos os campos");

  const data = localStorage.getItem("pets") || "[]";

  const pets = JSON.parse(data);

  const pet = pets.find((pet) => pet.nome === nome);

  if (pet) return alert("Pet já existe");

  pets.push({
    status: status,
    especie: especie,
    genero: genero,
    nome: nome,
    endereco: endereco,
    descricao: descricao,
  });

  localStorage.setItem("pets", JSON.stringify(pets));

  alert("Pet cadastrado com sucesso!");

  status.value = "";
  especie.value = "";
  genero.value = "";
  nome.value = "";
  endereco.value = "";
  descricao.value = "";
});
