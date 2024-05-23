function cadastro()
{
    nome=document.getElementById("nome-cadastro").value
    email=document.getElementById("email-cadastro").value
    senha=document.getElementById("senha-cadastro").value
    data={nome, email, senha}   
    if(localStorage.getItem(email))
        {
            window.alert ("email já cadastrado")
        }
    else
        {
            localStorage.setItem(email, JSON.stringify(data))
            window.alert ("usuario cadastrado com sucesso")
        }
}
function login()
{
    email=document.getElementById("email-login").value
    senha=document.getElementById("senha-login").value
    if(localStorage.getItem(email))
    {
        data=JSON.parse(localStorage.getItem(email))
        if(data.senha==senha)
        {
            window.alert ("usuario encontrado")
        }
        else
        {
            window.alert ("senha errada")
        }
    }
    else
    {
        window.alert ("email não encontrado")
    }
}