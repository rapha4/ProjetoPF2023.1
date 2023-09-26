const musicaDeFundoON = () => {
    const musica = document.getElementById("soundtrack")
    musica.play()
}

const musicaDeFundoOFF = () => {
    const musica = document.getElementById("soundtrack")
    musica.pause()
}

const mudarTela = (classe) => (tela) => {
    const lista = [...document.getElementsByClassName(classe)]
    const mudar = document.getElementById(tela)
    lista.map(elem=>elem.style.display="none")
    mudar.style.display="flex"
}

// Comentado pois precisa desenvolver a interface primeiro
/* const xp = document.querySelector('#valorXP')
const moedas = document.querySelector('#valorMoeda')
const hp = document.querySelector('#valorHP')
const resunbtn1 = document.querySelector('#resunbtn1')
const resunbtn2 = document.querySelector('#resunbtn2') 
const resunbtn3 = document.querySelector('#resunbtn3') */


// Logística do RESUN
// Feito com auxílio do Chat GPT
// Baseado em https://replit.com/@BeauCarnes/JavaScript-RPG#script.js

const criarEstadoInicial = () => {
    return { xp: 0,
    hp: 100,
    moedas: 50 
}
}

const estadoInicial = criarEstadoInicial()
// Fazendo uso de variável para atualizar o estado atual. Tentamos de vários modos fazer por funcional, mas não conseguimos achar uma solução efetiva.
let currentState = estadoInicial 


const comprarHP = (estado, qtdeDeHP) => {
    const custo = qtdeDeHP / 2 // Cada ponto de vida custa 0.5 moedas 
    if (estado.moedas >= custo) {
        return {
            ...estado,
            hp: estado.hp + qtdeDeHP,
            moedas: estado.moedas - custo
        }
    }
    else {
        // Se não tem moedas suficientes para comprar HP, retorne a mesma coisa
        // Colocar um pop-up que avise 'Você não tem moedas suficientes'
        return estado
    }
}
// Função para atualizar a interface
const atualizarDOM = (estado) => {
    xp.textContent = estado.xp
    hp.textContent = estado.hp
    moedas.textContent = estado.moedas
}

// Função genérica para o clique de cada botão do RESUN
const comprarClique = (estado, qtdeDeHP) => {
    const updatedState = comprarHP(estado,qtdeDeHP)
    atualizarDOM(updatedState)
    return updatedState
}

// Funcionalidade dos botões (Execução da função dependente do clique)
resunbtn1.addEventListener('click', () => {
    currentState = comprarClique(currentState, 10)
})

resunbtn2.addEventListener('click', () => {
    currentState = comprarClique(currentState, 30)
})

resunbtn3.addEventListener('click', () => {
    currentState = comprarClique(currentState, 60)
})

//Funcionalidade de save e load.
const save=estado=>slot=>{
	//Essa função armazena os dados do jogo no armazenamento local.
	localStorage.setItem(slot,JSON.stringify(estado))	
}

const load=slot=>{
	//Essa função inicializa o jogo a partir de dados armazenados.
	const estado=JSON.parse(localStorage.getItem(slot))
    atualizarDOM(estado)
    currentState=estado
}

const deletarSave=slot=>{
    //Apaga os dados do jogo de um slot do armazenamento local
    localStorage.removeItem(slot)
}
//Funcionalidades posteriores: caso julgado necessário, dar aviso ao usuário: exemplo: "Jogo salvo!"
