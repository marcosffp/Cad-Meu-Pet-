document.addEventListener("DOMContentLoaded", function () {
  const apiUrl = "https://bc8bb33f-6175-4214-998c-292c322364a2-00-2ddr60lv3tm7s.worf.replit.dev/animais_perdidos";
  const usersApiUrl = "https://bc8bb33f-6175-4214-998c-292c322364a2-00-2ddr60lv3tm7s.worf.replit.dev/users";

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

    if (!status || !especie || !genero || !nome || !endereco || !descricao || !imagemUrl || !contato) {
      return alert("Por favor, preencha todos os campos");
    }

    try {
      // Fetch existing data to determine the next ID
      const response = await fetch(apiUrl);
      const data = await response.json();

      // Calculate the next ID as a number
      const nextId = data.length ? Math.max(...data.map((animal) => animal.id)) + 1 : 1;

      // Obter o ID do usuário logado
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
        userId: parseInt(userId) // Adiciona o ID do usuário logado ao objeto do animal perdido e o trata como número
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
        // Exibir alerta de sucesso
        window.alert("Animal cadastrado com sucesso!");

        // Redirecionar para a página desaparecidos_localizados.html
        window.location.href = "../html/desaparecidos_localizados.html";

        // Atualizar o usuário logado para incluir o ID do novo anúncio na lista de animais_perdidos
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
          console.log("User updated with new animal ID");
        } else {
          console.error("Failed to update user with new animal ID");
        }

        // Dispatch custom event to notify other parts of the application
        document.dispatchEvent(new CustomEvent("animalAdded", { detail: animal }));
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
