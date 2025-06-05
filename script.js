document.addEventListener('DOMContentLoaded', () => {
    // Elementos do DOM
    const board = document.getElementById('board');
    const cells = document.querySelectorAll('.cell');
    const playerXName = document.querySelector('.player-x .player-name');
    const playerOName = document.querySelector('.player-o .player-name');
    const message = document.getElementById('message');
    const scoreX = document.getElementById('score-x');
    const scoreO = document.getElementById('score-o');
    const scoreTie = document.getElementById('score-tie');
    const restartBtn = document.getElementById('restart');
    const newGameBtn = document.getElementById('new-game');
    
    // Estado do jogo
    let currentPlayer = 'X';
    let gameBoard = ['', '', '', '', '', '', '', '', ''];
    let gameActive = true;
    let scores = {
        x: 0,
        o: 0,
        tie: 0
    };
    
    // Combinações vencedoras
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // linhas
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // colunas
        [0, 4, 8], [2, 4, 6]             // diagonais
    ];
    
    // Funções
    function handleCellClick(e) {
        const cell = e.target;
        const index = parseInt(cell.getAttribute('data-index'));
        
        // Verifica se a célula já foi preenchida ou se o jogo acabou
        if (gameBoard[index] !== '' || !gameActive) {
            return;
        }
        
        // Atualiza o tabuleiro e a interface
        gameBoard[index] = currentPlayer;
        cell.textContent = currentPlayer;
        cell.classList.add(currentPlayer.toLowerCase());
        
        // Verifica se houve vitória ou empate
        if (checkWin(currentPlayer)) {
            endGame(false);
            showMessage(`Jogador ${currentPlayer} venceu!`);
            updateScore(currentPlayer);
            highlightWinCells();
        } else if (isBoardFull()) {
            endGame(true);
            showMessage('Empate!');
            updateScore('tie');
        } else {
            // Alterna para o próximo jogador
            switchPlayer();
            showMessage(`É a vez do jogador ${currentPlayer}!`);
        }
    }
    
    function switchPlayer() {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        playerXName.classList.toggle('active', currentPlayer === 'X');
        playerOName.classList.toggle('active', currentPlayer === 'O');
    }
    
    function checkWin(player) {
        return winPatterns.some(pattern => {
            return pattern.every(index => {
                return gameBoard[index] === player;
            });
        });
    }
    
    function isBoardFull() {
        return gameBoard.every(cell => cell !== '');
    }
    
    function endGame(isTie) {
        gameActive = false;
        if (!isTie) {
            // Adiciona a classe 'winner' às células vencedoras
            const winPattern = winPatterns.find(pattern => 
                pattern.every(index => gameBoard[index] === currentPlayer)
            );
            
            if (winPattern) {
                winPattern.forEach(index => {
                    cells[index].classList.add('winner');
                });
            }
        }
    }
    
    function highlightWinCells() {
        const winPattern = winPatterns.find(pattern => 
            pattern.every(index => gameBoard[index] === currentPlayer)
        );
        
        if (winPattern) {
            winPattern.forEach(index => {
                cells[index].classList.add('winner');
            });
        }
    }
    
    function showMessage(text) {
        message.textContent = text;
        message.classList.add('show');
        
        setTimeout(() => {
            message.classList.remove('show');
        }, 3000);
    }
    
    function updateScore(result) {
        if (result === 'X') {
            scores.x++;
            scoreX.textContent = scores.x;
        } else if (result === 'O') {
            scores.o++;
            scoreO.textContent = scores.o;
        } else {
            scores.tie++;
            scoreTie.textContent = scores.tie;
        }
    }
     
    function resetBoard() {
        gameBoard = ['', '', '', '', '', '', '', '', ''];
        gameActive = true;
        
        cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('x', 'o', 'winner');
        });
        
        // Garante que o jogador X começa
        if (currentPlayer !== 'X') {
            switchPlayer();
        }
        
        showMessage(`É a vez do jogador ${currentPlayer}!`);
    }
    
    function resetGame() {
        resetBoard();
        scores = { x: 0, o: 0, tie: 0 };
        scoreX.textContent = '0';
        scoreO.textContent = '0';
        scoreTie.textContent = '0';
    }
    
    // Event Listeners
    cells.forEach(cell => {
        cell.addEventListener('click', handleCellClick);
    });
    
    restartBtn.addEventListener('click', resetBoard);
    newGameBtn.addEventListener('click', resetGame);
    
    // Inicialização
    showMessage('É a vez do jogador X!');
});
