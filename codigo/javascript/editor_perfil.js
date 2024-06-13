document.addEventListener("DOMContentLoaded", function () {
  const menuIcon = document.querySelector(".mobile-menu-icon button");
  const menu = document.querySelector(".menu");

  menuIcon.addEventListener("click", function () {
    menu.classList.toggle("active");
  });

  const formPerfil = document.getElementById("form-perfil");

  formPerfil.addEventListener('submit', function (event) {
    event.preventDefault(); // Evita o envio padrão do formulário

    // Obter os valores dos campos do formulário
    const id = document.getElementById('inputId').value;
    const nome = document.getElementById('inputNome').value;
    const email = document.getElementById('inputEmail').value;
    const senha = document.getElementById('inputSenha').value;

    // Criar um objeto com os dados do perfil do usuário
    const perfil = {
      id: id,
      nome: nome,
      email: email,
      senha: senha
    };

    // Chamar a função para atualizar o perfil do usuário
    atualizarPerfil(perfil);
  });
});

function atualizarPerfil(perfil) {
  const apiUrl = 'https://bc8bb33f-6175-4214-998c-292c322364a2-00-2ddr60lv3tm7s.worf.replit.dev/cadastros/' + perfil.id;

  fetch(apiUrl, {
    method: 'PUT', // Usar o método PUT para atualizar o perfil
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(perfil),
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Erro ao atualizar perfil');
    }
    return response.json();
  })
  .then(data => {
    alert('Perfil atualizado com sucesso!');
    reloadPage(); // Reload the page after successful update
  })
  .catch(error => {
    console.error('Erro ao atualizar perfil:', error);
    alert('Erro ao atualizar perfil. Por favor, tente novamente mais tarde.');
  });
}

function reloadPage() {
  location.reload();
}
