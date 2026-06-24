class Chess {
    constructor() {
        this.board = this.initializeBoard();
        this.currentPlayer = 'white';
        this.moveHistory = [];
        this.selectedSquare = null;
        this.validMoves = [];
    }

    initializeBoard() {
        const board = Array(8).fill(null).map(() => Array(8).fill(null));

        // Schwarze Figuren
        board[0][0] = { type: 'rook', color: 'black' };
        board[0][1] = { type: 'knight', color: 'black' };
        board[0][2] = { type: 'bishop', color: 'black' };
        board[0][3] = { type: 'queen', color: 'black' };
        board[0][4] = { type: 'king', color: 'black' };
        board[0][5] = { type: 'bishop', color: 'black' };
        board[0][6] = { type: 'knight', color: 'black' };
        board[0][7] = { type: 'rook', color: 'black' };

        for (let i = 0; i < 8; i++) {
            board[1][i] = { type: 'pawn', color: 'black' };
        }

        // Weiße Figuren
        for (let i = 0; i < 8; i++) {
            board[6][i] = { type: 'pawn', color: 'white' };
        }

        board[7][0] = { type: 'rook', color: 'white' };
        board[7][1] = { type: 'knight', color: 'white' };
        board[7][2] = { type: 'bishop', color: 'white' };
        board[7][3] = { type: 'queen', color: 'white' };
        board[7][4] = { type: 'king', color: 'white' };
        board[7][5] = { type: 'bishop', color: 'white' };
        board[7][6] = { type: 'knight', color: 'white' };
        board[7][7] = { type: 'rook', color: 'white' };

        return board;
    }

    getPieceEmoji(piece) {
        const emojis = {
            white: {
                king: '♔',
                queen: '♕',
                rook: '♖',
                bishop: '♗',
                knight: '♘',
                pawn: '♙'
            },
            black: {
                king: '♚',
                queen: '♛',
                rook: '♜',
                bishop: '♝',
                knight: '♞',
                pawn: '♟'
            }
        };
        return emojis[piece.color][piece.type];
    }

    isValidSquare(row, col) {
        return row >= 0 && row < 8 && col >= 0 && col < 8;
    }

    getValidMoves(row, col) {
        const piece = this.board[row][col];
        if (!piece) return [];

        const moves = [];

        switch (piece.type) {
            case 'pawn':
                moves.push(...this.getPawnMoves(row, col));
                break;
            case 'knight':
                moves.push(...this.getKnightMoves(row, col));
                break;
            case 'bishop':
                moves.push(...this.getBishopMoves(row, col));
                break;
            case 'rook':
                moves.push(...this.getRookMoves(row, col));
                break;
            case 'queen':
                moves.push(...this.getQueenMoves(row, col));
                break;
            case 'king':
                moves.push(...this.getKingMoves(row, col));
                break;
        }

        return moves.filter(move => this.isLegalMove(row, col, move.row, move.col));
    }

    getPawnMoves(row, col) {
        const moves = [];
        const direction = this.board[row][col].color === 'white' ? -1 : 1;
        const startRow = this.board[row][col].color === 'white' ? 6 : 1;

        // Vorwärts eine Feld
        const nextRow = row + direction;
        if (this.isValidSquare(nextRow, col) && !this.board[nextRow][col]) {
            moves.push({ row: nextRow, col });

            // Zwei Felder vorwärts von Startposition
            if (row === startRow) {
                const twoRowsAhead = row + 2 * direction;
                if (!this.board[twoRowsAhead][col]) {
                    moves.push({ row: twoRowsAhead, col });
                }
            }
        }

        // Schlagen diagonal
        for (let colOffset of [-1, 1]) {
            const newCol = col + colOffset;
            if (this.isValidSquare(nextRow, newCol) && this.board[nextRow][newCol]) {
                if (this.board[nextRow][newCol].color !== this.board[row][col].color) {
                    moves.push({ row: nextRow, col: newCol });
                }
            }
        }

        return moves;
    }

    getKnightMoves(row, col) {
        const moves = [];
        const offsets = [
            [-2, -1], [-2, 1], [-1, -2], [-1, 2],
            [1, -2], [1, 2], [2, -1], [2, 1]
        ];

        for (let [rowOffset, colOffset] of offsets) {
            const newRow = row + rowOffset;
            const newCol = col + colOffset;
            if (this.isValidSquare(newRow, newCol)) {
                if (!this.board[newRow][newCol] ||
                    this.board[newRow][newCol].color !== this.board[row][col].color) {
                    moves.push({ row: newRow, col: newCol });
                }
            }
        }

        return moves;
    }

    getBishopMoves(row, col) {
        return this.getDiagonalMoves(row, col);
    }

    getRookMoves(row, col) {
        return this.getStraightMoves(row, col);
    }

    getQueenMoves(row, col) {
        return [...this.getStraightMoves(row, col), ...this.getDiagonalMoves(row, col)];
    }

    getKingMoves(row, col) {
        const moves = [];
        for (let r = -1; r <= 1; r++) {
            for (let c = -1; c <= 1; c++) {
                if (r === 0 && c === 0) continue;
                const newRow = row + r;
                const newCol = col + c;
                if (this.isValidSquare(newRow, newCol)) {
                    if (!this.board[newRow][newCol] ||
                        this.board[newRow][newCol].color !== this.board[row][col].color) {
                        moves.push({ row: newRow, col: newCol });
                    }
                }
            }
        }
        return moves;
    }

    getStraightMoves(row, col) {
        const moves = [];
        const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];

        for (let [rowDir, colDir] of directions) {
            for (let i = 1; i < 8; i++) {
                const newRow = row + rowDir * i;
                const newCol = col + colDir * i;
                if (!this.isValidSquare(newRow, newCol)) break;

                if (!this.board[newRow][newCol]) {
                    moves.push({ row: newRow, col: newCol });
                } else {
                    if (this.board[newRow][newCol].color !== this.board[row][col].color) {
                        moves.push({ row: newRow, col: newCol });
                    }
                    break;
                }
            }
        }
        return moves;
    }

    getDiagonalMoves(row, col) {
        const moves = [];
        const directions = [[1, 1], [1, -1], [-1, 1], [-1, -1]];

        for (let [rowDir, colDir] of directions) {
            for (let i = 1; i < 8; i++) {
                const newRow = row + rowDir * i;
                const newCol = col + colDir * i;
                if (!this.isValidSquare(newRow, newCol)) break;

                if (!this.board[newRow][newCol]) {
                    moves.push({ row: newRow, col: newCol });
                } else {
                    if (this.board[newRow][newCol].color !== this.board[row][col].color) {
                        moves.push({ row: newRow, col: newCol });
                    }
                    break;
                }
            }
        }
        return moves;
    }

    isLegalMove(fromRow, fromCol, toRow, toCol) {
        const piece = this.board[fromRow][fromCol];
        if (!piece) return false;

        // Temporär den Zug machen
        const capturedPiece = this.board[toRow][toCol];
        this.board[toRow][toCol] = piece;
        this.board[fromRow][fromCol] = null;

        // Überprüfen, ob der König im Schach steht
        const isLegal = !this.isKingInCheck(piece.color);

        // Zug rückgängig machen
        this.board[fromRow][fromCol] = piece;
        this.board[toRow][toCol] = capturedPiece;

        return isLegal;
    }

    isKingInCheck(color) {
        let kingPos = null;
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                if (this.board[r][c] && this.board[r][c].color === color &&
                    this.board[r][c].type === 'king') {
                    kingPos = [r, c];
                }
            }
        }

        if (!kingPos) return false;

        const [kingRow, kingCol] = kingPos;
        const enemyColor = color === 'white' ? 'black' : 'white';

        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                const piece = this.board[r][c];
                if (piece && piece.color === enemyColor) {
                    const moves = this.getMovesIgnoringCheck(r, c);
                    if (moves.some(m => m.row === kingRow && m.col === kingCol)) {
                        return true;
                    }
                }
            }
        }

        return false;
    }

    getMovesIgnoringCheck(row, col) {
        const piece = this.board[row][col];
        if (!piece) return [];

        const moves = [];
        switch (piece.type) {
            case 'pawn':
                moves.push(...this.getPawnMoves(row, col));
                break;
            case 'knight':
                moves.push(...this.getKnightMoves(row, col));
                break;
            case 'bishop':
                moves.push(...this.getBishopMoves(row, col));
                break;
            case 'rook':
                moves.push(...this.getRookMoves(row, col));
                break;
            case 'queen':
                moves.push(...this.getQueenMoves(row, col));
                break;
            case 'king':
                moves.push(...this.getKingMoves(row, col));
                break;
        }
        return moves;
    }

    movePiece(fromRow, fromCol, toRow, toCol) {
        const piece = this.board[fromRow][fromCol];
        const captured = this.board[toRow][toCol];

        this.board[toRow][toCol] = piece;
        this.board[fromRow][fromCol] = null;

        const notation = `${String.fromCharCode(97 + fromCol)}${8 - fromRow} → ${String.fromCharCode(97 + toCol)}${8 - toRow}`;
        this.moveHistory.push({
            from: { row: fromRow, col: fromCol },
            to: { row: toRow, col: toCol },
            piece: piece,
            captured: captured,
            notation: notation
        });

        this.currentPlayer = this.currentPlayer === 'white' ? 'black' : 'white';
    }

    undo() {
        if (this.moveHistory.length === 0) return false;

        const lastMove = this.moveHistory.pop();
        this.board[lastMove.from.row][lastMove.from.col] = lastMove.piece;
        this.board[lastMove.to.row][lastMove.to.col] = lastMove.captured;
        this.currentPlayer = this.currentPlayer === 'white' ? 'black' : 'white';

        return true;
    }

    reset() {
        this.board = this.initializeBoard();
        this.currentPlayer = 'white';
        this.moveHistory = [];
        this.selectedSquare = null;
        this.validMoves = [];
    }
}

class ChessUI {
    constructor() {
        this.game = new Chess();
        this.boardElement = document.getElementById('board');
        this.statusElement = document.getElementById('status');
        this.moveHistoryElement = document.getElementById('moveHistory');
        this.moveCountElement = document.getElementById('moveCount');
        this.currentPlayerElement = document.getElementById('currentPlayer');
        this.resetBtn = document.getElementById('resetBtn');
        this.undoBtn = document.getElementById('undoBtn');

        this.setupEventListeners();
        this.render();
    }

    setupEventListeners() {
        this.boardElement.addEventListener('click', (e) => this.handleBoardClick(e));
        this.resetBtn.addEventListener('click', () => this.resetGame());
        this.undoBtn.addEventListener('click', () => this.undoMove());
    }

    handleBoardClick(e) {
        const square = e.target.closest('.square');
        if (!square) return;

        const row = parseInt(square.dataset.row);
        const col = parseInt(square.dataset.col);

        if (this.game.selectedSquare) {
            const [selectedRow, selectedCol] = this.game.selectedSquare;

            if (selectedRow === row && selectedCol === col) {
                this.game.selectedSquare = null;
                this.game.validMoves = [];
            } else if (this.game.validMoves.some(m => m.row === row && m.col === col)) {
                this.game.movePiece(selectedRow, selectedCol, row, col);
                this.game.selectedSquare = null;
                this.game.validMoves = [];
                this.updateUI();
            } else {
                const piece = this.game.board[row][col];
                if (piece && piece.color === this.game.currentPlayer) {
                    this.game.selectedSquare = [row, col];
                    this.game.validMoves = this.game.getValidMoves(row, col);
                } else {
                    this.game.selectedSquare = null;
                    this.game.validMoves = [];
                }
            }
        } else {
            const piece = this.game.board[row][col];
            if (piece && piece.color === this.game.currentPlayer) {
                this.game.selectedSquare = [row, col];
                this.game.validMoves = this.game.getValidMoves(row, col);
            }
        }

        this.render();
    }

    resetGame() {
        this.game.reset();
        this.render();
        this.updateUI();
    }

    undoMove() {
        if (this.game.undo()) {
            this.game.selectedSquare = null;
            this.game.validMoves = [];
            this.render();
            this.updateUI();
        }
    }

    render() {
        this.boardElement.innerHTML = '';

        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const square = document.createElement('div');
                square.className = 'square';
                square.dataset.row = row;
                square.dataset.col = col;

                const isLight = (row + col) % 2 === 0;
                square.classList.add(isLight ? 'light' : 'dark');

                const piece = this.game.board[row][col];

                if (this.game.selectedSquare &&
                    this.game.selectedSquare[0] === row &&
                    this.game.selectedSquare[1] === col) {
                    square.classList.add('selected');
                }

                if (this.game.validMoves.some(m => m.row === row && m.col === col)) {
                    const isCapture = !!this.game.board[row][col];
                    square.classList.add(isCapture ? 'valid-capture' : 'valid-move');
                }

                if (this.game.moveHistory.length > 0) {
                    const lastMove = this.game.moveHistory[this.game.moveHistory.length - 1];
                    if ((lastMove.from.row === row && lastMove.from.col === col) ||
                        (lastMove.to.row === row && lastMove.to.col === col)) {
                        square.classList.add('highlight');
                    }
                }

                if (piece) {
                    const pieceElement = document.createElement('div');
                    pieceElement.className = 'piece';
                    pieceElement.textContent = this.game.getPieceEmoji(piece);
                    square.appendChild(pieceElement);
                }

                this.boardElement.appendChild(square);
            }
        }
    }

    updateUI() {
        const playerName = this.game.currentPlayer === 'white' ? 'Weiß' : 'Schwarz';
        this.statusElement.textContent = `${playerName} ist am Zug`;
        this.currentPlayerElement.textContent = playerName;
        this.moveCountElement.textContent = Math.ceil(this.game.moveHistory.length / 2);

        this.moveHistoryElement.innerHTML = '';
        this.game.moveHistory.forEach((move, index) => {
            const moveItem = document.createElement('div');
            moveItem.className = 'move-item';
            moveItem.textContent = `${index + 1}. ${move.notation}`;
            this.moveHistoryElement.appendChild(moveItem);
        });

        this.moveHistoryElement.scrollTop = this.moveHistoryElement.scrollHeight;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ChessUI();
});
