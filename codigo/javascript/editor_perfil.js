const form = document.getElementById('perfil-form');
const situacaoInput = document.getElementById('situacao');
const especieInput = document.getElementById('especie');
const generoInput = document.getElementById('genero');
const nomeInput = document.getElementById('nome');
const fotoInput = document.getElementById('foto');
const descricaoInput = document.getElementById('descricao');
const enviarButton = document.getElementById('enviar');

enviarButton.addEventListener('click', (e) => {
    e.preventDefault();
    const perfil = {
        situacao: situacaoInput.value,
        especie: especieInput.value,
        genero: generoInput.value,
        nome: nomeInput.value,
        foto: fotoInput.files[0],
        descricao: descricaoInput.value
    };
    localStorage.setItem('perfil', JSON.stringify(perfil));
    alert('Perfil salvo com sucesso!');
});

document.addEventListener("DOMContentLoaded", function () {
    const menuIcon = document.querySelector(".mobile-menu-icon button");
    const menu = document.querySelector(".menu");
  
    menuIcon.addEventListener("click", function () {
        menu.classList.toggle("active");
    });
  
    init();
  });