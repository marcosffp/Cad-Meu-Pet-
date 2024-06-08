const apiUrl = "https://bc8bb33f-6175-4214-998c-292c322364a2-00-2ddr60lv3tm7s.worf.replit.dev/animais_perdidos";

document.addEventListener("DOMContentLoaded", function () {
  const menuIcon = document.querySelector(".mobile-menu-icon button");
  const menu = document.querySelector(".menu");

  menuIcon.addEventListener("click", function () {
    menu.classList.toggle("active");
  });

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

    if (
      !status ||
      !especie ||
      !genero ||
      !nome ||
      !endereco ||
      !descricao ||
      !imagemUrl ||
      !contato
    ) {
      return alert("Por favor, preencha todos os campos");
    }

    try {
      // Fetch existing data to determine the next ID
      const response = await fetch(apiUrl);
      const data = await response.json();

      // Calculate the next ID as string
      const nextId = (
        data.length
          ? Math.max(...data.map((animal) => parseInt(animal.id))) + 1
          : 1
      ).toString();

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
      };

      // Save the data
      const postResponse = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(animal),
      });

      if (postResponse.ok) {
        console.log("Animal saved in db.json");
        // Dispatch custom event to notify other parts of the application
        document.dispatchEvent(
          new CustomEvent("animalAdded", { detail: animal })
        );
      } else {
        console.error("Failed to save animal in db.json");
      }

      document.getElementById("petForm").reset();
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao cadastrar o animal");
    }
  });
});
