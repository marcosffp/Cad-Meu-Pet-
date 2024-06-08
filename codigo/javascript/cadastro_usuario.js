//url do jsonserver


function readUsersFile(callback) {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Erro ao ler o arquivo:', err);
            return callback(err);
        }
        try {
            const users = JSON.parse(data);
            callback(null, users);
        } catch (jsonErr) {
            console.error('Erro ao parsear o JSON:', jsonErr);
            callback(jsonErr);
        }
    });
}


//função do navbar mobile
document.addEventListener("DOMContentLoaded", function () {
    const menuIcon = document.querySelector(".mobile-menu-icon button");
    const menu = document.querySelector(".menu");

    menuIcon.addEventListener("click", function () {
        menu.classList.toggle("active");
    });
});


document.getElementById("btnInsert").addEventListener("click", () => {
    const nome = document.getElementById("inputNome").value;
    const email = document.getElementById("inputEmail").value;
    const senha = document.getElementById("inputSenha").value;

    if (nome === "" || email === "" || senha === "") {
        alert("Todos os campos são obrigatórios!");
        return;
    }

    const usuario = { nome, email, senha };

    const fs = require('fs');
    const path = require('path');
    const filePath = path.join(__dirname, 'users.json');

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Erro ao ler o arquivo:', err);
            return;
        }

        let users = [];
        if (data) {
            users = JSON.parse(data);
        }

        users.push(usuario);

        fs.writeFile(filePath, JSON.stringify(users, null, 2), 'utf8', (err) => {
            if (err) {
                console.error('Erro ao salvar o arquivo:', err);
                return;
            }

            alert('Usuário salvo com sucesso!');
            document.getElementById("formCadastro").reset();
        });
    });
});

// Oculta a mensagem de aviso após alguns 5 segundos
function displayMessage(mensagem) {
    const msg = document.getElementById('msg');
    msg.innerHTML = '<div class="alert alert-warning">' + mensagem + '</div>';
    setTimeout(function () {
        msg.innerHTML = '';
    }, 5000);
}