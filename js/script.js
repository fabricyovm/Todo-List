/* Botão de inserir tarefas */
const btnAdicionarTarefa = document.querySelector('.btn-adiciona-tarefa');

// Array para armazenar as tarefas
let tarefas = [];

/* -------- Funções -------- */

// Atualiza o array de tarefas
function atualizarArray() {
    for(let i = 0; i < localStorage.length; i++) {
        tarefas[i] = localStorage.getItem(i);
    }
}

// Carrega a lista de tarefas ao abrir/recarregar a página
function carregarLista() {  
    const lista = obterLista();    
    
    for(let i = 0; i < tarefas.length; i++) {
        let conteudo = localStorage.getItem(i);
        let novaTarefa = criarNovaTarefa(conteudo);
        inserirTarefaNaLista(lista, novaTarefa);
    }    
}

// Testa se a lista é vazia para exibir ou remover o texto de "Não há tarefas no momento"
function testarSeListaEVazia() {
    const lista = obterLista();
    const listaVazia = document.querySelector('#lista-vazia');

    if(lista.children.length < 1) {
        listaVazia.style.display = "block";
    }
    else {
        listaVazia.style.display = "none";
    }
}

// Cria os elementos de uma nova tarefa
function criarNovaTarefa(conteudo) {
    const novaTarefa = document.createElement('li');      

    novaTarefa.innerHTML = `        
        <div class="conteudo-tarefa">
            <p>
                <i class="fa-solid fa-check icone-check"></i>
                <span>${conteudo}</span>
            </p>
        </div>
        <div>
            <i class="fa-regular fa-pen-to-square editar-tarefa"></i>
            <i class="fa-regular fa-trash-can remover-tarefa"></i>
        </div>
    `;

    return novaTarefa;
}

// Ativa/desativa as configurações de tarefa concluída
function concluirTarefa(elemento) {
    const tarefa = elemento.closest('li');
    tarefa.classList.toggle('tarefa-concluida');
}

// Edita o conteúdo da tarefa
function editarTarefa(conteudo, input) {
    conteudo.textContent = input.value;    
}

// Remove a tarefa da lista
function removerTarefa(elemento) {
    const tarefa = elemento.closest('li');
    const conteudo = tarefa.querySelector('span').textContent;    
    removerConteudoArray(conteudo);
    atualizarLocalStorage();
    tarefa.remove();
}

// Cancela a edição da tarefa
function cancelarEdicaoDaTarefa(boxEditarTarefa) {
    boxEditarTarefa.style.display = "none";
}

// Fecha a caixa de edição da tarefa
function fecharBoxEditarTarefa(boxEditarTarefa)  {
    boxEditarTarefa.style.display = "none";
}

// Adiciona/remove o background escuro ao abrir/fechar a caixa de edição de tarefas
function mudarFundo(background) {
    background.classList.toggle('fundo-escuro');
}

// Abre a caixa de edição de tarefas
function exibirBoxEditarTarefa(elemento) {
    const background = document.querySelector('.container-principal');
    const boxEditarTarefa = document.querySelector('.box-editar-tarefa');
    const inputEditarTarefa = document.querySelector('#input-editar-tarefa');
    const tarefa = elemento.closest('li');
    const conteudoAtualInput = tarefa.querySelector('.conteudo-tarefa p span');   
    const btnEditar = document.querySelector('#btn-editar-tarefa');
    const btnCancelar = document.querySelector('#btn-cancelar');

    mudarFundo(background);

    boxEditarTarefa.style.display = "block";
    inputEditarTarefa.value = conteudoAtualInput.textContent;
    inputEditarTarefa.focus();

    // Evento ao clicar no botão para editar a tarefa
    btnEditar.onclick = (event) => {
        event.preventDefault(); 
        editarConteudoArray(conteudoAtualInput.textContent, inputEditarTarefa.value);
        editarTarefa(conteudoAtualInput, inputEditarTarefa);        
        fecharBoxEditarTarefa(boxEditarTarefa) ;
        mudarFundo(background); 
        atualizarLocalStorage();  
    };

    // Fecha a caixa de editar a tarefa
    btnCancelar.onclick = (event) => {
        event.preventDefault();
        cancelarEdicaoDaTarefa(boxEditarTarefa);
        mudarFundo(background);
    }    
}

// Apaga o conteúdo do input de adicionar tarefa
function redefinirInput(descricaoTarefa) {
    descricaoTarefa.value = '';
    descricaoTarefa.focus();
}

// Insere a tarefa na lista
function inserirTarefaNaLista(lista, novaTarefa) {
    lista.appendChild(novaTarefa);
}

// Pega a lista de tarefas
function obterLista() {
    return document.querySelector('.lista');
}

// Adiciona o conteúdo da tarefa no array "tarefas"
function addConteudoArray(conteudo) {    
    tarefas.push(conteudo);
}

// Edita o conteúdo da tarefa dentro do array "tarefas"
function editarConteudoArray(conteudoAtual, novoConteudo) {
    const indice = tarefas.indexOf(conteudoAtual);
    tarefas[indice] = novoConteudo;
}

// Remove o a tarefa do array "tarefas"
function removerConteudoArray(conteudo) {
    const indice = tarefas.indexOf(conteudo);
    tarefas.splice(indice, 1);  
}

// Atualiza o conteúdo do localStorage
function atualizarLocalStorage() {
    localStorage.clear();
    for(let i = 0; i < tarefas.length; i++) {
        localStorage.setItem(i, tarefas[i]);
    }
}

/* -------- Eventos -------- */

// Funções que devem ser executados ao carregar o DOM
document.addEventListener('DOMContentLoaded', () => {
    if(localStorage.length > 0) {
        atualizarArray();
        carregarLista();
        testarSeListaEVazia();        
    }
});

// Funções que devem ser executadas dinamicamente
document.addEventListener('click', (event) => {
    const elemento = event.target;

    // Concluir tarefa
    if(elemento.classList.contains('icone-check') || elemento.classList.contains('conteudo-tarefa')) {                
        concluirTarefa(elemento);
    }

    // Remover tarefa
    if(elemento.classList.contains('remover-tarefa')) {
        removerTarefa(elemento);
    }

    // Editar tarefa
    if(elemento.classList.contains('editar-tarefa')) {
        exibirBoxEditarTarefa(elemento);
    }

    testarSeListaEVazia();      
});

// Adicionar tarefa 
btnAdicionarTarefa.addEventListener('click', (event) => {  
    event.preventDefault();
    const lista = obterLista();
    const descricaoTarefa = document.querySelector('.input-tarefa');      
    let novaTarefa;
    
    if(!descricaoTarefa.value) {
        return alert('Preencha o campo de tarefa.');
    }    

    addConteudoArray(descricaoTarefa.value);
    novaTarefa = criarNovaTarefa(descricaoTarefa.value);  
    inserirTarefaNaLista(lista, novaTarefa);    
    redefinirInput(descricaoTarefa);  
    atualizarLocalStorage();         
});