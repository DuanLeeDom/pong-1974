/* Constantes do Jogo */
const VELOCIDADE_BASE = 4; // Velocidade inicial da bola
const VELOCIDADE_INICIAL = 2; // Velocidade mínima da bola
const VELOCIDADE_MAXIMA = 10; // Velocidade máxima da bola
const VELOCIDADE_RAQUETE = 10; // Velocidade de movimento das raquetes
const LIMITE_PONTUACAO = 100; // Pontuação máxima (não usada, mas mantida)
const ATRASO_REINICIO = 500; // Tempo em ms antes de reiniciar a bola
const FATOR_ANGULO_MAXIMO = 0.5; // Limita ângulo da bola para trajetórias horizontais
const MARGEM_BORDA = 4; // Ajuste para evitar vazamento na borda inferior

// Teclas de controle das raquetes
const TECLAS_CONTROLE = {
    w: false, // Move raquete esquerda para cima
    s: false, // Move raquete esquerda para baixo
    ArrowUp: false, // Move raquete direita para cima
    ArrowDown: false // Move raquete direita para baixo
};

/* Elementos do DOM */
const campo = document.getElementById("campo");
const bola = document.getElementById("bola");
const raqueteEsquerda = document.getElementById("raqueteEsquerda");
const raqueteDireita = document.getElementById("raqueteDireita");
const mensagemInicio = document.getElementById("mensagemInicio");
const coordenadasCampo = document.getElementById("coordenadasCampo");
const placarJogador1 = document.getElementById("placarJogador1");
const placarJogador2 = document.getElementById("placarJogador2");
const debugPanel = document.getElementById("debugPanel");

/* Estado do Jogo */
let jogoIniciado = false; // Indica se o jogo está ativo
let bolaEmMovimento = false; // Indica se a bola está se movendo
let modoDebug = false; // Ativa/desativa o painel de depuração
let intervaloJogo = null; // Controla o loop do jogo
let pontosJogador1 = 0; // Placar do jogador 1 (esquerda)
let pontosJogador2 = 0; // Placar do jogador 2 (direita)
let velocidadeAtual = VELOCIDADE_BASE; // Velocidade atual da bola
let velocidadeBolaX = 0; // Velocidade horizontal da bola
let velocidadeBolaY = 0; // Velocidade vertical da bola
let dimensoesCampo; // Dimensões do campo (atualizado em tempo real)
let dimensoesBola; // Posição e tamanho da bola
let dimensoesRaqueteEsquerda; // Posição e tamanho da raquete esquerda
let dimensoesRaqueteDireita; // Posição e tamanho da raquete direita

/* Funções de Inicialização */
// Posiciona a bola e as raquetes no centro inicial
function inicializarPosicoes() {
    dimensoesCampo = campo.getBoundingClientRect();
    const alturaCampo = dimensoesCampo.height;
    const larguraCampo = dimensoesCampo.width;
    const alturaRaquete = raqueteEsquerda.offsetHeight;

    // Centraliza as raquetes verticalmente
    const posicaoVerticalRaquete = (alturaCampo - alturaRaquete) / 2;
    raqueteEsquerda.style.top = posicaoVerticalRaquete + "px";
    raqueteDireita.style.top = posicaoVerticalRaquete + "px";

    // Centraliza a bola
    centralizarBola();
}

// Coloca a bola no centro do campo
function centralizarBola() {
    dimensoesCampo = campo.getBoundingClientRect();
    bola.style.left = (dimensoesCampo.width / 2 - bola.offsetWidth / 2) + "px";
    bola.style.top = (dimensoesCampo.height / 2 - bola.offsetHeight / 2) + "px";
}

/* Funções de Movimento */
// Move as raquetes com base nas teclas pressionadas
function moverRaquetesDosJogadores() {
    dimensoesCampo = campo.getBoundingClientRect();
    const alturaRaquete = raqueteEsquerda.offsetHeight;
    const limiteSuperior = 0;
    const limiteInferior = dimensoesCampo.height - alturaRaquete - MARGEM_BORDA;

    // Move raquete esquerda (teclas W e S)
    let posicaoEsquerda = parseFloat(raqueteEsquerda.style.top) || 0;
    if (TECLAS_CONTROLE.w) posicaoEsquerda -= VELOCIDADE_RAQUETE;
    if (TECLAS_CONTROLE.s) posicaoEsquerda += VELOCIDADE_RAQUETE;
    posicaoEsquerda = Math.max(limiteSuperior, Math.min(posicaoEsquerda, limiteInferior));
    raqueteEsquerda.style.top = posicaoEsquerda + "px";

    // Move raquete direita (teclas ↑ e ↓)
    let posicaoDireita = parseFloat(raqueteDireita.style.top) || 0;
    if (TECLAS_CONTROLE.ArrowUp) posicaoDireita -= VELOCIDADE_RAQUETE;
    if (TECLAS_CONTROLE.ArrowDown) posicaoDireita += VELOCIDADE_RAQUETE;
    posicaoDireita = Math.max(limiteSuperior, Math.min(posicaoDireita, limiteInferior));
    raqueteDireita.style.top = posicaoDireita + "px";
}

// Move a bola e verifica colisões
function moverBolaNoCampo() {
    if (!bolaEmMovimento) return;

    // Atualiza posição da bola
    let posicaoX = parseFloat(bola.style.left) + velocidadeBolaX;
    let posicaoY = parseFloat(bola.style.top) + velocidadeBolaY;
    bola.style.left = posicaoX + "px";
    bola.style.top = posicaoY + "px";

    // Atualiza dimensões para verificar colisões
    dimensoesBola = bola.getBoundingClientRect();

    // Verifica colisão com bordas superior e inferior
    if (colidiuComBordaSuperior() || colidiuComBordaInferior()) {
        velocidadeBolaY = -velocidadeBolaY; // Inverte direção vertical
        posicaoY = colidiuComBordaSuperior() ? 0 : dimensoesCampo.bottom - bola.offsetHeight - dimensoesCampo.top;
        bola.style.top = posicaoY + "px";
    }

    // Verifica se a bola saiu pela esquerda (ponto para jogador 2)
    if (colidiuComBordaEsquerda()) {
        pontosJogador2++;
        placarJogador2.textContent = pontosJogador2;
        reiniciarBolaParaJogador("jogador2");
        return;
    }

    // Verifica se a bola saiu pela direita (ponto para jogador 1)
    if (colidiuComBordaDireita()) {
        pontosJogador1++;
        placarJogador1.textContent = pontosJogador1;
        reiniciarBolaParaJogador("jogador1");
        return;
    }

    // Verifica colisão com raquetes
    verificarColisaoComRaquetes();
}

// Verifica se a bola colidiu com a borda superior
function colidiuComBordaSuperior() {
    return dimensoesBola.top <= dimensoesCampo.top;
}

// Verifica se a bola colidiu com a borda inferior
function colidiuComBordaInferior() {
    return dimensoesBola.bottom >= dimensoesCampo.bottom;
}

// Verifica se a bola saiu pela borda esquerda
function colidiuComBordaEsquerda() {
    return dimensoesBola.left <= dimensoesCampo.left;
}

// Verifica se a bola saiu pela borda direita
function colidiuComBordaDireita() {
    return dimensoesBola.right >= dimensoesCampo.right;
}

// Verifica colisão da bola com as raquetes
function verificarColisaoComRaquetes() {
    // Colisão com raquete esquerda
    if (
        velocidadeBolaX < 0 &&
        dimensoesBola.left <= dimensoesRaqueteEsquerda.right &&
        dimensoesBola.right >= dimensoesRaqueteEsquerda.left &&
        dimensoesBola.bottom >= dimensoesRaqueteEsquerda.top &&
        dimensoesBola.top <= dimensoesRaqueteEsquerda.bottom
    ) {
        bola.style.left = (dimensoesRaqueteEsquerda.right - dimensoesCampo.left + 1) + "px";
        velocidadeBolaX = Math.abs(velocidadeBolaX) * 1.1; // Inverte e aumenta velocidade
        ajustarAnguloAposColisao(dimensoesRaqueteEsquerda);
        velocidadeAtual = Math.min(velocidadeAtual * 1.1, VELOCIDADE_MAXIMA);
    }

    // Colisão com raquete direita
    if (
        velocidadeBolaX > 0 &&
        dimensoesBola.right >= dimensoesRaqueteDireita.left &&
        dimensoesBola.left <= dimensoesRaqueteDireita.right &&
        dimensoesBola.bottom >= dimensoesRaqueteDireita.top &&
        dimensoesBola.top <= dimensoesRaqueteDireita.bottom
    ) {
        bola.style.left = (dimensoesRaqueteDireita.left - dimensoesBola.width - dimensoesCampo.left - 1) + "px";
        velocidadeBolaX = -Math.abs(velocidadeBolaX) * 1.1; // Inverte e aumenta velocidade
        ajustarAnguloAposColisao(dimensoesRaqueteDireita);
        velocidadeAtual = Math.min(velocidadeAtual * 1.1, VELOCIDADE_MAXIMA);
    }
}

// Ajusta o ângulo da bola após colisão com uma raquete
function ajustarAnguloAposColisao(raquete) {
    const centroRaquete = raquete.top + raquete.height / 2;
    const posicaoBola = dimensoesBola.top + dimensoesBola.height / 2;
    velocidadeBolaY += (posicaoBola - centroRaquete) * 0.05; // Ajusta ângulo com base no ponto de colisão
}

/* Funções de Controle da Bola */
// Para a bola e a centraliza
function pararBola() {
    bolaEmMovimento = false;
    centralizarBola();
    velocidadeBolaX = 0;
    velocidadeBolaY = 0;
    bola.style.transition = "none";
}

// Inicia o movimento da bola
function iniciarMovimentoBola() {
    bolaEmMovimento = true;
    velocidadeBolaY = (Math.random() - 0.5) * VELOCIDADE_BASE * FATOR_ANGULO_MAXIMO;
}

/* Funções de Controle da Bola */
// Reinicia a bola após um ponto, enviando-a ao perdedor
function reiniciarBolaParaJogador(ultimoPontuador) {
    centralizarBola();
    velocidadeAtual = VELOCIDADE_BASE; // Redefine a velocidade para o valor base
    velocidadeBolaX = (ultimoPontuador === "jogador1" ? 1 : -1) * velocidadeAtual;
    velocidadeBolaY = (Math.random() - 0.5) * velocidadeAtual * FATOR_ANGULO_MAXIMO;
    bolaEmMovimento = false;
    setTimeout(() => {
        iniciarMovimentoBola();
    }, ATRASO_REINICIO);
}

/* Funções de Controle do Jogo */
// Inicia o loop principal do jogo
function iniciarJogo() {
    pararJogo();
    intervaloJogo = setInterval(() => {
        atualizarDimensoes();
        moverRaquetesDosJogadores();
        if (bolaEmMovimento) moverBolaNoCampo();
        atualizarPainelDebug();
    }, 1000 / 45); // 45 FPS
}

// Para o loop do jogo
function pararJogo() {
    if (intervaloJogo) {
        clearInterval(intervaloJogo);
        intervaloJogo = null;
    }
}

// Atualiza as dimensões de todos os elementos
function atualizarDimensoes() {
    dimensoesCampo = campo.getBoundingClientRect();
    dimensoesBola = bola.getBoundingClientRect();
    dimensoesRaqueteEsquerda = raqueteEsquerda.getBoundingClientRect();
    dimensoesRaqueteDireita = raqueteDireita.getBoundingClientRect();
}

/* Funções de Depuração */
// Atualiza o painel de depuração com informações do jogo
function atualizarPainelDebug() {
    if (!modoDebug) {
        limparDebug();
        return;
    }

    atualizarDimensoes();

    // Atualiza informações no campo
    coordenadasCampo.innerHTML = `Campo: largura=${Math.round(dimensoesCampo.width)}px, altura=${Math.round(dimensoesCampo.height)}px`;
    bola.setAttribute("data-debug", `x=${Math.round(dimensoesBola.left)}, y=${Math.round(dimensoesBola.top)}`);
    raqueteEsquerda.setAttribute("data-debug", `top=${Math.round(parseFloat(raqueteEsquerda.style.top) || 0)}`);
    raqueteDireita.setAttribute("data-debug", `top=${Math.round(parseFloat(raqueteDireita.style.top) || 0)}`);
    bola.classList.add("debug-text");
    raqueteEsquerda.classList.add("debug-text");
    raqueteDireita.classList.add("debug-text");

    // Atualiza painel de depuração
    if (debugPanel) {
        debugPanel.innerHTML = `
            <strong>Informações de Depuração</strong><br>
            Altura do Campo: ${Math.round(dimensoesCampo.height)}px<br>
            Altura da Raquete: ${raqueteEsquerda.offsetHeight}px<br>
            Limite Inferior: ${Math.round(dimensoesCampo.height - raqueteEsquerda.offsetHeight - MARGEM_BORDA)}px<br>
            Raquete Esquerda Top: ${Math.round(parseFloat(raqueteEsquerda.style.top) || 0)}px<br>
            Raquete Direita Top: ${Math.round(parseFloat(raqueteDireita.style.top) || 0)}px<br>
            Posição da Bola: x=${Math.round(dimensoesBola.left)}, y=${Math.round(dimensoesBola.top)}<br>
            Placar: ${pontosJogador1} - ${pontosJogador2}
        `;
        debugPanel.style.display = "block";
    }
}

// Limpa as informações de depuração
function limparDebug() {
    coordenadasCampo.innerHTML = "";
    if (debugPanel) {
        debugPanel.innerHTML = "";
        debugPanel.style.display = "none";
    }
    bola.removeAttribute("data-debug");
    raqueteEsquerda.removeAttribute("data-debug");
    raqueteDireita.removeAttribute("data-debug");
    bola.classList.remove("debug-text");
    raqueteEsquerda.classList.remove("debug-text");
    raqueteDireita.classList.remove("debug-text");
}

/* Eventos do Jogo */
// Lida com teclas pressionadas
document.addEventListener("keydown", (event) => {
    const tecla = event.key;

    // Atualiza estado das teclas de controle
    if (tecla in TECLAS_CONTROLE) {
        TECLAS_CONTROLE[tecla] = true;
    }

    // Inicia o jogo ao pressionar teclas de movimento
    if (["w", "s", "ArrowUp", "ArrowDown"].includes(tecla) && !jogoIniciado) {
        jogoIniciado = true;
        mensagemInicio.style.display = "none";
        iniciarJogo();
        velocidadeBolaX = (Math.random() < 0.5 ? -1 : 1) * VELOCIDADE_BASE;
        iniciarMovimentoBola();
    }

    // Ativa/desativa modo de depuração com 'I'
    if (tecla === "i" || tecla === "I") {
        modoDebug = !modoDebug;
        coordenadasCampo.style.display = modoDebug ? "block" : "none";
        if (debugPanel) {
            debugPanel.style.display = modoDebug ? "block" : "none";
        }
        atualizarPainelDebug();
    }

    // Reinicia o jogo com 'Escape' ou 'P'
    if (tecla === "Escape" || tecla === "p") {
        jogoIniciado = false;
        bolaEmMovimento = false;
        pontosJogador1 = 0;
        pontosJogador2 = 0;
        placarJogador1.textContent = pontosJogador1;
        placarJogador2.textContent = pontosJogador2;
        velocidadeAtual = VELOCIDADE_BASE;
        pararJogo();
        mensagemInicio.style.display = "block";
        inicializarPosicoes();
        pararBola();
    }
});

// Lida com teclas soltas
document.addEventListener("keyup", (event) => {
    if (event.key in TECLAS_CONTROLE) {
        TECLAS_CONTROLE[event.key] = false;
    }
});

// Ajusta posições ao redimensionar a janela
window.addEventListener("resize", () => {
    dimensoesCampo = campo.getBoundingClientRect();
    const alturaRaquete = raqueteEsquerda.offsetHeight;
    const limiteInferior = dimensoesCampo.height - alturaRaquete - MARGEM_BORDA;

    // Ajusta raquete esquerda
    let posicaoEsquerda = parseFloat(raqueteEsquerda.style.top) || 0;
    posicaoEsquerda = Math.max(0, Math.min(posicaoEsquerda, limiteInferior));
    raqueteEsquerda.style.top = posicaoEsquerda + "px";

    // Ajusta raquete direita
    let posicaoDireita = parseFloat(raqueteDireita.style.top) || 0;
    posicaoDireita = Math.max(0, Math.min(posicaoDireita, limiteInferior));
    raqueteDireita.style.top = posicaoDireita + "px";

    // Centraliza a bola se não estiver em movimento
    if (!bolaEmMovimento) {
        centralizarBola();
    }
});

/* Inicialização do Jogo */
inicializarPosicoes();
placarJogador1.textContent = pontosJogador1;
placarJogador2.textContent = pontosJogador2;