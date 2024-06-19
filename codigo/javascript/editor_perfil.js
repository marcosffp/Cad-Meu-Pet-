function validatePassword(password) {
            // Verifica se a senha possui pelo menos 8 caracteres, uma letra maiúscula, uma letra minúscula, um número e um caractere especial
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
            return passwordRegex.test(password);
        }

        function atualizarPerfil(perfil) {
            // Validar a senha antes de continuar
            if (!validatePassword(perfil.senha)) {
                alert('A senha deve ter pelo menos 8 caracteres, uma letra maiúscula, uma letra minúscula, um número e um caractere especial.');
                return;
            }

            const apiUrl = 'https://c75b6410-fffa-4b73-b82c-d1c21ec77f4a-00-3360t4cd2jp1v.picard.replit.dev/cadastros/' + perfil.id;

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
                // Atualizar os dados no LocalStorage
                localStorage.setItem('usuarioLogado', JSON.stringify(perfil));

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

        document.addEventListener("DOMContentLoaded", function () {
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


        document.addEventListener("DOMContentLoaded", function () {
            init(); // Função init() a ser definida conforme necessidade
        
            // Atualizar botão de cadastro ao carregar a página
            updateCadastroButton();
        
            // Verificar login ao clicar nos links importantes
            document.getElementById('Anunciar').addEventListener('click', verificarLogin);
            document.getElementById('Cadastrar').addEventListener('click', verificarLogin);
            document.querySelector('.butao-perdi a').addEventListener('click', verificarLogin);
            document.querySelector('.butao-achei a').addEventListener('click', verificarLogin);
            document.querySelector('.criar-relato a').addEventListener('click', verificarLogin);
            document.querySelector('.criar-relato:nth-child(2) a').addEventListener('click', verificarLogin);
        });
        
        async function verificarLogin(event) {
            const user = sessionStorage.getItem('userName') || localStorage.getItem('userName'); // Verifica em sessionStorage ou localStorage
            if (!user) {
                event.preventDefault(); // Prevenir o comportamento padrão de navegação
                window.location.href = '../html/cadastro_usuario.html'; // Redirecionar para a página de cadastro de usuário
            }
        }
        
        function updateCadastroButton() {
            const btnCadastrar = document.getElementById('btn-cadastrar');
            const user = sessionStorage.getItem('userName') || localStorage.getItem('userName'); // Verifica em sessionStorage ou localStorage
            if (user) {
                btnCadastrar.textContent = 'Logado';
                btnCadastrar.href = '#';
            } else {
                btnCadastrar.textContent = 'Cadastrar';
                btnCadastrar.href = '../html/cadastro_usuario.html';
            }
        }