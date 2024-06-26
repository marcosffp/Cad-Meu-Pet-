document.addEventListener("DOMContentLoaded", function () {
    const btnInsert = document.getElementById("btnInsert");
    const formCadastro = document.getElementById("form-contato");
    const passwordField = document.getElementById('inputSenha');
    const passwordValidation = document.getElementById('passwordValidation');

    btnInsert.addEventListener('click', async function (event) {
        event.preventDefault();

        if (!formCadastro.checkValidity()) {
            displayMessage("Preencha o formulário corretamente.");
            return;
        }
    
        const nome = document.getElementById('inputNome').value;
        const email = document.getElementById('inputEmail').value;
        const senha = passwordField.value;
    
        if (!validateName(nome)) {
            displayMessage("Nome inválido. Por favor, insira um nome válido.");
            return;
        }
    
        if (!validateEmail(email)) {
            displayMessage("Email inválido. Por favor, insira um email válido.");
            return;
        }
    
        const passwordValidationResult = validatePassword(senha);
        if (!passwordValidationResult.minLength || !passwordValidationResult.hasNumber || !passwordValidationResult.hasSymbol || !passwordValidationResult.hasUppercase || !passwordValidationResult.hasLowercase) {
            displayMessage("Senha inválida. Por favor, siga os requisitos de senha.");
            return;
        }
    
        const usuario = {
            "nome": nome,
            "email": email,
            "senha": senha,
            "relatos": [],
            "animais_perdidos": []
        };

        try {
            const response = await fetch('/users');
            const data = await response.json();
            const existingUsers = data.filter(x => x.email === email);
    
            if (existingUsers.length > 0) {
                 window.alert("Email já cadastrado. Por favor, use outro email.");
                return;
            }
    
            const createUserResponse = await fetch('/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(usuario),
            });
    
            if (!createUserResponse.ok) {
                throw new Error('Erro ao cadastrar usuário');
            }
    
            const userData = await createUserResponse.json();
            console.log(userData)
            localStorage.setItem('userId', userData.id);
            localStorage.setItem('userName', userData.nome);
            localStorage.setItem('userEmail', userData.email);
    
            window.alert("Usuário cadastrado com sucesso");
            window.location.href = '../html/home.html'; 

        } catch (error) {
            console.error('Erro ao cadastrar usuário via API JSONServer:', error);
            window.alert("Erro ao cadastrar usuário");
        }
    });

    const togglePassword = document.getElementById('togglePassword');

    togglePassword.addEventListener('click', function () {
        const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordField.setAttribute('type', type);
        this.querySelector('i').classList.toggle('fa-eye');
        this.querySelector('i').classList.toggle('fa-eye-slash');
    });

    passwordField.addEventListener('input', function () {
        const senha = passwordField.value;
        const validation = validatePassword(senha);
        updatePasswordValidationMessage(validation);
    });

    const menuIcon = document.querySelector(".mobile-menu-icon button");
    const menu = document.querySelector(".menu");

    menuIcon.addEventListener("click", function () {
        menu.classList.toggle("active");
    });

    updateCadastroButton();

    document.getElementById('Anunciar').addEventListener('click', verificarLogin);
    document.getElementById('Cadastrar').addEventListener('click', verificarLogin);
});

function updateCadastroButton() {
    const btnCadastrar = document.getElementById('Cadastrar').querySelector('a');
    const user = sessionStorage.getItem('userName') || localStorage.getItem('userName');

    if (btnCadastrar) {
        if (user) {
            btnCadastrar.textContent = 'Logado';
            btnCadastrar.href = '../html/editor_perfil.html';
        } else {
            btnCadastrar.textContent = 'Cadastrar';
            btnCadastrar.href = '../html/cadastro_usuario.html';
        }
    }
}

// function displayMessage(message) {
//     const messageElement = document.getElementById('message');
//     messageElement.innerHTML = message;
//     messageElement.style.display = 'block'; 
// }

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

function updatePasswordValidationMessage(validation) {
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
}

async function verificarLogin(event) {
    const user = sessionStorage.getItem('userName') || localStorage.getItem('userName');

    if (!user) {
        event.preventDefault();
        window.location.href = '../html/cadastro_usuario.html';
    }
}
