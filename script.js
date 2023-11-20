window.addEventListener('DOMContentLoaded', () => {
    const tiles = Array.from(document.querySelectorAll('.tile'));
    const playerDisplay = document.querySelector('.display-player');
    const resetButton = document.querySelector('#reset');
    const announcer = document.querySelector('.announcer');

    let board = ['', '', '', '', '', '', '', '', ''];
    let currentPlayer = 'X';
    let isGameActive = true;

    const PLAYER_X = 'Player X';
    const PLAYER_O = 'Player O';
    const TIE = 'TIE';

    const winningConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    function handleResultValidation() {
        for (let i = 0; i < winningConditions.length; i++) {
            const [a, b, c] = winningConditions[i];
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return board[a];
            }
        }

        return board.includes('') ? null : TIE;
    }

    const announce = (winner) => {
        if (winner === TIE) {
            announcer.innerText = 'Tie';
        } else {
            announcer.innerHTML = `${winner} Won`;
        }
        announcer.classList.remove('hide');
        isGameActive = false;
    };

    const isValidAction = (tile) => {
        return tile.innerText === '';
    };

    const updateBoard = (index, player) => {
        board[index] = player;
    }

    const changePlayer = () => {
        playerDisplay.classList.remove(`player${currentPlayer}`);
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        playerDisplay.innerText = currentPlayer;
        playerDisplay.classList.add(`player${currentPlayer}`);

        if (currentPlayer === 'O') {
            computerMove();
        }
    }

    const userAction = (tile, index) => {
        if (isValidAction(tile) && isGameActive && currentPlayer === 'X') {
            tile.innerText = currentPlayer;
            tile.classList.add(`player${currentPlayer}`);
            updateBoard(index, currentPlayer);

            const result = handleResultValidation();
            if (result) {
                announce(result);
            } else {
                changePlayer();
            }
        }
    }

    const computerMove = () => {
        if (currentPlayer === 'O' && isGameActive) {
            const bestMove = getBestMove();
            const tile = tiles[bestMove];
            
            tile.innerText = currentPlayer;
            tile.classList.add(`player${currentPlayer}`);
            updateBoard(bestMove, currentPlayer);
            
            const result = handleResultValidation();
            if (result) {
                announce(result);
            } else {
                changePlayer();
            }
        }
    }

    const minimax = (board, depth, isMaximizing) => {
        const scores = {
            'O': 1,
            'X': -1,
            'TIE': 0
        };

        const result = handleResultValidation();
        if (result !== null) {
            return scores[result] * (depth + 1); // Adjust score based on depth
        }

        if (isMaximizing) {
            let bestScore = -Infinity;

            for (let i = 0; i < 9; i++) {
                if (board[i] === '') {
                    board[i] = 'O';
                    let score = minimax(board, depth + 1, false);
                    board[i] = '';
                    bestScore = Math.max(score, bestScore);
                }
            }

            return bestScore;
        } else {
            let bestScore = Infinity;

            for (let i = 0; i < 9; i++) {
                if (board[i] === '') {
                    board[i] = 'X';
                    let score = minimax(board, depth + 1, true);
                    board[i] = '';
                    bestScore = Math.min(score, bestScore);
                }
            }

            return bestScore;
        }
    }

    const getBestMove = () => {
        let bestScore = -Infinity;
        let bestMove = -1;

        for (let i = 0; i < 9; i++) {
            if (board[i] === '') {
                board[i] = 'O';
                let score = minimax(board, 0, false);
                board[i] = '';

                if (score > bestScore) {
                    bestScore = score;
                    bestMove = i;
                }
            }
        }

        return bestMove;
    }

    const resetBoard = () => {
        board = ['', '', '', '', '', '', '', '', ''];
        isGameActive = true;
        announcer.classList.add('hide');

        if (currentPlayer === 'O') {
            changePlayer();
        }

        tiles.forEach(tile => {
            tile.innerText = '';
            tile.classList.remove('playerX');
            tile.classList.remove('playerO');
        });
    }

    tiles.forEach((tile, index) => {
        tile.addEventListener('click', () => userAction(tile, index));
    });

    resetButton.addEventListener('click', resetBoard);
});

