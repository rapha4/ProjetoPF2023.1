const musicaDeFundoON = () => {
    const musica = document.getElementById("soundtrack")
    musica.play()
}

const musicaDeFundoOFF = () => {
    const musica = document.getElementById("soundtrack")
    musica.pause()
}

// Precisa ajustar essa mudarTela() para ser mais genérica, no momento ela só muda da tela principal para a próxima
/* const mudarTela = () =>  {
    const paginaInicial = document.getElementById("paginaInicial")
    const cursos = document.getElementById("cursos")
    const interface = document.getElementById('interface')
    paginaInicial.style.display = "none"
    cursos.style.display = 'flex'
    cursos.classList.add(`animacao`)
    interface.style.backgroundColor = '#b4c474'
} */

const mudarTela = (classe) => (tela) => {
    const lista = [...document.getElementsByClassName(classe)]
    const mudar = document.getElementById(tela)
    lista.map(elem => elem.style.display = "none")
    mudar.style.display = "flex"
}


const xp = document.querySelector('#valorXP')
const moedas = document.querySelector('#valorMoeda')
const hp = document.querySelector('#valorHP')
const resunbtn1 = document.querySelector('#resunbtn1')
const resunbtn2 = document.querySelector('#resunbtn2') 
const resunbtn3 = document.querySelector('#resunbtn3') 


// Logística do RESUN
// Feito com auxílio do Chat GPT
// Baseado em https://replit.com/@BeauCarnes/JavaScript-RPG#script.js

const criarEstadoInicial = () => {
    return { xp: 0,
    hp: 100,
    moedas: 50 
}
}


// Fazendo uso de variável para atualizar o estado atual. Tentamos de vários modos fazer por funcional, mas não conseguimos achar uma solução efetiva.
let estadoAtual = criarEstadoInicial()


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
    estadoAtual = comprarHP(estado,qtdeDeHP)
    atualizarDOM(estadoAtual)
    return estadoAtual
}

// Funcionalidade dos botões (Execução da função dependente do clique)
resunbtn1.addEventListener('click', () => {
    estadoAtual = comprarClique(estadoAtual, 10)
})

resunbtn2.addEventListener('click', () => {
    estadoAtual = comprarClique(estadoAtual, 30)
})

resunbtn3.addEventListener('click', () => {
    estadoAtual = comprarClique(estadoAtual, 60)
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
    estadoAtual = estado
}

const deletarSave=slot=>{
    //Apaga os dados do jogo de um slot do armazenamento local
    localStorage.removeItem(slot)
}
//Funcionalidades posteriores: caso julgado necessário, dar aviso ao usuário: exemplo: "Jogo salvo!"

/*let batalha;
let hpBoss;
const batalhaBoss = document.querySelector("#batalhaBoss");
const nomeBossTxt = document.querySelector("#nomeBoss");
const hpBossTxt = document.querySelector("#hpBoss");

const boss = [
    {
      nome: "Vetores e Geometria Analítica",
      nivel: 2,
      hp: 45
    },
    {
        nome: "Cálculo A",
        nivel: 3,
        hp: 60
    },
    {
      nome: "Dioglos",
      nivel: 6,
      hp: 85
    },
    {
        nome: "Cirdneh e Lilak",
        nivel: 9,
        hp: 100
      }
  ];
// Os textos ainda vão ser modificados 
  const areaBatalha = [
    {   
        nome: "resun",
        "botao de acao": ["","",""],
        "funcao botao": [ , , ],
        texto: "Você entrou no Resun",
    },
    {
		nome: "luta",
		"botao de acao": ["ATACAR", "DESVIAR", "CORRER"],
		"funcao botao": [atacar, desviar, correr],
		texto: "Você está lutando com o boss"
	},
	{
		nome: "boss derrotado",
		"botao de acao": ["Próximo mês", "Próximo mês", "Próximo mês"],
		"funcao botao": [proxMes, proxMes, proxMes],
		texto: 'O boss grita "Arg!" enquanto te dá um 10. Você ganha experiência'
	},
	{
		nome: "derrota",
		"botao de acao": ["JOGAR DE NOVO?", "SAIR DO JOGO", ""],
		"funcao botao": [jogarDeNovo, sairDoJogo],
		texto: "TIROU 0!!!"
	},
	{
		nome: "vitoria",
		"botao de acao": ["JOGAR DE NOVO", "SAIR DO JOGO", ""],
		"funcao botao": [jogarDeNovo, sairDoJogo, restart],
		texto: "Você sobreviveu o semestre! Ganhou o título de veterano 🎉"
    }
  ]

  function lutarBoss() {
	batalha = 1;
	irLutar();
  }

  function irLutar(){
    update(areaBatalha[1]);
    hpBoss = boss[batalha].hp;
    batalhaBoss.style.display = "block";
    nomeBossTxt.innerText = boss[batalha].nome;
	hpBossTxt.innerText = hpBoss;
  }

  function atacar() {
    text.innerText = "O " + boss[batalha].nome + "atacou."
    if (bossAtacado()){
        hp -= getValorAtaqueBoss(boss[batalha].nivel);
    }else{
        texto.innerText += "Você errou o ataque";
    }
    
    if (hp <= 0) {
        derrota()
    } else if (hpBoss <= 0){
        batalha === 2 ? vitoria() : bossDerrotado()
    }
  }

  function getValorAtaqueBoss (nivel) {
    // const valorAlea = Math.random()
    //function getValorAtaqueBoss (nivel, xp, valorAlea){
    //    return (level * 5) - (Math.floor(valorAle * xp)
    //}  depois criava uma constante para receber os valores

    let hit = (level * 5) - (Math.floor(Math.random() * xp));
    console.log(hit);
    return hit;
  }
  //fazer a implementação para se o ataque será efetivo ou n, no jogo original é de 80% de chance de acertar
function bossAtacado (){
    return Math.random() > .2 || hp < 20
}  
// fazer a implementação de se ele vai conseguir desviar ou n baseado no bossAtacado()
function desviar() {
    texto.innerText = "Você desviou do ataque do " + boss[batalha].nome + "."
}
function derrotarBoss() {

}*/