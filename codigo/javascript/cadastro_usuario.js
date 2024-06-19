document.addEventListener("DOMContentLoaded", function () {
    const apiUrl = 'https://bc8bb33f-6175-4214-998c-292c322364a2-00-2ddr60lv3tm7s.worf.replit.dev/users';
    const checkEmailUrl = 'https://bc8bb33f-6175-4214-998c-292c322364a2-00-2ddr60lv3tm7s.worf.replit.dev/check-email';
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

    const formCadastro = document.getElementById("form-contato");

    const btnInsert = document.getElementById("btnInsert");
    btnInsert.addEventListener('click', function (event) {
        event.preventDefault();

        if (!formCadastro.checkValidity()) {
            displayMessage("Preencha o formulário corretamente.");
            return;
        }

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

        console.log(`Verificando email: ${email}`);

        fetch(`${checkEmailUrl}?email=${email}`)
            .then(response => {
                if (response.status === 400) {
                    return response.json().then(data => {
                        throw new Error(data.message);
                    });
                }
                if (!response.ok) {
                    throw new Error('Erro ao verificar email');
                }
                return response.json();
            })
            .then(data => {
                console.log(`Resposta do servidor: ${JSON.stringify(data)}`);
                const usuario = {
                    nome: nome,
                    email: email,
                    senha: senha,
                    relatos: [],
                    animais_perdidos: []
                };

                createUsuario(usuario);
            })
            .catch(error => {
                console.error('Erro ao verificar email via API JSONServer:', error.message);
                displayMessage(error.message);
            });
    });

    function createUsuario(usuario) {
        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(usuario),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao cadastrar usuário');
                }
                return response.json();
            })
            .then(data => {
                // Sobrescreve os dados no localStorage, independentemente dos dados existentes
                localStorage.setItem('userId', data.id);
                localStorage.setItem('userName', data.nome);
                localStorage.setItem('userEmail', data.email);
                displayMessage("Usuário cadastrado com sucesso");
                window.location.href = "../html/home.html";
            })
            .catch(error => {
                console.error('Erro ao cadastrar usuário via API JSONServer:', error);
                displayMessage("Erro ao cadastrar usuário");
            });
    }

    // Toggle password visibility
    const togglePassword = document.getElementById('togglePassword');
    const passwordField = document.getElementById('inputSenha');
    const passwordHelp = document.getElementById('passwordHelp');
    const passwordValidation = document.getElementById('passwordValidation');

    togglePassword.addEventListener('click', function (e) {
        // Toggle the type attribute
        const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordField.setAttribute('type', type);
        // Toggle the eye icon
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
