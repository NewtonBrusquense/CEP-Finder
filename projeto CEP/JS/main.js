
const limparForm = (endereco) => {
    document.getElementById('logradouro').value = '';
    document.getElementById('bairro').value = '';
    document.getElementById('cidade').value = '';
    document.getElementById('uf').value = '';
    document.getElementById('ddd').value = '';
}

const preencherForm = (endereco) => {
    document.getElementById('logradouro').value = endereco.logradouro;
    document.getElementById('bairro').value = endereco.bairro;
    document.getElementById('cidade').value = endereco.localidade;
    document.getElementById('uf').value = endereco.uf;
    document.getElementById('ddd').value = endereco.ddd;
}

const eNum = (numero) => /^[0-9]+$/.test(numero);
const cepValido = (cep) => cep.length == 8 && eNum(cep);

const pesquisarCep = async() => {
    const cep = document.getElementById('cep').value;

    const consultarBtn = document.querySelector('.btn-primary');
    consultarBtn.disabled = true;

    const enderecoSalvo = localStorage.getItem(cep);
    if (enderecoSalvo) {
        preencherForm(JSON.parse(enderecoSalvo));
        consultarBtn.disabled = false;
        return;
    }

    if (cepValido(cep)){
        const url = `https://viacep.com.br/ws/${cep}/json/`;
        try {
            const dados = await fetch(url);
            const endereco = await dados.json();

            if (endereco.hasOwnProperty('erro')) {
                alert('O endereço é inválido! Por favor digite um CEP válido.')
            } else{
                preencherForm(endereco);
                localStorage.setItem(cep, JSON.stringify(endereco));
            }
        } catch (error) {
            console.error('Erro ao consultar o CEP:', error);
            alert('Ocorreu um erro ao consultar o CEP. Por favor, tente novamente mais tarde.');
        }
    } else {
        alert('O endereço é inválido! Por favor digite um CEP válido.')
    }
    consultarBtn.disabled = false;
}

document.querySelector('.btn-primary')
        .addEventListener('click', pesquisarCep);

document.getElementById('cep')
        .addEventListener('focusout', function() {
            const cepInput = this.value.trim();
            if(cepInput == '') {
                limparForm();
            }
        })