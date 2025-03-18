// Objeto `state` armazena todos os dados relacionados ao estado do jogo, dividido em duas partes: `view` e `values`.
const state = {
    // Contém os elementos DOM que serão manipulados na interface do usuário.
    view: {
        squares: document.querySelectorAll(".square"),  // Todos os quadrados da tela, onde o "inimigo" aparecerá.
        timeLeft: document.getElementById("time-left"), // Elemento que mostra o tempo restante.
        score: document.getElementById("score"),        // Elemento que exibe o placar do jogador.
    },
    // Contém os valores e estados do jogo, como a pontuação, tempo restante e posição do "inimigo".
    values: {
        gameVelocity: 1000,          // Velocidade do jogo, controla a frequência de atualização do "inimigo".
        hitPosition: 0,              // Posição do quadrado que está sendo atingido (com a classe "enemy").
        result: 0,                   // Resultado (placar) do jogador.
        currentTime: 60,             // Tempo inicial do jogo (60 segundos).
    },
};

// Variáveis globais para armazenar os intervalos (timers) que controlam a atualização do jogo.
let timerId, countDownTimerId;

// Função que faz a contagem regressiva do tempo e exibe o tempo restante na tela.
// Quando o tempo acaba, limpa os intervalos e exibe a mensagem de "Game Over".
function countDown() {
    state.values.currentTime--; // Decrementa o tempo restante por 1 segundo.
    state.view.timeLeft.textContent = state.values.currentTime; // Atualiza o texto do tempo na tela.

    // Se o tempo atingir 0, finaliza o jogo.
    if (state.values.currentTime <= 0) {
        clearInterval(countDownTimerId); // Limpa o intervalo da contagem regressiva.
        clearInterval(timerId); // Limpa o intervalo da atualização do "inimigo".
        alert("Game Over! O seu resultado foi: " + state.values.result); // Exibe o resultado final.
    }
}

// Função que toca o som correspondente ao evento.
function playSound(audioName) {
    let audio = new Audio(`./src/audios/${audioName}.m4a`); // Cria um objeto de áudio com o arquivo especificado.
    audio.volume = 0.2; // Define o volume do áudio.
    audio.play(); // Toca o áudio.
}

// Função que escolhe aleatoriamente um quadrado para ser marcado como "inimigo".
function randomSquare() {
    // Remove a classe "enemy" de todos os quadrados para garantir que apenas um quadrado tenha essa classe.
    state.view.squares.forEach((square) => {
        square.classList.remove("enemy");
    });

    // Gera um número aleatório entre 0 e o número de quadrados disponíveis.
    let randomNumber = Math.floor(Math.random() * state.view.squares.length);
    let randomSquare = state.view.squares[randomNumber]; // Obtém o quadrado aleatório.

    // Adiciona a classe "enemy" ao quadrado aleatório e armazena a posição do "inimigo".
    randomSquare.classList.add("enemy");
    state.values.hitPosition = randomSquare.id; // Armazena a id do quadrado como a posição do "inimigo".
}

// Função que adiciona um ouvinte de eventos a cada quadrado para detectar o clique do jogador.
function addListenerHitBox() {
    // Para cada quadrado, adiciona um evento de clique.
    state.view.squares.forEach((square) => {
        square.addEventListener("mousedown", () => {
            // Se o quadrado clicado for o que está marcado como "inimigo", incrementa a pontuação.
            if (square.id === state.values.hitPosition) {
                state.values.result++; // Aumenta a pontuação do jogador.
                state.view.score.textContent = state.values.result; // Atualiza o placar na tela.
                state.values.hitPosition = null; // Reseta a posição do "inimigo" após o acerto.
                playSound("hit"); // Toca o som de acerto.
            }
        });
    });
}

// Função que inicializa o jogo. Define os intervalos e começa o jogo.
function initialize() {
    addListenerHitBox(); // Adiciona o ouvinte de eventos para os quadrados.

    // Define os intervalos para a função `randomSquare` e `countDown`.
    timerId = setInterval(randomSquare, state.values.gameVelocity); // Atualiza o "inimigo" a cada `gameVelocity` milissegundos.
    countDownTimerId = setInterval(countDown, 1000); // Atualiza o tempo a cada 1 segundo.
}

// Aguarda o carregamento completo do DOM antes de iniciar o jogo.
document.addEventListener("DOMContentLoaded", initialize);
