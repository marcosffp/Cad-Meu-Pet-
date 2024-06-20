document.addEventListener("DOMContentLoaded", function () {
    const apiUrl = 'https://bc8bb33f-6175-4214-998c-292c322364a2-00-2ddr60lv3tm7s.worf.replit.dev/users'; // Atualize a URL se necessário
    const menuIcon = document.querySelector(".mobile-menu-icon button");
    const menu = document.querySelector(".menu");

    menuIcon.addEventListener("click", function () {
        menu.classList.toggle("mobile-menu-visible");
    });

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

    const formCadastro = document.getElementById("form-perfil");

    const usuarioEmail = localStorage.getItem('userEmail');
    if (usuarioEmail) {
        document.getElementById('inputEmail').value = usuarioEmail;
        fetch(`${apiUrl}?email=${usuarioEmail}`)
            .then(res => res.json())
            .then(users => {
                const user = users.find(user => user.email === usuarioEmail);
                if (user) {
                    document.getElementById('inputNome').value = user.nome;
                    document.getElementById('inputSenha').value = user.senha;
                    localStorage.setItem('usuarioLogado', JSON.stringify(user));
                }
            })
            .catch(error => {
                console.error('Erro ao buscar usuário:', error);
            });
    }

    formCadastro.addEventListener('submit', function (event) {
        event.preventDefault();

        const nome = document.getElementById('inputNome').value;
        const email = document.getElementById('inputEmail').value;
        const senha = document.getElementById('inputSenha').value;

        if (!validateName(nome)) {
            displayMessage("Nome inválido. Por favor, insira um nome válido.");
            return;
        }

        if (!validateEmail(email)) {
            displayMessage("Email inválido. Por favor, insira um email válido.");
            return;
        }

        const passwordValidation = validatePassword(senha);
        if (!passwordValidation.minLength || !passwordValidation.hasNumber || !passwordValidation.hasSymbol || !passwordValidation.hasUppercase || !passwordValidation.hasLowercase) {
            displayMessage("Senha inválida. Por favor, siga os requisitos de senha.");
            return;
        }

        const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
        const perfil = {
            id: usuarioLogado.id,
            nome: nome,
            email: email,
            senha: senha
        };

        atualizarPerfil(perfil);
    });

    function atualizarPerfil(perfil) {
        fetch(`${apiUrl}/${perfil.id}`, {
            method: 'PATCH',
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
                localStorage.setItem('usuarioLogado', JSON.stringify(perfil));
                alert('Perfil atualizado com sucesso!');
                reloadPage();
            })
            .catch(error => {
                console.error('Erro ao atualizar perfil:', error);
                alert('Erro ao atualizar perfil. Por favor, tente novamente mais tarde.');
            });
    }

    function reloadPage() {
        location.reload();
    }

    const togglePassword = document.getElementById('togglePassword');
    const passwordField = document.getElementById('inputSenha');
    const passwordValidation = document.getElementById('passwordValidation');

    togglePassword.addEventListener('click', function (e) {
        const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordField.setAttribute('type', type);
        this.querySelector('i').classList.toggle('fa-eye');
        this.querySelector('i').classList.toggle('fa-eye-slash');
    });

    passwordField.addEventListener('input', function () {
        const senha = passwordField.value;
        const validation = validatePassword(senha);

        let validationMessage = "";
        if (!validation.minLength) {
            validationMessage += "A senha deve ter pelo menos 6 caracteres.<br>";
        }
        if (!validation.hasNumber) {
            validationMessage += "A senha deve conter pelo menos um número.<br>";
        }
        if (!validation.hasSymbol) {
            validationMessage += "A senha deve conter pelo menos um símbolo.<br>";
        }
        if (!validation.hasUppercase) {
            validationMessage += "A senha deve conter pelo menos uma letra maiúscula.<br>";
        }
        if (!validation.hasLowercase) {
            validationMessage += "A senha deve conter pelo menos uma letra minúscula.<br>";
        }

        passwordValidation.innerHTML = validationMessage;
    });
});
