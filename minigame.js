 /////// Define as configurações padrão do jogo
 const FPS = 30 // frames per second
 const vidas_iniciais = 3
 const tamanho_da_nave = 30 // pixels
 const velocidade_de_rotacao = 0.3
 const aceleracao_da_nave = 0.1
 const duracao_da_explosao_da_nave = 3
 const duracao_da_invisibilidade = 15 // parametro de tempo em que a nave nao é atingida por asteroides
 const duracao_do_pisca = 0.7 // durante a invisibilidade
 const maximo_de_lasers = 10 // numero maximo de lasers na tela  !!!!! por algum motivo, apenas 1 laser está sendo definido na tela
 const velocidade_do_laser = 50
 const distancia_do_laser = 0.35 // maxima distancia que o laser pode se movimentar
 const duracao_da_explosao_do_laser = 1
 const friccao = 0.3 // parametro que define a velocidade com qual a nave para no espaço após avançar
 const tamanho_do_asteroide = 100 // tamanho inicial dos asteroides
 const numero_de_asteroides = 5 // numero inicial de asteroides
 const velocidade_dos_asteroides = 5
 const vertices_dos_asteroides = 8 // quantidade padrao de vertices dos asteroides
 

 const canvas = document.querySelector("canvas")
 const context = canvas.getContext("2d")

 /////// Define o status inicial da nave

 const novaNave = () => {
     return {
         x: canvas.width / 2,
         y: canvas.height / 2, 
         r: tamanho_da_nave / 2, // raio
         a: 90/180 * Math.PI,  // angulo
         rot: 0, // rotacao
         tempoDoPisca: Math.ceil(duracao_do_pisca * FPS),
         numeroDoPisca: Math.ceil(duracao_da_invisibilidade / duracao_do_pisca),
         tempoDeExplosao: 0,
         podeAtirar: true,
         status: true, /// se true = não ocorreu game over, se false = game over
         lasers: [],
         avanço: false,
         movimento: {
             x: 0,
             y: 0,
         }
     }
 }

 //////////// INFORME: precisei definir "nave" como variável para que fosse possível "ressucitar" ela após colisões.
 var nave = novaNave()
 var vidas = vidas_iniciais

 const explodirNave = () => {
     nave.tempoDeExplosao = Math.ceil(duracao_da_explosao_da_nave * FPS)
 }

 const desenharNave = (x, y, a) => {
     context.strokeStyle = "white"
     context.lineWidth = tamanho_da_nave/20
     context.beginPath()
     context.moveTo( // topo da nave
         x + nave.r * Math.cos(a),
         y - nave.r *Math.sin(a)
     )
     context.lineTo( // lado esquerdo da nave
         x - nave.r * (Math.cos(a) + Math.sin(a)),
         y + nave.r * (Math.sin(a) - Math.cos(a))
     )
     context.lineTo( // trás da nave
         x - nave.r * (Math.cos(a) - Math.sin(a)),
         y + nave.r * (Math.sin(a) + Math.cos(a))
     )
     context.closePath() // lado direito da nave
     context.stroke()
 }
 ////////////// cria os lasers /////////////////
 const criarLaser = (lasers = []) => {
     if (lasers.length >= maximo_de_lasers)
         return lasers 
     else {
         const novoLaser = {
             x: nave.x + nave.r * Math.cos(nave.a),
             y: nave.y - nave.r * Math.sin(nave.a),
             velocidade_x: velocidade_do_laser * Math.cos(nave.a) / FPS,
             velocidade_y: -velocidade_do_laser * Math.sin(nave.a) / FPS,
             distancia: 0,
             tempoDeExplosao: 0
         }
         return [...lasers, novoLaser]
     }
 }

 const atirarLaser = () => {
     if (nave.podeAtirar) {
         nave.lasers = criarLaser(nave.lasers)
     } 
     nave.podeAtirar = false
 }

 ///////////// cria os registros dos asteroides ///////////////
 const criarNovoAsteroide = (x, y, r) => {
     const novoAsteroide = {
         x: x,
         y: y,
         velocidade_x: Math.random() * velocidade_dos_asteroides / FPS * (Math.random() < 0.5 ? 1 : -1),
         velocidade_y: Math.random() * velocidade_dos_asteroides / FPS * (Math.random() < 0.5 ? 1 : -1),
         r: r,
         a: Math.random() * Math.PI * 2,
         vertices: Math.floor(Math.random() * (vertices_dos_asteroides + 1) + vertices_dos_asteroides/2)
     }
     return novoAsteroide
 }

 ///// impede que os asteroides sejam criados em cima da nave
 const distanciaEntreObjetos = (x1, y1, x2, y2) => {
     return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
 }

 const criarCinturaoDeAsteroides = (cinturaoDeAsteroides = [], controle = 0) => {
     const x = Math.floor(Math.random() * canvas.width)
     const y = Math.floor(Math.random() * canvas.height) 
     if (controle >= numero_de_asteroides) 
         return cinturaoDeAsteroides
     else {
         const asteroideTemp = criarNovoAsteroide(x,y, Math.ceil(tamanho_do_asteroide / 2))
             if (distanciaEntreObjetos(nave.x, nave.y, asteroideTemp.x, asteroideTemp.y) < tamanho_do_asteroide * 2 + tamanho_da_nave)
                 return criarCinturaoDeAsteroides()
             else
                 return criarCinturaoDeAsteroides([...cinturaoDeAsteroides, asteroideTemp], controle+1)
     }
     }

 /////// armazena os registros dos asteroides
 // precisei utilizar de variavel para recriar os asteroides na funcao jogar novamente
 var asteroides = criarCinturaoDeAsteroides()

 ////// destruição de asteroides
 const destruirAsteroide = (index) => {
     const x = asteroides[index].x
     const y = asteroides[index].y
     const r = asteroides[index].r

     // divide o asteroide em 2 (se possível)
     if (r == Math.ceil(tamanho_do_asteroide / 2)) {
         asteroides.push(criarNovoAsteroide(x, y, Math.ceil(tamanho_do_asteroide / 4)))
         asteroides.push(criarNovoAsteroide(x, y, Math.ceil(tamanho_do_asteroide / 4)))
     }
     else if (r == Math.ceil(tamanho_do_asteroide / 4)) {
         asteroides.push(criarNovoAsteroide(x, y, Math.ceil(tamanho_do_asteroide / 8)))
         asteroides.push(criarNovoAsteroide(x, y, Math.ceil(tamanho_do_asteroide / 8)))
     }

     // destroi o asteroide
     asteroides.splice(index, 1)
 }
 

//// essa funcao começa um jogo novo, restaurando o numero de asteroides e vidas iniciais da nave
const iniciarMinigame = () => {
    nave = novaNave()
    asteroides = criarCinturaoDeAsteroides()
    vidas = vidas_iniciais
    document.getElementById('txt-vitoria').style.display = 'none' // esconde o txt "+100 XP" na tela
}

const escondeBotoes = () => {
    const botoes = document.getElementById("divBotoesMinigame")
    botoes.style.display = "none"
}

const mostraBotoes = () => {
    const botoes = document.getElementById("divBotoesMinigame")
    botoes.style.display = "flex"
}

//// termina o jogo quando o jogador perde todas as suas vidas
const gameOver = () => {
    nave.status = false
    mostraBotoes()
}

// win, pois "vitoria" já é outra função no codigo principal
const win = () => {
    mudarXP(estadoAtual)(100)
    ganharMoedas(estadoAtual)(10)
    gameOver()
    document.getElementById('txt-vitoria').style.display = 'block' // mostra o txt "+100 XP" na tela
}

 //////////// Event Listeners, captura o teclado ///////////
 const keyDown = (/** @type {KeyboardEvent}*/ ev) => {
     switch(ev.keyCode) {
         case 32: // (espaço) atira o laser
             if (nave.status) {
                 atirarLaser()
             }
             break;
         case 37: // (seta esquerda) rotaciona a nave para a esquerda
             nave.rot = velocidade_de_rotacao/FPS
             break;
         case 38: // (seta para cima) move a nave para frente
             nave.avanço = true
             break;
         case 39: // (seta direita) rotaciona a nave para a direita
             nave.rot = -velocidade_de_rotacao/FPS
             break;
     }
 }

 const keyUp = (/** @type {KeyboardEvent}*/ ev) => {
     switch(ev.keyCode) {
         case 32: // (espaço) permite que o laser seja atirado novamente
             nave.podeAtirar = true
             break;
         case 37: // (seta esquerda) para a rotacao da nave para a esquerda
             nave.rot = 0
             break;
         case 38: // (seta para cima) para o movimento da nave para frente
             nave.avanço = false
             break;
         case 39: // (seta direita) para a rotacao da nave para a direita
             nave.rot = 0
             break;
     }
 }

 document.addEventListener("keydown", keyDown)
 document.addEventListener("keyup", keyUp)


 ///////////////// frame ////////////////
 const atualizacao = () => {

 const naveExplodindo = nave.tempoDeExplosao > 0
 const piscaAtivado = nave.numeroDoPisca % 2 == 0

 ////// cria o fundo do jogo 
 context.fillStyle = "#222"
 context.fillRect(0, 0, canvas.width, canvas.height)

 ////// cria o desenho da nave
 if (!naveExplodindo) {
     if (piscaAtivado) {
         desenharNave(nave.x, nave.y, nave.a)
     }

     if (nave.numeroDoPisca > 0) {
         nave.tempoDoPisca--  // reduz o tempo do pisca

         if (nave.tempoDoPisca == 0) { // reduz o numero do pisca
             nave.tempoDoPisca = Math.ceil(duracao_do_pisca * FPS)
             nave.numeroDoPisca--
         }
     }
 }
 else { ////// cria o desenho da explosao
     context.fillStyle = "darkred"
     context.beginPath()
     context.arc(nave.x, nave.y, nave.r * 1.7, 0, Math.PI * 2, false)
     context.fill()

     context.fillStyle = "red"
     context.beginPath()
     context.arc(nave.x, nave.y, nave.r * 1.4, 0, Math.PI * 2, false)
     context.fill()

     context.fillStyle = "orange"
     context.beginPath()
     context.arc(nave.x, nave.y, nave.r * 1.1, 0, Math.PI * 2, false)
     context.fill()

     context.fillStyle = "yellow"
     context.beginPath()
     context.arc(nave.x, nave.y, nave.r * 0.8, 0, Math.PI * 2, false)
     context.fill()

     context.fillStyle = "white"
     context.beginPath()
     context.arc(nave.x, nave.y, nave.r * 0.5, 0, Math.PI * 2, false)
     context.fill()
 }

 ///// desenha as vidas
 const desenhaVidas = (vidas,controle = 0) => {
     if (vidas <= controle) {
         return 0
     }
     else {
         desenharNave(tamanho_da_nave + controle * tamanho_da_nave * 1.2, tamanho_da_nave, 0.5 * Math.PI)
         return desenhaVidas(vidas, controle+1)
     }
 }

 desenhaVidas(vidas)

 ////// rotacao da nave 
 if (nave.status) {
       nave.a += nave.rot
 }

 ////// movimento da nave
 if (nave.avanço) {
     nave.movimento.x += aceleracao_da_nave * Math.cos(nave.a) / FPS
     nave.movimento.y -= aceleracao_da_nave * Math.sin(nave.a) / FPS

     //cria o desenho da propulsao
     if (!naveExplodindo && piscaAtivado && nave.status) {
         context.fillStyle = "red"
         context.strokeStyle = "yellow"
         context.lineWidth = tamanho_da_nave/10
         context.beginPath()
         context.moveTo( // lado esquerdo da propulsao
             nave.x - nave.r * (Math.cos(nave.a) + 0.5 * Math.sin(nave.a)),
             nave.y + nave.r * (Math.sin(nave.a) - 0.5 * Math.cos(nave.a))
         )
         context.lineTo( // centro da propulsao
             nave.x - nave.r * 2 * Math.cos(nave.a),
             nave.y + nave.r * 2  * Math.sin(nave.a) 
         )
         context.lineTo( // lado direito da propulsao
             nave.x - nave.r * (Math.cos(nave.a) - 0.5 * Math.sin(nave.a)),
             nave.y + nave.r * (Math.sin(nave.a) + 0.5 * Math.cos(nave.a))
         )
         context.closePath() 
         context.fill()
         context.stroke()
     }
 }
 else {
     nave.movimento.x -= friccao * nave.movimento.x / FPS
     nave.movimento.y -= friccao * nave.movimento.y / FPS
 }

 ////// bordas do jogo, impede que a nave saia do frame
 if (nave.x < 0 - nave.r) {
     nave.x = canvas.width - nave.r
 }
 else if (nave.x > canvas.width + nave.r) {
     nave.x = 0 + nave.r
 }
 if (nave.y < 0 - nave.r) {
     nave.y = canvas.height - nave.r
 }
 else if (nave.y > canvas.height + nave.r) {
     nave.y = 0 + nave.r
 }

 ////// desenha os lasers
 const desenhaLasers = (laser) => {
     if (laser.tempoDeExplosao == 0) {
         context.fillStyle = "salmon"
         context.beginPath()
         context.arc(laser.x, laser.y, tamanho_da_nave / 15, 0, Math.PI * 2, false)
         context.fill()
     }
     else {
         context.fillStyle = "orangered"
         context.beginPath()
         context.arc(laser.x, laser.y, nave.r * 0.75, 0, Math.PI * 2, false)
         context.fill()

         context.fillStyle = "salmon"
         context.beginPath()
         context.arc(laser.x, laser.y, nave.r * 0.5, 0, Math.PI * 2, false)
         context.fill()

         context.fillStyle = "pink"
         context.beginPath()
         context.arc(laser.x, laser.y, nave.r * 0.25, 0, Math.PI * 2, false)
         context.fill()
     }
 }

 nave.lasers.map(desenhaLasers)  

 ////// movimento dos lasers
 const movimentoLasers = (laser) => {
     // checa a distacia do movimento do laser
     if (laser.distancia > distancia_do_laser * canvas.width) {
         nave.lasers.splice(nave.lasers.indexOf(laser), 1)
     }

     // movimenta o laser
     //laser.x += laser.velocidade_x
     //laser.y += laser.velocidade_y

     // explosao do laser
     if (laser.tempoDeExplosao > 0) {
         laser.tempoDeExplosao--

         // destruir o laser depois do tempo de explosão ter sido percorrido
         if (laser.tempoDeExplosao == 0) {
             nave.lasers.splice(nave.lasers.indexOf(laser), 1)
         }
     }
     else {
         // movimenta o laser
         laser.x += laser.velocidade_x
         laser.y += laser.velocidade_y

          // calcula a distancia do movimento dos lasers
         laser.distancia += Math.sqrt(Math.pow(laser.velocidade_x, 2) + Math.pow(laser.velocidade_y, 2))
     }

     // calcula a distancia do movimento dos lasers
     //laser.distancia += Math.sqrt(Math.pow(laser.velocidade_x, 2) + Math.pow(laser.velocidade_y, 2))

     // borda do jogo, impede que os lasers saiam do frame
     if (laser.x < 0) {
         laser.x = canvas.width
     }
     else if (laser.x > canvas.width){
         laser.x = 0
     } 
     if (laser.y < 0) {
         laser.y = canvas.height
     }
     else if (laser.y > canvas.height){
         laser.y = 0
     } 
 }

 nave.lasers.map(movimentoLasers)

 ////// cria o desenho dos asteroides
 // A funcão "desenhaAsteroides" recebe um registro. Aplicada essa função por um map à uma lista de registros contendo as informações dos asteroides, ela desenha um por vez.
 context.strokeStyle = "slategray"
 context.lineWidth = tamanho_da_nave / 2

 const desenhaAsteroides = (quantidadeDeAsteroides) => {
     context.strokeStyle = "slategray"
     context.lineWidth = tamanho_da_nave / 2

     const primeiro = quantidadeDeAsteroides
     // coordenadas do asteroide
     const x = primeiro.x
     const y = primeiro.y
     const r = primeiro.r
     const a = primeiro.a
     const vertices = primeiro.vertices

     // desenho
     context.strokeStyle = "slategray"
     context.lineWidth = tamanho_da_nave / 20
     context.beginPath()
     context.moveTo(
         x + r * Math.cos(a),
         y + r * Math.sin(a)
     )
     const conectarLinhas = (numeroVertices, controle=0) => {
         if (controle > numeroVertices) 
             return 0
         else {
             context.lineTo(
                 x + r * Math.cos(a + controle * Math.PI * 2 / numeroVertices),
                 y + r * Math.sin(a + controle * Math.PI * 2 / numeroVertices)
             )
             return conectarLinhas(numeroVertices, controle+1)
         }
     }
     conectarLinhas(vertices)
     context.closePath()
     context.stroke()
     }

     asteroides.map(desenhaAsteroides)

     /////// movimento dos asteroides
     const movimentoAsteroides = (asteroid) => {
         asteroid.x += asteroid.velocidade_x
         asteroid.y += asteroid.velocidade_y

         // bordas do jogo, impede que os asteroides saiam do frame
         if (asteroid.x < 0 - asteroid.r) {
             asteroid.x = canvas.width + asteroid.r
         }
         else if (asteroid.x > canvas.width + asteroid.r) {
             asteroid.x = 0 - asteroid.r
         }
         if (asteroid.y < 0 - asteroid.r) {
             asteroid.y = canvas.height + asteroid.r
         }
         else if (asteroid.y > canvas.height + asteroid.r) {
             asteroid.y = 0 - asteroid.r
         }
     }

     asteroides.map(movimentoAsteroides)

     ////// checar colisoes
     const checarColisoes = (asteroid) => {
         if (distanciaEntreObjetos(nave.x, nave.y, asteroid.x, asteroid.y) < nave.r + asteroid.r)
             explodirNave()
     }


     ////// nave
     if (!naveExplodindo && nave.status) { 
         if (nave.numeroDoPisca == 0) { // nao checa as colisoes se a nave estiver piscando(invisivel)
             asteroides.map(checarColisoes)
         }
     
     ////// rotacao da nave 
     nave.a += nave.rot

     ////// movimentação da nave
     nave.x += nave.movimento.x
     nave.y += nave.movimento.y
     } 
     else {
         nave.tempoDeExplosao--

         if (nave.tempoDeExplosao == 0 && vidas > 0) {
            nave = novaNave()
            vidas--
         } 
         else if (vidas == 0) {
            gameOver()
         }
     }

     ////// detecta se a nave continua viva e o numero de asteroides, se o numero de asteroides for 0, o jogador ganha
     if (asteroides.length == 0 && nave.status) 
        win()

     ////// detectar colisoes de lasers e asteroides
     // Utilizei de laços para facilitar na detecção
     for (var i = asteroides.length - 1; i >= 0; i--) {
         // recebe as coordenadas dos asteroides
         var ax = asteroides[i].x
         var ay = asteroides[i].y
         var ar = asteroides[i].r

         // loop de analise dos lasers
         for (var j = nave.lasers.length - 1; j >= 0; j--) {
             // recebe as coordenadas dos lasers
             var lx = nave.lasers[j].x
             var ly = nave.lasers[j].y

             // detectar as colisões
             if (nave.lasers[j].tempoDeExplosao == 0 && distanciaEntreObjetos(ax, ay, lx, ly) < ar) {
                 // deleta o asteroide e ativa a explosao do laser
                 destruirAsteroide(i)
                 nave.lasers[j].tempoDeExplosao = Math.ceil(duracao_da_explosao_do_laser * FPS)
                 break;
             }
         }
     } 
 } 

setInterval(atualizacao, 1/FPS)