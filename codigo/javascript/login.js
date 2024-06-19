async function login() {
  const senha = document.getElementById('senha-login').value;
  const email = document.getElementById('email-login').value;

  try {
    const res = await fetch("https://bc8bb33f-6175-4214-998c-292c322364a2-00-2ddr60lv3tm7s.worf.replit.dev/users", {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    if (!res.ok) {
      throw new Error('Erro ao buscar usuários');
    }

    const users = await res.json();
    const usuario = users.find((user) => user.email === email);

    if (!usuario) {
      window.alert("Usuário não encontrado");
      return;
    }

    if (usuario.senha === senha) {
      // Verifica se há dados no localStorage
      const storedUserId = localStorage.getItem('userId');
      if (storedUserId && storedUserId !== usuario.id) {
        // Se já houver dados e o ID for diferente, substitui os dados
        localStorage.setItem('userId', usuario.id);
        localStorage.setItem('userName', usuario.nome);
        localStorage.setItem('userEmail', usuario.email);
        window.location.href = "../html/home.html";
      } else {
        // Se não houver dados ou o ID for o mesmo, apenas armazena os dados
        localStorage.setItem('userId', usuario.id);
        localStorage.setItem('userName', usuario.nome);
        localStorage.setItem('userEmail', usuario.email);
        window.location.href = "../html/home.html";
      }
    } else {
      window.alert("Senha incorreta");
      return;
    }
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    window.alert("Ocorreu um erro ao fazer login. Por favor, tente novamente mais tarde.");
  }
}
