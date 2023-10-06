const musicaDeFundoON = () => {
    const musica = document.getElementById("soundtrack")
    musica.play()
}

const musicaDeFundoOFF = () => {
    const musica = document.getElementById("soundtrack")
    musica.pause()
}

//Essas linhas de código permitem que a função seguinte funcione corretamente
[...document.getElementsByClassName("gamediv")].map(elem=>elem.style.display="none") //dando um style a cada elemento cuja class é gamediv
document.getElementById("paginaInicial").style.display="flex"
//Essa função muda de tela do jogo e altera o funcionamento dos botões correspondentemente. caso mudar de/para tela 'gameplay', fazer autosave
const mudarTela = (classe) => (tela) => {
	const musica = document.getElementById('musica')
    const lista = [...document.getElementsByClassName(classe)]
    const mudar = document.getElementById(tela)
	const voltar = document.getElementById("voltar")
	const original=lista.filter(elem=>elem.style.display!="none")[0]
    lista.map(elem=>elem.style.display="none")
    mudar.style.display = "flex"
	mudar.classList.add('animacao')	
	voltar.onclick=()=>mudarTela('gamediv')(original.id)
	
	if (classe=='gamediv'){ // Ajuste de localização dos botões de acordo com algumas telas.
		if (tela=='gameplay') musica.classList.add("botoes-musica-modificados")
		else musica.classList.remove("botoes-musica-modificados")
        if(tela == 'resun') { 
            musica.classList.add('botoes-musica-modificados-2')
            voltar.classList.add('botao-voltar-modificado')
        }else {
            musica.classList.remove("botoes-musica-modificados-2")
            voltar.classList.remove('botao-voltar-modificado')    
    }
	}
	if(tela=='gameplay'||original.id=='gameplay') save(estadoAtual)('autosave')
}

const criarEstadoInicial = () => {
    return { nome: '',
    nivel: 0,
    xp: 0,
    hp: 100,
    moedas: 50, 
}
}

let estadoAtual = criarEstadoInicial()
const xp = document.querySelectorAll('#valorXP')
const moedas = document.querySelectorAll('#valorMoeda')
const hp = document.querySelectorAll('#valorHP')
const nomeTxt=document.querySelectorAll('#nome-txt')
const nivel = document.querySelectorAll('#nivel')

// Botão de continuar na tela 'nome'
const continuar = () => {
    estadoAtual.nome=document.getElementById('nomeInput').value
    mudarTela('gamediv')('gameplay');atualizarDOM(estadoAtual)
}


// Logística do RESUN
// Feito com auxílio do Chat GPT
// Baseado em https://replit.com/@BeauCarnes/JavaScript-RPG#script.js



// Fazendo uso de variável para atualizar o estado atual. Tentamos de vários modos fazer por funcional, mas não conseguimos achar uma solução efetiva.



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
        const alerta = document.querySelector('#alerta')
        alerta.style.display = 'block'
        // Se não tem moedas suficientes para comprar HP, retorne a mesma coisa
        // Colocar um pop-up que avise 'Você não tem moedas suficientes'
        return estado
        
    }
}
// Função para atualizar a interface
const atualizarDOM = (estado) => {
    const helper = ([x,...xs]) => (valor) => {
        if([x,...xs].length = 0) x.textContent = estado[valor]
        else {
            x.textContent = estado[valor]
            return helper(xs)(valor)
        } 
        
            }

    helper(hp)("hp")
    helper(moedas)("moedas")
    helper(nomeTxt)("nome")
	mudarTela('personagemGameplay')(estado.opcao)
	
}

// Função genérica para o clique de cada botão do RESUN
const comprarClique = (estado) => (qtdeDeHP) => {
    estadoAtual = comprarHP(estado,qtdeDeHP)
    atualizarDOM(estadoAtual)
    return estadoAtual
}

// Funcionalidade dos botões (Execução da função dependente do clique)
const bolodepote = () => {
    estadoAtual = comprarClique(estadoAtual)(10)
}

const frango = () => {
    estadoAtual = comprarClique(estadoAtual)(30)
}

const feijoada = () => {
    estadoAtual = comprarClique(estadoAtual)(60)
}

// Progressão de nível




//Funcionalidade de save e load.
/* const save=estado=>slot=>{
	//Essa função armazena os dados do jogo no armazenamento local.
	localStorage.setItem(slot,JSON.stringify(estado))	
}

const load=slot=>{
	//Essa função inicializa o jogo a partir de dados armazenados.
	const estado=JSON.parse(localStorage.getItem(slot))
    atualizarDOM(estado)
    estadoAtual = estado
	mudarTela('gamediv')('gameplay')
} */

const iniciarJogo=()=>{
/* 	const autosave=localStorage.getItem("autosave")
	if (autosave==null){ */
		mudarTela('gamediv')('cursos')
	}/* 
	else load('autosave')
	
}

const deletarSave=slot=>{
    //Apaga os dados do jogo de um slot do armazenamento local
    localStorage.removeItem(slot)
} */
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
