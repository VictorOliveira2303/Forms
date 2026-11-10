
// ===== Elementos =====
const form = document.querySelector('#formulario');

const cep = document.querySelector('#cep');
const telefone = document.querySelector('#telefone');

const endereco = document.querySelector('#endereco');
const bairro = document.querySelector('#bairro');
const cidade = document.querySelector('#cidade');

const mensagemCep = document.querySelector('#mensagem-cep');
const mensagemFormulario = document.querySelector('#mensagem-formulario');
const botaoEnviar = document.querySelector('.submit-button');

// ===== Mensagens =====
function mostrarMensagem(elemento, mensagem, tipo = '') {
    elemento.textContent = mensagem;
    elemento.className = `form-message ${tipo}`;
}

// ===== Máscara de CEP =====
cep.addEventListener('input', () => {
    let valor = cep.value.replace(/\D/g, '').slice(0, 8);

    if (valor.length > 5) {
        valor = valor.replace(/^(\d{5})(\d)/, '$1-$2');
    }

    cep.value = valor;
});

// ===== Máscara de telefone =====
telefone.addEventListener('input', () => {
    let valor = telefone.value.replace(/\D/g, '').slice(0, 11);

    if (valor.length > 10) {
        valor = valor.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
    } else if (valor.length > 6) {
        valor = valor.replace(/^(\d{2})(\d{4})(\d{1,4})$/, '($1) $2-$3');
    } else if (valor.length > 2) {
        valor = valor.replace(/^(\d{2})(\d)/, '($1) $2');
    } else if (valor.length > 0) {
        valor = valor.replace(/^(\d{1,2})/, '($1');
    }

    telefone.value = valor;
});

// ===== Consulta de CEP =====
cep.addEventListener('blur', consultarCep);

async function consultarCep() {
    const valorCep = cep.value.replace(/\D/g, '');

    if (valorCep.length === 0) {
        mostrarMensagem(mensagemCep, '');
        return;
    }

    if (valorCep.length !== 8) {
        mostrarMensagem(mensagemCep, 'Digite um CEP válido com 8 números.', 'error');
        return;
    }

    mostrarMensagem(mensagemCep, 'Consultando CEP...');

    try {
        const resposta = await fetch(
            `https://viacep.com.br/ws/${valorCep}/json/`
        );

        if (!resposta.ok) {
            throw new Error('Falha na comunicação com o servidor.');
        }

        const dados = await resposta.json();

        if (dados.erro) {
            throw new Error('CEP não encontrado.');
        }

        endereco.value = dados.logradouro || '';
        bairro.value = dados.bairro || '';
        cidade.value = dados.localidade || '';

        mostrarMensagem(mensagemCep, 'Endereço encontrado com sucesso!', 'success');

    } catch (erro) {
        mostrarMensagem(mensagemCep, erro.message || 'Não foi possível consultar o CEP.', 'error');

        endereco.value = '';
        bairro.value = '';
        cidade.value = '';
    }
}

// ===== Validação do formulário =====
form.addEventListener('submit', (evento) => {
    evento.preventDefault();

    const valorTelefone = telefone.value.replace(/\D/g, '');
    const valorCep = cep.value.replace(/\D/g, '');

    if (valorTelefone.length < 10 || valorTelefone.length > 11) {
        mostrarMensagem(
            mensagemFormulario,
            'Digite um telefone válido.',
            'error'
        );

        telefone.focus();
        return;
    }

    if (valorCep.length !== 8) {
        mostrarMensagem(
            mensagemFormulario,
            'Digite um CEP válido.',
            'error'
        );

        cep.focus();
        return;
    }

    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    mostrarMensagem(
    mensagemFormulario,
    'Inscrição simulada com sucesso! Seus dados foram validados.',
    'success'
    );

    form.reset();

    mostrarMensagem(mensagemCep, '');
});