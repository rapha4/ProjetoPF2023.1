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
        }else {
            musica.classList.remove("botoes-musica-modificados-2")
            voltar.classList.remove('botao-voltar-modificado')    
		}
		if(tela=='batalhaBoss') musica.style.display='none'
    }
	
	if(tela=='gameplay'||original.id=='gameplay') save(estadoAtual)('autosave')
}

const criarEstadoInicial = () => {
    return { nome: '',
    nivel: 1,
    xp: 0,
    hp: 100,
    moedas: 100, 
}
}

let estadoAtual = criarEstadoInicial()

const xp = document.querySelectorAll('.valorXP')
const moedas = document.querySelectorAll('.valorMoeda')
const hp = document.querySelectorAll('.valorHP')
const nomeTxt=document.querySelectorAll('.nome-txt')
const nivel = document.querySelectorAll('.nivel')

// Botão de continuar na tela 'nome'
const continuar = () => {
    estadoAtual.nome=document.getElementById('nomeInput').value.trim()
    if (estadoAtual.nome.length == 0){ window.alert('Insira um nome válido')} 
    else{
    mudarTela('gamediv')('gameplay')
    atualizarDOM(estadoAtual)
    }}

// Função para atualizar a interface
const atualizarDOM = (estado) => {
    // Como o querySelectorAll retorna um nodeList, utilizamos da recursão para atualizar cada valor do nodelist
    const helper = ([x,...xs]) => (valor) => {
        if(xs.length == 0) { x.textContent = estado[valor] 
        console.log(xs)}
        else {
            x.textContent = estado[valor] // Atualiza o primeiro item
            return helper(xs)(valor) // Manda o segundo item pra ser atualizado
        } 
            }
    
	helper(hp)("hp")
    helper(moedas)("moedas")
	helper(nomeTxt)("nome")
	helper([...xp])("xp")
    helper([...nivel])("nivel")
	mudarTela('personagemGameplay')(estado.opcao)
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
 const save=estado=>slot=>{
	//Essa função armazena os dados do jogo no armazenamento local.
	localStorage.setItem(slot,JSON.stringify(estado))	
}

const load=slot=>{
	//Essa função inicializa o jogo a partir de dados armazenados.
	const estado=JSON.parse(localStorage.getItem(slot))
    atualizarDOM(estado)
    estadoAtual = estado
	mudarTela('gamediv')('gameplay')
} 

const iniciarJogo=()=>{
 	const autosave=localStorage.getItem("autosave")
	if (autosave==null){ 
		mudarTela('gamediv')('cursos')
	}
	else load('autosave')
	
}

const deletarSave=slot=>{
    //Apaga os dados do jogo de um slot do armazenamento local
    localStorage.removeItem(slot)
	if (slot="autosave") {
		estadoAtual=criarEstadoInicial()
		mudarTela('gamediv')('paginaInicial')
	}
} 
//Funcionalidades posteriores: caso julgado necessário, dar aviso ao usuário: exemplo: "Jogo salvo!"

const batalhaBoss = document.querySelector("#batalhaBoss");
const nomeBossTxt = document.querySelector("#nomeBoss");
const hpBossTxt = document.querySelector("#hpBoss");
const texto = document.querySelector("#texto"); 


// Os dados básicos de cada boss

const boss = [
    {
      nome: "Vetores",
      nivel: 5,
      hp: 100
    },
    {
        nome: "Cálculo A",
        nivel: 6,
        hp: 100
    },
    {
      nome: "Dioglos",
      nivel: 9,
      hp: 100
    },
    {
        nome: "Cirdneh e Lilak",
        nivel: 12,
        hp: 100
      }
  ];

// diferentes estados da batalha: descrição do estado, botões disponiveis para o usuário, funções de cada botão e o texto que acompanha o estado da luta
 /* const areaBatalha = [
    {
		nome: "luta",
		"botao de acao": ["ATACAR", "DESVIAR", "],
		"funcao botao": [atacar, desviar, mudarTela('gamediv')('gameplay')],
		texto: "Você está lutando com o boss"
	},
	{
		nome: "boss derrotado",
		"botao de acao": ["Próximo mês", "Próximo mês", "Próximo mês"],
		"funcao botao": [proxMes, proxMes, proxMes],
		texto: 'O boss grita "Arg!" enquanto te dá um 10. Você ganhou experiência e moedas!'
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
  ]*/

  const bossVetores = boss[0]
  const bossCalculo = boss[1]
  const bossDioglos = boss[2]
  const bossCirdLil = boss[3]

  const atualizarDOMboss = (boss) => {
    hpBossTxt.textContent = boss.hp
}
 const gerarValorAlea = (min, max) => {
    const valorAlea = Math.random(min,max)
    return valorAlea
 }
  //função que pega as informações de cada boss
 const irLutar = (boss) => {
    hpBossTxt.innerText = boss.hp
    nomeBossTxt.innerText = boss.nome;
  }
 //função usada para mudar o hp do usuário ou do boss a depender de quem for atacado 
  const atacar = (boss, estado) => {
        //caso o ataque seja bem-sucedido, o hpdoBoss será alterado
        if (bossAtacado(boss, estado)){
            const novohpBoss = boss.hp - (estado.nivel + Math.floor(gerarValorAlea(0,5) * estado.xp) + 1);// dano baseado no seu nivel e em xp
            boss.hp = novohpBoss
            atualizarDOMboss({...boss, hp:novohpBoss})
        //caso o ataque falhe, o usuário perde hp
        }else{
            console.log(estado.hp)
            const novoHp = estado.hp - pegarValorAtaqueBoss(boss, estado)
            estado.hp = novoHp
            atualizarDOM({...estado, hp: novoHp})
        }
        if (estado.hp <= 0) {
            derrota()
        } else if (boss.hp <= 0){
            boss.nome === "Cirdneh e Lilak" ? vitoria() : bossDerrotado()
    }
  }
  // Valor do ataque do Boss
const pegarValorAtaqueBoss = (boss,estado) => {
    const ataque = (boss.nivel*3)-(Math.floor(gerarValorAlea(0,1)*(estado.xp/10)))//dano baseado no nivel do boss e no xp do usuário
        return ataque
  }

 // Gera um valor aleatorio para comparar com o nivel do usuário ou o hp do boss. Depois da verificação retorna true ou false e decidi se o ataque será efetivo ou não
 // código de dificuldade do boss feito com auxílio do chatgpt
 const bossAtacado = (boss, estado) => {
    const valorAlea = gerarValorAlea(0,1)
    const diferencaNiveis = estado.nivel - boss.nivel
    const dificuldade = Math.max(0, 1 - Math.min(10, diferencaNiveis) * 0.1);
    return valorAlea > dificuldade || boss.hp < 20
    }

// Nem o boss nem o usuário perdem hp
const desviar = (boss, estado) => {
    texto.innerText = "Você desviou do ataque do " + boss.nome + " com alguns arranhões."
    const novoHp = estado.hp - boss.nivel
        estado.hp = novoHp
        atualizarDOM({...estado, hp: novoHp})
        if (estado.hp <= 0) {
            derrota()
        } else if (boss.hp <= 0){
            boss.nome === "Cirdneh e Lilak" ? vitoria() : bossDerrotado()
    }
}

const derrotarBoss = (boss, estado) => {
    const maisMoedas = estado.moedas + Math.floor(boss.nivel * 6.7)
    const novoXp = estado.xp + boss.nivel;
    estado.moedas = maisMoedas
    estado.xp = novoXp
    atualizarDOM({...estado, moedas: maisMoedas, xp: novoXp})
    window.alert("Você passou em "+boss.nome+"!!!");;
}

const derrota = () => {
    window.alert("Você foi reprovado");
}

const vitoria = () => {
    window.alert("Você passou");;
}



