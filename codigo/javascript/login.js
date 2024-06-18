async function login() {
  const senha = document.getElementById('senha-login').value;
  const email = document.getElementById('email-login').value;

  try {
    const res = await fetch("https://c75b6410-fffa-4b73-b82c-d1c21ec77f4a-00-3360t4cd2jp1v.picard.replit.dev/users", {
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
      localStorage.setItem('email', email);
      window.location.href = "../html/home.html";
    } else {
      window.alert("Senha incorreta");
      return;
    }
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    window.alert("Ocorreu um erro ao fazer login. Por favor, tente novamente mais tarde.");
  }
}