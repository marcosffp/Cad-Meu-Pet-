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

    const formCadastro = document.getElementById("form-perfil");

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
                if (data.length > 0) {
                    const usuario = {
                        nome: nome,
                        email: email,
                        senha: senha
                    };

                    updateUsuario(data[0].id, usuario);
                } else {
                    displayMessage("Usuário não encontrado");
                }
            })
            .catch(error => {
                console.error('Erro ao verificar email via API JSONServer:', error.message);
                displayMessage(error.message);
            });
    });

    function updateUsuario(id, usuario) {
        fetch(`${apiUrl}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(usuario),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao atualizar usuário');
                }
                return response.json();
            })
            .then(data => {
                localStorage.setItem('userId', data.id);
                localStorage.setItem('userName', data.nome);
                localStorage.setItem('userEmail', data.email);
                displayMessage("Usuário atualizado com sucesso");
                window.location.href = "../html/home.html";
            })
            .catch(error => {
                console.error('Erro ao atualizar usuário via API JSONServer:', error);
                displayMessage("Erro ao atualizar usuário");
            });
    }

    // Toggle password visibility
    const togglePassword = document.getElementById('togglePassword');
    const passwordField = document.getElementById('inputSenha');
    const passwordHelp = document.getElementById('passwordHelp');
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

    const emailField = document.getElementById('inputEmail');
    emailField.addEventListener('blur', function () {
        const email = emailField.value;

        if (validateEmail(email)) {
            fetch(`${checkEmailUrl}?email=${email}`)
                .then(response => response.json())
                .then(data => {
                    if (data.length > 0) {
                        const user = data[0];
                        document.getElementById('inputNome').value = user.nome;
                        // Note: Password should not be pre-filled for security reasons.
                        localStorage.setItem('userId', user.id);
                    } else {
                        displayMessage("Usuário não encontrado.");
                    }
                })
                .catch(error => {
                    console.error('Erro ao buscar usuário por email:', error.message);
                    displayMessage("Erro ao buscar usuário por email");
                });
        }
    });
});
