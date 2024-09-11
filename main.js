const form = document.querySelector('form')
const submit = document.querySelector('button[type="submit"]')
form.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        submit.click()
    }
}
)
//Criar a função para coletar
function Coletar(){
    let input = document.getElementById("cep").value
    // Teste console.log(input)
    Dados(input)
}
async function Dados(input){
    let dados = await fetch(`https://viacep.com.br/ws/${input}/json/`).then(response => response.json())
    //console.log(dados)
    ExibirDados(dados)
}
function ExibirDados(dados){
    document.getElementById("cidade").value = dados.localidade
    document.getElementById("endereço").value = dados.logradouro
    document.getElementById("bairro").value = dados.bairro
}