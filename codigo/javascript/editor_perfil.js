document.addEventListener("DOMContentLoaded", function () {
    const apiUrl = 'https://bc8bb33f-6175-4214-998c-292c322364a2-00-2ddr60lv3tm7s.worf.replit.dev/users';
    const checkEmailUrl = 'https://bc8bb33f-6175-4214-998c-292c322364a2-00-2ddr60lv3tm7s.worf.replit.dev/check-email';
    const formPerfil = document.getElementById("form-perfil");

    function displayMessage(mensagem) {
        window.alert(mensagem);
    }

    function validateName(name) {
        const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s']+$/;
        return nameRegex.test(name);
    }

    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function validatePassword(password) {
        const passwordValidation = {
            minLength: password.length >= 6,
            hasNumber: /\d/.test(password),
            hasSymbol: /[!@#$%^&*(),.?":{}|<>]/.test(password),
            hasUppercase: /[A-Z]/.test(password),
            hasLowercase: /[a-z]/.test(password)
        };

        return passwordValidation;
    }

    async function fetchUserByEmail(email) {
        try {
            const response = await fetch(`${checkEmailUrl}?email=${email}`);
            if (!response.ok) {
                throw new Error('Erro ao buscar usuário pelo email');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Erro ao buscar usuário pelo email:', error);
            displayMessage('Erro ao buscar usuário pelo email');
        }
    }

    async function atualizarPerfil(perfil) {
        if (!validatePassword(perfil.senha).minLength) {
            alert('A senha deve ter pelo menos 6 caracteres.');
            return;
        }

        const updateUrl = `${apiUrl}/${perfil.id}`;

        try {
            const response = await fetch(updateUrl, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(perfil),
            });
            if (!response.ok) {
                throw new Error('Erro ao atualizar perfil');
            }
            const data = await response.json();
            // Atualizar os dados no LocalStorage
            localStorage.setItem('userName', perfil.nome);
            localStorage.setItem('userEmail', perfil.email);

            alert('Perfil atualizado com sucesso!');
            reloadPage();
        } catch (error) {
            console.error('Erro ao atualizar perfil:', error);
            alert('Erro ao atualizar perfil. Por favor, tente novamente mais tarde.');
        }
    }

    function reloadPage() {
        location.reload();
    }

    formPerfil.addEventListener('submit', async function (event) {
        event.preventDefault();

        const nome = document.getElementById('inputNome').value;
        const email = document.getElementById('inputEmail').value;
        let senha = document.getElementById('inputSenha').value;

        if (!senha) {
            senha = localStorage.getItem('userSenha') || '';
        }

        const perfil = {
            id: localStorage.getItem('userId'),
            nome: nome,
            email: email,
            senha: senha
        };

        atualizarPerfil(perfil);
    });

    function checkLoggedInUser() {
        const userName = localStorage.getItem('userName');
        const userEmail = localStorage.getItem('userEmail');
        if (userName && userEmail) {

            document.getElementById('inputNome').value = userName;
            document.getElementById('inputEmail').value = userEmail;
        } else {

            window.location.href = '../html/cadastro_usuario.html';
        }
    }


    checkLoggedInUser();

    const togglePassword = document.createElement('button');
    togglePassword.innerHTML = '<i class="fa fa-eye"></i>';
    togglePassword.classList.add('btn', 'btn-light', 'input-group-text', 'toggle-password');
    const passwordField = document.getElementById('inputSenha');
    const passwordValidation = document.getElementById('passwordValidation');

    passwordField.insertAdjacentElement('afterend', togglePassword);

    togglePassword.addEventListener('click', function () {
        const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordField.setAttribute('type', type);
        this.querySelector('i').classList.toggle('fa-eye-slash');
    });

    passwordField.addEventListener('input', function () {
        const senha = passwordField.value;
        const validation = validatePassword(senha);

        let validationMessage = "";
        if (!validation.minLength) {
            validationMessage += "<span style='color:red'>A senha deve ter pelo menos 6 caracteres.</span><br>";
        } else {
            validationMessage += "<span style='color:green'>A senha tem pelo menos 6 caracteres.</span><br>";
        }
        if (!validation.hasNumber) {
            validationMessage += "<span style='color:red'>A senha deve conter pelo menos um número.</span><br>";
        } else {
            validationMessage += "<span style='color:green'>A senha contém pelo menos um número.</span><br>";
        }
        if (!validation.hasSymbol) {
            validationMessage += "<span style='color:red'>A senha deve conter pelo menos um símbolo.</span><br>";
        } else {
            validationMessage += "<span style='color:green'>A senha contém pelo menos um símbolo.</span><br>";
        }
        if (!validation.hasUppercase) {
            validationMessage += "<span style='color:red'>A senha deve conter pelo menos uma letra maiúscula.</span><br>";
        } else {
            validationMessage += "<span style='color:green'>A senha contém pelo menos uma letra maiúscula.</span><br>";
        }
        if (!validation.hasLowercase) {
            validationMessage += "<span style='color:red'>A senha deve conter pelo menos uma letra minúscula.</span><br>";
        } else {
            validationMessage += "<span style='color:green'>A senha contém pelo menos uma letra minúscula.</span><br>";
        }

        passwordValidation.innerHTML = validationMessage;
    });

    const menuIcon = document.querySelector(".mobile-menu-icon button");
    const menu = document.querySelector(".menu");

    menuIcon.addEventListener("click", function () {
        menu.classList.toggle("active");
    });

    updateCadastroButton();
});

function updateCadastroButton() {
    const btnCadastrar = document.getElementById('btn-cadastrar');
    const user = sessionStorage.getItem('userName') || localStorage.getItem('userName');
    if (user) {
        btnCadastrar.textContent = 'Logado';
        btnCadastrar.href = '../html/editor_perfil.html';
    } else {
        btnCadastrar.textContent = 'Cadastrar';
        btnCadastrar.href = '../html/cadastro_usuario.html';
    }
}


function logout() {
    const confirmLogout = confirm('Tem certeza que deseja sair da conta?');
    if (confirmLogout) {

        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userId');
        localStorage.removeItem('userSenha');

        window.location.href = '../html/cadastro_usuario.html';
    }
}
const btnLogout = document.getElementById("btnLogout");
btnLogout.addEventListener('click', function () {
    logout();
});
