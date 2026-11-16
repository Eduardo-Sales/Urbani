// GERENCIAMENTO DE OCORRÊNCIAS 

/* Recupera as ocorrências armazenadas no localStorage.
* Converte os dados JSON em uma lista de objetos.
* Caso não tenha registros ou ocorra algum erro,
* retorna uma lista vazia. */

function obterAtividades(){
    try {
        const dados = localStorage.getItem("atividades");

        return dados ?
        JSON.parse(dados) : [];
    } catch (erro) {
        console.error("Erro ao recuperar atividades:", erro);
        return [];
    }
}

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

/**
 * Registra uma nova atvidade no histórico.
 * Armazena a data, a ação realizada e o resultado.
 */

function registrarAtividades(acao, resultado) {
    const atividades = obterAtividades();
    const novaAtividade = {
        data: new Date().toLocaleString("pt-BR"), acao: acao, resultado: resultado};
        atividades.unshift(novaAtividade);

        try {localStorage.setItem("atividades", JSON.stringify(atividades));
            return true;
        } catch (erro) {
            console.error("Erro ao registrar atividade:", erro);
            return false;
    }
}

/**
 * Lista as atividades registradas no histórico.
 * Exibe a data, a ação realizada e o resultado. 
 */

function listarAtividades() {
    const lista = document.getElementById("listaAtividades");
    if (!lista) {
        return;
    }
    const atividades = obterAtividades();
    lista.innerHTML ="";

    if (atividades.length === 0) {
        lista.textContent = "Nenhuma atividade registrada.";
        return;
    }


atividades.forEach(function(atividade) {
    
    const cartao = document.createElement("article");
   
    const data = document.createElement("p");
    data.textContent = "Data: " + atividade.data;
    
    const acao = document.createElement("p");
    acao.textContent = "Ação: " + atividade.acao;

    const resultado = document.createElement("p");
    resultado.textContent = "Resultado: " + atividade.resultado;

    cartao.append(data, acao, resultado);
    lista.appendChild(cartao);
 });
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

/**
 * Exibe mensagens de erro ou sucesso na página de ocorrências.
 */
function exibirMensagemOcorrencias(texto, tipo) {
    const mensagem = document.getElementById("mensagemOcorrencias");

    if (!mensagem) {
        return;
    }

    mensagem.textContent = texto;
    mensagem.className = "mensagem-formulario " + tipo;
}

/**
 * Exibe mensagens de erro ou sucesso no formulário.
 */
function exibirMensagemFormulario(texto, tipo) {
    const mensagem = document.getElementById("mensagemFormulario");

    if (!mensagem) {
        return;
    }

    mensagem.textContent = texto;
    mensagem.className = "mensagem-formulario " + tipo;
}

// CADASTRO DE OCORRÊNCIAS


// Localiza o formulário na página

const formulario =
document.getElementById("formOcorrencia");

// Verifica se existe um identificador na URL

const parametros = new
URLSearchParams(window.location.search);
const idEdicao = parametros.get("id");

// Carrega os dados da ocorrência selecionada
// para edição

if (formulario && idEdicao) {
    const ocorrencias = obterOcorrencias();

    const ocorrenciaEditar =
    ocorrencias.find(function(item) {
        return item.id === Number(idEdicao);
    });

    if (ocorrenciaEditar) {
        document.getElementById("titulo").value = ocorrenciaEditar.titulo;
        document.getElementById("categoria").value = ocorrenciaEditar.categoria;
        document.getElementById("bairro").value = ocorrenciaEditar.bairro;
        document.getElementById("localizacao").value = ocorrenciaEditar.localizacao;
        document.getElementById("descricao").value = ocorrenciaEditar.descricao;
    
    }
}

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
        exibirMensagemFormulario ("Preencha todos os campos.", "erro");
        return;
   
    } 

// Verifica o limite de caracteres de cada campo

if (titulo.length > 80 || bairro.length > 60 || localizacao.length > 120 || descricao.length > 500
) {
    exibirMensagemFormulario("Um ou mais campos ultrapassaram o limite de caracteres.", "erro");
    return;
}

// Verifica se a categoria selecionada é válida
const categoriasValidas = [
    "Buraco nas vias",
    "Iluminação pública",
    "Calçadas danificadas",
    "Descarte irregular",
    "Outros"
];

if (!categoriasValidas.includes(categoria)) {
    exibirMensagemFormulario("Selecione uma categoria válida.", "erro");
    return;
}

// Recupera os registros existentes

const ocorrencias = obterOcorrencias();

let salvou;

// Verifica se o formulário está em modo de edição
if (idEdicao) {

    // Atualiza os dados da ocorrência selecionada
    const ocorrenciasAtualizadas = ocorrencias.map(function(item) {

        if (item.id === Number(idEdicao)) {
            return {
                ...item,
                titulo: titulo,
                categoria: categoria,
                bairro: bairro,
                localizacao: localizacao,
                descricao: descricao
            };
        }

        return item;
    });

    salvou = salvarOcorrencias(ocorrenciasAtualizadas);

} else {

    // Cria uma nova ocorrência
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

    ocorrencias.push(novaOcorrencia);

    salvou = salvarOcorrencias(ocorrencias);
}

// Verifica se os dados foram salvos corretamente
    if (salvou) {
        if (idEdicao) {
            registrarAtividades("Edição de ocorrência", "Ocorrência atualizada com sucesso");

            exibirMensagemFormulario("Ocorrência atualizada com sucesso!", "sucesso");

            // Mantém a página aberta para exibir a confirmação

        } else {
            registrarAtividades("Cadastro de ocorrência", "Ocorrência cadastrada com sucesso");

            exibirMensagemFormulario("Ocorrência registrada com sucesso!", "sucesso");

            formulario.reset();
        }

} else {
    exibirMensagemFormulario("Não foi possível salvar a ocorrência. Tente novamente.", "erro");
}
 });
}

/**
 * Lista as ocorrências armazenadas no localStorage.
 * Cria elementos HTML para exibir os dados de cada registro.
 * Caso não existam ocorrências, informa o usuário.
 */

function listarOcorrencia(){

// Localiza a área destinada à listagem 

const lista = document.getElementById("listaOcorrencias");

// Verifica se a área existe na página 

if (!lista) {
    return;
}

// Recupera as ocorrências armazenadas

const ocorrencias = obterOcorrencias();

// Limpa o conteúdo anterior 

lista.innerHTML ="";

// Verifica se existem registros
if (ocorrencias.length === 0) {
    lista.textContent= "Nenhuma ocorrência registrada.";
    return;
}

// Percorre os registros e cria a sua exibição

ocorrencias.forEach(function(ocorrencia) {

    const botaoEditar =
    document.createElement("button");
    botaoEditar.textContent = "Editar";

    botaoEditar .addEventListener("click", function() {
        window.location.href = "registrar.html?id=" + ocorrencia.id;
    });

    const botaoExcluir = document.createElement("button");
    botaoExcluir.textContent = "Excluir";

    botaoExcluir.addEventListener("click", function(){
        const confirmar = confirm("Deseja realmente excluir esta ocorrência?");
        if (!confirmar) {
            return;
        }
        
        const ocorrenciasAtualizadas = obterOcorrencias().filter(function(item) {
            return item.id !== ocorrencia.id;
        });
       
        const salvou = salvarOcorrencias(ocorrenciasAtualizadas);
        if (salvou) {
            registrarAtividades("Exclusão de ocorrência", "Ocorrência excluida com sucesso");
            exibirMensagemOcorrencias("Ocorrência excluída com sucesso!", "sucesso");
            listarOcorrencia();
            listarAtividades();
        } else {
            exibirMensagemOcorrencias("Não foi possível excluir a ocorrência. Tente novamente.", "erro");
        }
    });
    
    const cartao = document.createElement("article");

    const titulo = document.createElement("h3");
    titulo.textContent = ocorrencia.titulo;

    const categoria = document.createElement("p");
    categoria.textContent = "Categoria: " + ocorrencia.categoria;

    const bairro = document.createElement("p");
    bairro.textContent = "Bairro: " + ocorrencia.bairro;

    const localizacao = document.createElement("p");
    localizacao.textContent = "Localização: " + ocorrencia.localizacao;

    const descricao = document.createElement("p");
    descricao.textContent = "Descrição: " + ocorrencia.descricao;

    const status = document.createElement("p");
    status.textContent = "Status: " + ocorrencia.status;

    const data = document.createElement("p");
    data.textContent = "Data: " + ocorrencia.data;

    cartao.append(
        titulo,
        categoria,
        bairro,
        localizacao,
        descricao,
        status,
        data,
        botaoEditar,
        botaoExcluir
    );

    lista.appendChild(cartao);
    
 });
}

// Executa a listagem quando a página é carregada 

listarOcorrencia();
listarAtividades();