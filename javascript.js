const musicaDeFundoON = () => {
    const musica = document.getElementById("soundtrack")
    musica.play()
}

const musicaDeFundoOFF = () => {
    const musica = document.getElementById("soundtrack")
    musica.pause()
}

// Precisa ajustar essa mudarTela() para ser mais genérica, no momento ela só muda da tela principal para a próxima
/*
 const mudarTela = () =>  {
    const paginaInicial = document.getElementById("paginaInicial")
    const cursos = document.getElementById("cursos")
    const interface = document.getElementById('interface')
    paginaInicial.style.display = "none"
    cursos.style.display = 'flex'
    cursos.classList.add(`animacao`)
    interface.style.backgroundColor = '#b4c474'
} 
*/

//Essas linhas de código permitem que a função seguinte funcione corretamente
/* const redirInicial=["gameplay","cursos","personagem","nome"]; //por algum motivo, a proxima linha funciona apenas se usar ; nessa
[...document.getElementsByClassName("gamediv")].map(elem=>elem.style.display="none")  *///dando um style a cada elemento cuja class é gamediv
/* document.getElementById("paginaInicial").style.display="flex" */
//Essa função muda de tela do jogo e altera o funcionamento do botão de voltar correspondentemente.
const mudarTela = (classe) => (tela) => {
	const interface = document.getElementById('interface')
    const lista = [...document.getElementsByClassName(classe)]
    const mudar = document.getElementById(tela)
	const voltar = document.getElementById("voltar")
	const original=lista.filter(elem=>elem.style.display!="none")[0]
    original.style.display="none"
    mudar.style.display = "flex"
	mudar.classList.add('animacao')
	const helper= (id)=>{
		voltar.onclick=()=>mudarTela(classe)(id)
	}
	if (redirInicial.indexOf(tela)!=-1) helper("paginaInicial")
	else helper(original.id)
}


const xp = document.querySelector('#xp')
const moedas = document.querySelector('#moedas-txt')
const hp = document.querySelector('#hp')
const resunbtn1 = document.getElementById('resunbtn1')
const resunbtn2 = document.getElementById('resunbtn2') 
const resunbtn3 = document.getElementById('resunbtn3')  


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

const batalhaBoss = document.querySelector("#batalhaBoss");
const nomeBossTxt = document.querySelector("#nomeBoss");
const hpBossTxt = document.querySelector("#hpBoss");
const texto = document.querySelector("#texto"); 


// Os dados básicos de cada boss

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

// diferentes estados da batalha: descrição do estado, botões disponiveis para o usuário, funções de cada botão e o texto que acompanha o estado da luta
  const areaBatalha = [
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
		"botao de acao": ["JOGAR DE NOVO?", "SAIR DO JOGO", "SAIR DO JOGO"],
		"funcao botao": [jogarDeNovo, sairDoJogo, sairDoJogo],
		texto: "VOCÊ TIROU 0!!!"
	},
	{
		nome: "vitoria",
		"botao de acao": ["JOGAR DE NOVO", "SAIR DO JOGO", ""],
		"funcao botao": [restart, sairDoJogo, restart],
		texto: "Você sobreviveu o semestre! Ganhou o título de veterano 🎉"
    }
  ]
  
  const bossVetores = boss[0]
  const bossCalculo = boss[1]
  const bossDioglos = boss[2]
  const bossCirdLil = boss[3]

  const atualizarDOMboss = (boss) => {
    hpBossTxt.textContent = boss.hp
}
 function gerarValorAlea (min, max){
    const valorAlea = Math.random(min,max)
    return valorAlea
 }
  //função que pega as informações de cada boss
  function irLutar(boss){
    hpBossTxt.innerText = boss.hp
    nomeBossTxt.innerText = boss.nome;
  }
 //função usada para mudar o hp do usuário ou do boss a depender de quem for atacado 
  function atacar(boss, estado) {
    texto.innerText = "O " + boss.nome + "atacou."
    //caso o ataque seja bem-sucedido, o hpdoBoss será alterado
    if (bossAtacado()){
        texto.innerText += "Você acertou o"+boss.nome+".";
        const novohpBoss= boss.hp - ((estado.nivel * 2)+ Math.floor(gerarValorAlea(0,1) * estado.xp) + 1);//decidir quanto de dano
        return atualizarDOMboss({...boss, hp:novohpBoss})
    //caso o ataque falhe, o usuário perde hp
    }else{
        texto.innerText += "Você errou o ataque";
        const novoHp = estado.hp - pegarValorAtaqueBoss(boss.nivel)//decidir dano
        return  atualizarDOM({...estado, hp: novoHp})
    }
    
    if (estado.hp <= 0) {
        derrota()
    } else if (boss.hp <= 0){
        boss.nome === "Cirdneh e Lilak" ? vitoria() : bossDerrotado()
    }
  }
  // Valor do ataque do Boss
  function pegarValorAtaqueBoss (boss,estado) {
    const ataque = (boss.nivel*5)-(Math.floor(gerarValorAlea(0,1)*estado.xp))//decidir dano
        return ataque
  }
 // Gera um valor aleatorio e depois da verificação retorna true ou false e decidindo se o ataque será efetivo ou não
function bossAtacado (boss, estado){
    return gerarValorAlea(0,1) > (estado.nivel/10) || boss.hp < 20
}  

function desviar(boss) {
    texto.innerText = "Você desviou do ataque do " + boss.nome + "."
}

//adequar depois
function derrotarBoss(boss, estado) {
    const maisMoedas = estado.moedas + Math.floor(boss.nivel * 6.7)
    const novoXp = estado.xp + boss.nivel;
    atualizarDOM({...estado, moedas: maisMoedas, xp: novoXp})
    update(areaBatalha[1]);
}

function derrota() {
    update(areaBatalha[2]);
}

function vitoria() {
  update(areaBatalha[3]);
}


  /* Feito com auxílio do ChatGPT 
  Tratamento do input do nome */

/* Uso de regex (Regular Expressions) */
const tratarInput = (input) => {
        return input.replace(/</g, '&lt;') /* Impede que < e >, que determinam tags em HTML sejam utilizadas literalmente como tags de HTML. */
                    .replace(/>/g, '&gt;') 
                    .replace(/&/g, '&amp;') /* Substitui o & pelo seu representante no HTML */
                    .replace(/'/g, '&#39;') /* Substitui a aspa simples por seu representante */
                    .replace(/"/g, '&quot;'); /* Substitui a aspa dupla por seu representante */
      }


const botaoNome = document.getElementById('botaoNome')
const nomeInput = document.getElementById('nomeInput')
const nome = tratarInput(nomeInput.value)
