const musicaDeFundoON = () => {
    const musica = document.getElementById("soundtrack")
    musica.play()
}

const musicaDeFundoOFF = () => {
    const musica = document.getElementById("soundtrack")
    musica.pause()
}

const musicaBatalhaON = () => {
    musicaDeFundoOFF()
    const musica = document.getElementById("soundtrack-batalha")
    musica.play()
}

const musicaBatalhaOFF = () => {
    const musica = document.getElementById("soundtrack-batalha")
    musica.pause()
    musicaDeFundoON()
}


//Essas linhas de código permitem que a função seguinte funcione corretamente
/* Tudo que não for página inicial irá desaparecer e só a página principal carregará.  */
[...document.getElementsByClassName("gamediv")].map(elem=>elem.style.display="none")
document.getElementById("paginaInicial").style.display="flex" 


/*Essa função muda de tela do jogo e altera o funcionamento dos botões correspondentemente.
 Caso mudar de/para tela 'gameplay', fazer autosave
*/
const mudarTela = (classe) => (tela) => {
    /* Pegando todos os elementos do HTML */
	const musica = document.getElementById('musica')
    const lista = [...document.getElementsByClassName(classe)] // Todas as telas
    const mudar = document.getElementById(tela) // Tela para qual queremos mudar (Tela de destino)
	const voltar = document.getElementById("voltar") // Botão de voltar
    /* */
	const original=lista.filter(elem=>elem.style.display!="none")[0] // Pega a tela de origem, ou seja, a que atualmente está visível.

    /* Manda todas as telas desaparecerem */
    lista.map(elem=>elem.style.display="none")
    mudar.style.display = "flex" // Tela de destino fica visível
	mudar.classList.add('animacao')	// Transição da tela de destino
	voltar.onclick=()=>mudarTela('gamediv')(original.id) // Botão de voltar volta para a tela anterior à da de destino.
	
	if (classe=='gamediv'){ // Ajuste de localização dos botões de acordo com algumas telas.
        // Para a tela gameplay
        if (tela=='gameplay'){ musica.classList.add("botoes-musica-modificados") 
       /*  const aviso = document.querySelector('.aviso')
        aviso.style.display = 'block' */
    }
        else musica.classList.remove("botoes-musica-modificados")
        // Para a tela do resun
        if(tela == 'resun') { 
            musica.classList.add('botoes-musica-modificados-2')
        }else {
            musica.classList.remove("botoes-musica-modificados-2")
		}
        // Para a tela do Boss e do Config
		if(tela=='batalhaBoss'||tela=='config') musica.style.display='none'
		else musica.style.display='block'
        // Para a tela da bicen
        if (tela == 'bicen') {
            voltar.style.display = "block"
            voltar.classList.remove('botao-voltar')
            voltar.classList.add('botao-voltar-bicen')
            musica.style.marginLeft = "46px"
        } else {
            voltar.classList.remove('botao-voltar-bicen')
            voltar.classList.add('botao-voltar')
            musica.style.marginLeft = "0px"
        }
    }
	// Quando chegar na tela gameplay, dar autosave automaticamente.
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
    helper([...nomeTxt])("nome")
	mudarTela('personagemGameplay')(estado.opcao)
}


// Botão de continuar na tela 'nome'
const continuar = () => {
    estadoAtual.nome=document.getElementById('nomeInput').value.trim()
    if (estadoAtual.nome.length == 0){ window.alert('Insira um nome válido')} 
    else{
    mudarTela('gamediv')('gameplay')
    atualizarDOM(estadoAtual)
    }}





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


// Pega os elementos do HTML para serem manipulado no js
const batalhaBoss = document.querySelector("#batalhaBoss");
const nomeBossTxt = document.querySelector("#nomeBoss");
const hpBossTxt = document.querySelector("#hpBoss");
const texto = document.querySelector("#texto"); 



// Os dados básicos de cada boss

const boss = [
    {
      nome: "Vetores",
      nivel: 4,
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

  //Variaveis para pegar a informações específicas de cada boss
  const bossVetores = boss[0]
  const bossCalculo = boss[1]
  const bossDioglos = boss[2]
  const bossCirdLil = boss[3]

  //Essa função atualiza atualiza os elementos no HTML
  const atualizarDOMboss = (boss) => {
    hpBossTxt.textContent = boss.hp
}
//Ela gera uma valor aleatório
 const gerarValorAlea = (min, max) => {
    const valorAlea = Math.random(min,max)
    return valorAlea
 }
  //Função que pega as informações de cada boss para serem mostradas no  HTML
 const irLutar = (boss) => {
    hpBossTxt.innerText = boss.hp
    nomeBossTxt.innerText = boss.nome;
  }
 //Função usada para mudar o hp do usuário ou do boss a depender de quem for atacado 
  const atacar = (boss, estado) => {
    texto.innerText = "O " + boss.nome + " atacou."
        //Caso o ataque seja bem-sucedido, o hpdoBoss será alterado
        if (bossAtacado(boss, estado)){
            texto.innerText += " Você acertou o "+boss.nome+".";
            const novohpBoss = boss.hp - ((estado.nivel*2) + Math.floor(estado.xp/5) + 1);// dano baseado no seu nivel e em xp
            boss.hp = novohpBoss
            atualizarDOMboss({...boss, hp:novohpBoss})
        //Caso o ataque falhe, o usuário perde hp
        }else{
            texto.innerText += " Você errou o ataque";
            const novoHp = estado.hp - pegarValorAtaqueBoss(boss, estado)
            estado.hp = novoHp
            atualizarDOM({...estado, hp: novoHp})
        }
        //Analisa a situação do usuário e do boss após sofrerem ataque, determinando a vitória ou a derrota
        if (estado.hp <= 0) {
            estado.hp = 100
            boss.hp = 100
            atualizarDOMboss({...boss, hp: 100})
            atualizarDOM({...estado, hp:100})
            mudarTela('gamediv')('derrota tela')
        } else if (boss.hp <= 0){
            boss.nome === "Cirdneh e Lilak" ? vitoria() : bossDerrotado(boss, estado)
    }
  }
  // Gera o valor do ataque do Boss
const pegarValorAtaqueBoss = (boss,estado) => {
     //dano baseado no nivel do boss e no xp do usuário
    const ataque = (boss.nivel*3)-(Math.floor(gerarValorAlea(0,1)*(estado.xp/10)))
        return ataque
  }

 /* Gera um valor aleatório e calcula a diferença do nivel do usuário com o nível do boss. Essa diferenaça 
 é passada para uma função auxiliar q analisa e retorna outro valor. 
 Caso o valor seja maior q o aleatório ou a do hpBoss<20 a função retorna true  
 
 ---Código de dificuldade do boss feito com auxílio do chatgpt*/
 const bossAtacado = (boss, estado) => {
    const valorAlea = gerarValorAlea(0,1)
    const diferencaNiveis = estado.nivel - boss.nivel
    const chance = (diferenca) => {
        if (diferenca < 0) {return 0.2}
        else if (diferenca == 0) {return 0.4}
        else {return 0.8}
    }
    return valorAlea < chance(diferencaNiveis) || boss.hp < 20
    }

// Serve para desviar do ataque do boss, mas perdendo um valor mínimo
const desviar = (boss, estado) => {
    if (conseguiuDesviar(boss,estado)){
        texto.innerText = "Você desviou do ataque de " + boss.nome + " com alguns arranhões."
    } else {
        texto.innerText = "Você não conseguiu desviar do ataque a tempo."
        const novoHp = estado.hp - pegarValorAtaqueBoss(boss, estado)
        estado.hp = novoHp
        atualizarDOM({...estado, hp: novoHp})
    }
    if (estado.hp <= 0) {
        estado.hp = 100
        boss.hp = 100
        atualizarDOMboss({...boss, hp: 100})
        atualizarDOM({...estado, hp:100})
        mudarTela('gamediv')('derrota tela')
    } else if (boss.hp <= 0){
            boss.nome === "Cirdneh e Lilak" ? vitoria() : bossDerrotado(boss, estado)
    }
}
const conseguiuDesviar = (boss, estado) =>{
    const valorAlea = gerarValorAlea(0,1)
    const diferencaNiveis = estado.nivel - boss.nivel
    const chance = (diferenca) => {
        if (diferenca < 0) {return 0.4}
        else if (diferenca == 0) {return 0.6}
        else {return 0.8}
    }
    return valorAlea < chance(diferencaNiveis) || boss.hp < 20
}
const fugir = (boss) => {
    texto.innerText = "Você está lutando com o Boss!"
    boss.hp = 100
    atualizarDOMboss({...boss, hp: 100})
    mudarTela('gamediv')('gameplay')
}

//Caso o hpBoss<0 e ele n seja o Boss final, ele será recompensado com xp, moedas 
const bossDerrotado = (boss, estado) => {
    texto.innerText = "Você está lutando com o Boss!"
    const novoXp = estado.xp + 100
    const maisMoedas = estado.moedas + 50
    estado.xp = novoXp
    estado.moedas = maisMoedas
    atualizarDOM({...estado, moedas: maisMoedas, xp: novoXp})
    mudarBtnOnClick(boss,estado)
    mudarTela('gamediv')('tela vitoria')
}

// Função que muda as funções do onclick da área de batalha e a imagem
const mudarBtnOnClick = (boss, estado) =>{
    const telaBatalha = document.getElementById('batalhaBoss')
    telaBatalha.style.display = 'block'
    const btnBatalha = document.getElementById('btnBatalha')
    const btnAtacar = document.getElementById('btnAtacar')
    const btnDesviar = document.getElementById('btnDesviar') 
    const btnFugir = document.getElementById('btnFugir')
    const boss1 = document.getElementById('boss1')
    const boss2 = document.getElementById('boss2')
    const boss3 = document.getElementById('boss3')
    const boss4 = document.getElementById('boss4')



    if ( boss.nome === "Vetores"){
        boss2.style.display='none'
        boss1.style.display='flex'
        btnBatalha.onclick = () =>mudarTela('gamediv')('batalhaBoss'),irLutar(bossCalculo, estado) 
        btnAtacar.onclick = () =>atacar(bossCalculo,estado)
        btnDesviar.onclick = () =>desviar(bossCalculo, estado)
        btnFugir.onclick = () =>fugir(bossCalculo)
    }else if(boss.nome === "Cálculo A"){    
        boss1.style.display='none'
        boss3.style.display='flex'
        btnBatalha.onclick = () =>mudarTela('gamediv')('batalhaBoss'),irLutar(bossDioglos, estado) 
        btnAtacar.onclick = () =>atacar(bossDioglos,estado)
        btnDesviar.onclick = () =>desviar(bossDioglos, estado)
        btnFugir.onclick = () =>fugir(bossCalculo)
        console.log('mudou para dioglos')
    }else{     
        boss3.style.display='none'
        boss4.style.display='flex'
        btnBatalha.onclick = () =>mudarTela('gamediv')('batalhaBoss'),irLutar(bossCirdLil, estado)
        btnAtacar.onclick = () =>atacar(bossCirdLil,estado)
        btnDesviar.onclick = () =>desviar(bossCirdLil, estado)
        btnFugir.onclick = () =>fugir(bossCalculo)
        console.log('mudou para cirdlil')
    }
}


const vitoria = () => {
    mudarTela('gamediv')('fimdejogo')
    console.log('vitória')
}


const mudarXP =(estado)=>(qt)=> {  /// adiciona xp ao personagem
	estado.xp += qt
	estado.nivel += parseInt(estado.xp/100) 

    if (estado.xp == 100) {
        estado.xp = 0
    }

	atualizarDOM(estado)
}

const ganharMoedas = (estado) => (qt) => {  /// adiciona moedas ao personagem
    estado.moedas += qt

    atualizarDOM(estado)
}


