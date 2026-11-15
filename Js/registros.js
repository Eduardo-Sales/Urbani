// GERENCIAMENTO DE OCORRÊNCIAS 

/* Recupera as ocorrências armazenadas no localStorage.
* Converte os dados JSON em uma lista de objetos.
* Caso não tenha registros ou ocorra algum erro,
* retorna uma lista vazia. */

function obterOcorrencias() {
    try {
        const dados =
        localStorage.getItem("ocorrencias");

        return dados ?
        JSON.parse(dados) : [];
    } catch (erro) {
        console.error("Erro ao recuperar ocorrências:", erro);
        return [];
    }
}

/* Salva a lista de ocorrências no localStorage.
* Recebe uma lista de ocorrências e converte os dados
* para o formato JSON.
* Retorna true se o salvamento der certo ou false caso
* ocorra algum erro. */

function salvarOcorrencias(ocorrencias)
{
    try {
        localStorage.setItem(
            "ocorrencias",
            JSON.stringify(ocorrencias)
        );
        return true;
    } catch (erro) {
        console.error("Erro ao salvar ocorrências:", erro);
        return false;

    }
}

// CADASTRO DE OCORRÊNCIAS


// Localiza o formulário na página

const formulario =
document.getElementById("formOcorrencia");

// Verifica se o formulário existe

if (formulario) {

// Adiciona o evento responsável pelo cadastro de ocorrências

formulario.addEventListener("submit", function(event) {

// Impede o recarregamento da página 
        
    event.preventDefault();

// Captura os dados preenchidos no formulário

const titulo = document.getElementById("titulo").value.trim();
const categoria = document.getElementById("categoria").value.trim();
const bairro = document.getElementById("bairro").value.trim();
const localizacao = document.getElementById("localizacao").value.trim();
const descricao = document.getElementById("descricao").value.trim();


// Verifica se todos os campos foram preenchidos
    
if (!titulo  || !categoria || !bairro || !localizacao || !descricao) {
        alert("Preencha todos os campos.");
        return;
   
    } 
// Recupera os registros existentes

const ocorrencias = obterOcorrencias();

// Cria um objeto com os dados da ocorrência,
// incluindo identificador, status inicial e data de registro

const novaOcorrencia = {
    id: Date.now(),
    titulo: titulo,
    categoria: categoria,
    bairro: bairro,
    localizacao: localizacao,
    descricao: descricao,
    status: "Registrado",
    data: new Date().toLocaleString("pt-BR")
};

// Adiciona a nova ocorrência à lista 

ocorrencias.push(novaOcorrencia);

// Salva a lista atualizada

const salvou =salvarOcorrencias(ocorrencias);

// Verifica se os dados foram salvos corretamente

if (salvou) {
    alert("Ocorrência registrada com sucesso!");
    formulario.reset();
} else {
    alert("Não foi possível salvar a ocorrência.");
}

    });
}