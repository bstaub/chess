const OPENINGS = [
    {
        name: 'Italienische Partie',
        goal: 'Schnelle Entwicklung mit Kontrolle über die Mitte. König zu e4, Lc4 ansteuern.',
        moves: ['e2-e4', 'e7-e5', 'g1-f3', 'b8-c6', 'f1-c4', 'f8-c5', 'c2-c3', 'g8-f6', 'd2-d4', 'e5xd4']
    },
    {
        name: 'Spanische Partie (Ruy Lopez)',
        goal: 'Klassische Eröffnung mit Druck auf die Mitte. Kontrolle über e5 und schwache Punkte.',
        moves: ['e2-e4', 'e7-e5', 'g1-f3', 'b8-c6', 'f1-b5', 'a7-a6', 'b5-a4', 'g8-f6', 'e1-g1', 'f8-e7']
    },
    {
        name: 'Skandinavische Verteidigung',
        goal: 'Zentraler Gegenschlag. Schwarzer Gegenangriff auf d4 gleich nach e4.',
        moves: ['e2-e4', 'd7-d5', 'e4xd5', 'd8xd5', 'b1-c3', 'd5-d8', 'g1-f3', 'c7-c6', 'f1-c4', 'c8-f5']
    },
    {
        name: 'Französische Verteidigung',
        goal: 'Solide Struktur mit langfristigen Plänen. e6 stärkt das Zentrum.',
        moves: ['e2-e4', 'e7-e6', 'd2-d4', 'd7-d5', 'b1-c3', 'g8-f6', 'c1-g5', 'f8-e7', 'e4xd5', 'e6xd5']
    },
    {
        name: 'Sizilianische Verteidigung',
        goal: 'Asymmetrische und aggressive Verteidigung. Komplexes Spiel mit vielen Nuancen.',
        moves: ['e2-e4', 'c7-c5', 'g1-f3', 'd7-d6', 'd2-d4', 'c5xd4', 'f3xd4', 'g8-f6', 'b1-c3', 'a7-a6']
    },
    {
        name: 'Königsgambit',
        goal: 'Opfer eines Bauern für schnelle Entwicklung und Angriff. f4 nimmt das Zentrum.',
        moves: ['e2-e4', 'e7-e5', 'f2-f4', 'e5xf4', 'g1-f3', 'g7-g5', 'h2-h4', 'g5-g4', 'f3-e5', 'd7-d5']
    },
    {
        name: 'Damengambit',
        goal: 'Kontrolle des Zentrums mit d4 und c4. Modernes und solidales System.',
        moves: ['d2-d4', 'd7-d5', 'c2-c4', 'e7-e6', 'b1-c3', 'g8-f6', 'c1-g5', 'f8-e7', 'e2-e3', 'e8-g8']
    },
    {
        name: 'Schottische Partie',
        goal: 'Zentrales Spiel mit Kontrolle. d4 nimmt e5 und d5 unter Druck.',
        moves: ['e2-e4', 'e7-e5', 'g1-f3', 'b8-c6', 'd2-d4', 'e5xd4', 'f3xd4', 'g8-f6', 'b1-c3', 'f8-e7']
    },
    {
        name: 'Philidor-Verteidigung',
        goal: 'Prophylaktisches Spiel. Schutz des e5-Feldes mit d6 statt Sd6.',
        moves: ['e2-e4', 'e7-e5', 'g1-f3', 'd7-d6', 'd2-d4', 'c7-c6', 'b1-c3', 'g8-f6', 'c1-e3', 'f8-e7']
    },
    {
        name: 'Englische Eröffnung',
        goal: 'Flexibles Spiel mit c4. Keine sofortige Konfrontation in der Mitte.',
        moves: ['c2-c4', 'e7-e5', 'g1-c3', 'g8-f6', 'g2-g3', 'd7-d6', 'f1-g2', 'f8-e7', 'e2-e4', 'e8-g8']
    }
];

class Chess {
    constructor() {
        this.board = this.initializeBoard();
        this.currentPlayer = 'white';
        this.moveHistory = [];
        this.selectedSquare = null;
        this.validMoves = [];
        this.kingMoved = { white: false, black: false };
        this.rooks = {
            white: { a1: false, h1: false },
            black: { a8: false, h8: false }
        };
        this.checkingForCheck = false;
    }

    initializeBoard() {
        const board = Array(8).fill(null).map(() => Array(8).fill(null));

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

        const nextRow = row + direction;
        if (this.isValidSquare(nextRow, col) && !this.board[nextRow][col]) {
            moves.push({ row: nextRow, col });

            if (row === startRow) {
                const twoRowsAhead = row + 2 * direction;
                if (!this.board[twoRowsAhead][col]) {
                    moves.push({ row: twoRowsAhead, col });
                }
            }
        }

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

        const color = this.board[row][col].color;
        moves.push(...this.getCastlingMoves(row, col, color));

        return moves;
    }

    getCastlingMoves(kingRow, kingCol, color) {
        const moves = [];

        if (this.kingMoved[color] || this.isKingInCheck(color)) {
            return moves;
        }

        if (color === 'white') {
            if (kingRow !== 7 || kingCol !== 4) return moves;

            if (!this.rooks.white.h1 && !this.board[7][5] && !this.board[7][6]) {
                const tempBoard = this.board.map(r => [...r]);
                this.board[7][6] = this.board[7][4];
                this.board[7][4] = null;
                if (!this.isKingInCheck(color)) {
                    moves.push({ row: 7, col: 6, castling: 'kingside' });
                }
                this.board = tempBoard;
            }

            if (!this.rooks.white.a1 && !this.board[7][1] && !this.board[7][2] && !this.board[7][3]) {
                const tempBoard = this.board.map(r => [...r]);
                this.board[7][2] = this.board[7][4];
                this.board[7][4] = null;
                if (!this.isKingInCheck(color)) {
                    moves.push({ row: 7, col: 2, castling: 'queenside' });
                }
                this.board = tempBoard;
            }
        } else {
            if (kingRow !== 0 || kingCol !== 4) return moves;

            if (!this.rooks.black.h8 && !this.board[0][5] && !this.board[0][6]) {
                const tempBoard = this.board.map(r => [...r]);
                this.board[0][6] = this.board[0][4];
                this.board[0][4] = null;
                if (!this.isKingInCheck(color)) {
                    moves.push({ row: 0, col: 6, castling: 'kingside' });
                }
                this.board = tempBoard;
            }

            if (!this.rooks.black.a8 && !this.board[0][1] && !this.board[0][2] && !this.board[0][3]) {
                const tempBoard = this.board.map(r => [...r]);
                this.board[0][2] = this.board[0][4];
                this.board[0][4] = null;
                if (!this.isKingInCheck(color)) {
                    moves.push({ row: 0, col: 2, castling: 'queenside' });
                }
                this.board = tempBoard;
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

        const capturedPiece = this.board[toRow][toCol];
        this.board[toRow][toCol] = piece;
        this.board[fromRow][fromCol] = null;

        const isLegal = !this.isKingInCheck(piece.color);

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

        const wasChecking = this.checkingForCheck;
        this.checkingForCheck = true;

        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                const piece = this.board[r][c];
                if (piece && piece.color === enemyColor) {
                    const moves = this.getMovesIgnoringCheck(r, c);
                    if (moves.some(m => m.row === kingRow && m.col === kingCol)) {
                        this.checkingForCheck = wasChecking;
                        return true;
                    }
                }
            }
        }

        this.checkingForCheck = wasChecking;
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
                if (this.checkingForCheck) {
                    moves.push(...this.getBasicKingMoves(row, col));
                } else {
                    moves.push(...this.getKingMoves(row, col));
                }
                break;
        }
        return moves;
    }

    getBasicKingMoves(row, col) {
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

    movePiece(fromRow, fromCol, toRow, toCol) {
        const piece = this.board[fromRow][fromCol];
        const captured = this.board[toRow][toCol];
        let castlingType = null;

        if (piece.type === 'king') {
            this.kingMoved[piece.color] = true;

            if (fromCol === 4 && toCol === 6) {
                const rook = this.board[fromRow][7];
                this.board[fromRow][5] = rook;
                this.board[fromRow][7] = null;
                castlingType = 'kingside';
                if (piece.color === 'white') {
                    this.rooks.white.h1 = true;
                } else {
                    this.rooks.black.h8 = true;
                }
            } else if (fromCol === 4 && toCol === 2) {
                const rook = this.board[fromRow][0];
                this.board[fromRow][3] = rook;
                this.board[fromRow][0] = null;
                castlingType = 'queenside';
                if (piece.color === 'white') {
                    this.rooks.white.a1 = true;
                } else {
                    this.rooks.black.a8 = true;
                }
            }
        }

        if (piece.type === 'rook') {
            if (piece.color === 'white') {
                if (fromRow === 7 && fromCol === 0) this.rooks.white.a1 = true;
                if (fromRow === 7 && fromCol === 7) this.rooks.white.h1 = true;
            } else {
                if (fromRow === 0 && fromCol === 0) this.rooks.black.a8 = true;
                if (fromRow === 0 && fromCol === 7) this.rooks.black.h8 = true;
            }
        }

        this.board[toRow][toCol] = piece;
        this.board[fromRow][fromCol] = null;

        const notation = `${String.fromCharCode(97 + fromCol)}${8 - fromRow}→${String.fromCharCode(97 + toCol)}${8 - toRow}`;
        this.moveHistory.push({
            from: { row: fromRow, col: fromCol },
            to: { row: toRow, col: toCol },
            piece: piece,
            captured: captured,
            notation: notation,
            castling: castlingType
        });

        this.currentPlayer = this.currentPlayer === 'white' ? 'black' : 'white';
    }

    undo() {
        if (this.moveHistory.length === 0) return false;

        const lastMove = this.moveHistory.pop();
        this.board[lastMove.from.row][lastMove.from.col] = lastMove.piece;
        this.board[lastMove.to.row][lastMove.to.col] = lastMove.captured;

        if (lastMove.piece.type === 'king') {
            this.kingMoved[lastMove.piece.color] = false;

            if (lastMove.castling === 'kingside') {
                const rook = this.board[lastMove.from.row][5];
                this.board[lastMove.from.row][7] = rook;
                this.board[lastMove.from.row][5] = null;
                if (lastMove.piece.color === 'white') {
                    this.rooks.white.h1 = false;
                } else {
                    this.rooks.black.h8 = false;
                }
            } else if (lastMove.castling === 'queenside') {
                const rook = this.board[lastMove.from.row][3];
                this.board[lastMove.from.row][0] = rook;
                this.board[lastMove.from.row][3] = null;
                if (lastMove.piece.color === 'white') {
                    this.rooks.white.a1 = false;
                } else {
                    this.rooks.black.a8 = false;
                }
            }
        }

        if (lastMove.piece.type === 'rook') {
            if (lastMove.piece.color === 'white') {
                if (lastMove.from.row === 7 && lastMove.from.col === 0) this.rooks.white.a1 = false;
                if (lastMove.from.row === 7 && lastMove.from.col === 7) this.rooks.white.h1 = false;
            } else {
                if (lastMove.from.row === 0 && lastMove.from.col === 0) this.rooks.black.a8 = false;
                if (lastMove.from.row === 0 && lastMove.from.col === 7) this.rooks.black.h8 = false;
            }
        }

        this.currentPlayer = this.currentPlayer === 'white' ? 'black' : 'white';
        return true;
    }

    reset() {
        this.board = this.initializeBoard();
        this.currentPlayer = 'white';
        this.moveHistory = [];
        this.selectedSquare = null;
        this.validMoves = [];
        this.kingMoved = { white: false, black: false };
        this.rooks = {
            white: { a1: false, h1: false },
            black: { a8: false, h8: false }
        };
        this.checkingForCheck = false;
    }

    getAllLegalMoves(color) {
        const moves = [];
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                if (this.board[r][c] && this.board[r][c].color === color) {
                    const pieceMoves = this.getValidMoves(r, c);
                    moves.push(...pieceMoves.map(m => ({ from: { r, c }, to: m })));
                }
            }
        }
        return moves;
    }

    evaluateBoard() {
        const values = { pawn: 1, knight: 3, bishop: 3, rook: 5, queen: 9, king: 0 };
        let score = 0;

        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                const piece = this.board[r][c];
                if (piece) {
                    const value = values[piece.type];
                    score += piece.color === 'white' ? value : -value;
                }
            }
        }

        return score;
    }
}

class Computer {
    constructor(difficulty) {
        this.difficulty = difficulty;
        this.depths = {
            1: 2,
            2: 2,
            3: 3,
            4: 4,
            5: 5,
            6: 6
        };
    }

    getMove(game) {
        const moves = game.getAllLegalMoves('black');
        if (moves.length === 0) return null;

        if (this.difficulty === 1) {
            return moves[Math.floor(Math.random() * moves.length)];
        }

        const depth = this.depths[this.difficulty];
        let bestMove = moves[0];
        let bestScore = -Infinity;

        for (let move of moves) {
            game.movePiece(move.from.r, move.from.c, move.to.row, move.to.col);
            const score = this.minimax(game, depth - 1, -Infinity, Infinity, true);
            game.undo();

            if (score > bestScore) {
                bestScore = score;
                bestMove = move;
            }
        }

        return bestMove;
    }

    minimax(game, depth, alpha, beta, isMaximizing) {
        if (depth === 0) {
            return game.evaluateBoard();
        }

        const moves = game.getAllLegalMoves(isMaximizing ? 'white' : 'black');

        if (moves.length === 0) {
            if (game.isKingInCheck(isMaximizing ? 'white' : 'black')) {
                return isMaximizing ? -10000 : 10000;
            }
            return 0;
        }

        if (isMaximizing) {
            let maxScore = -Infinity;
            for (let move of moves) {
                game.movePiece(move.from.r, move.from.c, move.to.row, move.to.col);
                const score = this.minimax(game, depth - 1, alpha, beta, false);
                game.undo();

                maxScore = Math.max(maxScore, score);
                alpha = Math.max(alpha, maxScore);
                if (beta <= alpha) break;
            }
            return maxScore;
        } else {
            let minScore = Infinity;
            for (let move of moves) {
                game.movePiece(move.from.r, move.from.c, move.to.row, move.to.col);
                const score = this.minimax(game, depth - 1, alpha, beta, true);
                game.undo();

                minScore = Math.min(minScore, score);
                beta = Math.min(beta, minScore);
                if (beta <= alpha) break;
            }
            return minScore;
        }
    }
}

class ChessUI {
    constructor() {
        this.game = null;
        this.computer = null;
        this.gameMode = null;
        this.currentOpening = null;
        this.openingMoveIndex = 0;
        this.computerThinking = false;
        this.showingHint = false;
        this.hintMove = null;

        this.boardElement = document.getElementById('board');
        this.statusElement = document.getElementById('status');
        this.moveHistoryElement = document.getElementById('moveHistory');
        this.moveCountElement = document.getElementById('moveCount');
        this.currentPlayerElement = document.getElementById('currentPlayer');
        this.resetBtn = document.getElementById('resetBtn');
        this.undoBtn = document.getElementById('undoBtn');
        this.helpBtn = document.getElementById('helpBtn');

        this.modeMenu = document.getElementById('modeMenu');
        this.difficultyMenu = document.getElementById('difficultyMenu');
        this.openingMenu = document.getElementById('openingMenu');
        this.gameArea = document.getElementById('gameArea');

        this.setupEventListeners();
        this.showModeMenu();
    }

    setupEventListeners() {
        document.getElementById('pvpBtn').addEventListener('click', () => this.selectPvP());
        document.getElementById('pvcBtn').addEventListener('click', () => this.selectPvC());
        document.getElementById('openingBtn').addEventListener('click', () => this.showOpeningMenu());
        document.getElementById('backBtn').addEventListener('click', () => this.showModeMenu());
        document.getElementById('openingBackBtn').addEventListener('click', () => this.showModeMenu());

        document.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const difficulty = parseInt(e.currentTarget.dataset.difficulty);
                this.startGame('pvc', difficulty);
            });
        });

        this.boardElement.addEventListener('click', (e) => this.handleBoardClick(e));
        this.resetBtn.addEventListener('click', () => this.resetGame());
        this.undoBtn.addEventListener('click', () => this.undoMove());
        this.helpBtn.addEventListener('click', () => this.showHint());
    }

    showModeMenu() {
        this.modeMenu.classList.remove('hidden');
        this.difficultyMenu.classList.add('hidden');
        this.openingMenu.classList.add('hidden');
        this.gameArea.classList.add('hidden');
    }

    selectPvP() {
        this.startGame('pvp');
    }

    selectPvC() {
        this.difficultyMenu.classList.remove('hidden');
        this.modeMenu.classList.add('hidden');
    }

    showOpeningMenu() {
        this.openingMenu.classList.remove('hidden');
        this.modeMenu.classList.add('hidden');
        const grid = document.getElementById('openingGrid');
        grid.innerHTML = '';

        OPENINGS.forEach((opening, index) => {
            const card = document.createElement('div');
            card.className = 'opening-card';
            card.innerHTML = `
                <div class="opening-name">${opening.name}</div>
                <div class="opening-goal">${opening.goal}</div>
            `;
            card.addEventListener('click', () => this.startOpening(index));
            grid.appendChild(card);
        });
    }

    startGame(mode, difficulty = null) {
        this.gameMode = mode;
        this.game = new Chess();
        this.currentOpening = null;
        this.openingMoveIndex = 0;
        this.showingHint = false;
        this.hintMove = null;

        if (mode === 'pvc') {
            this.computer = new Computer(difficulty);
        } else {
            this.computer = null;
        }

        this.modeMenu.classList.add('hidden');
        this.difficultyMenu.classList.add('hidden');
        this.gameArea.classList.remove('hidden');
        document.getElementById('openingInfo').classList.add('hidden');
        this.helpBtn.classList.remove('show');

        this.renderBoardLabels();
        this.render();
        this.updateUI();
    }

    startOpening(openingIndex) {
        this.currentOpening = OPENINGS[openingIndex];
        this.openingMoveIndex = 0;
        this.gameMode = 'opening';
        this.game = new Chess();
        this.computer = null;
        this.showingHint = false;
        this.hintMove = null;

        this.openingMenu.classList.add('hidden');
        this.gameArea.classList.remove('hidden');

        const openingInfo = document.getElementById('openingInfo');
        openingInfo.classList.remove('hidden');
        document.getElementById('openingTitle').textContent = this.currentOpening.name;
        document.getElementById('openingDesc').textContent = this.currentOpening.goal;

        this.helpBtn.classList.add('show');

        this.renderBoardLabels();
        this.render();
        this.updateUI();
        this.updateOpeningStatus();
    }

    handleBoardClick(e) {
        if (this.computerThinking) return;
        if (this.gameMode === 'pvc' && this.game.currentPlayer === 'black') return;

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

                if (this.gameMode === 'opening') {
                    this.checkOpeningMove();
                }

                if (this.gameMode === 'pvc' && this.game.currentPlayer === 'black') {
                    this.makeComputerMove();
                }
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

    makeComputerMove() {
        this.computerThinking = true;
        document.getElementById('computerThinking').classList.remove('hidden');

        setTimeout(() => {
            const move = this.computer.getMove(this.game);
            if (move) {
                this.game.movePiece(move.from.r, move.from.c, move.to.row, move.to.col);
            }

            this.computerThinking = false;
            document.getElementById('computerThinking').classList.add('hidden');
            this.updateUI();
            this.render();
        }, 500);
    }

    updateOpeningStatus() {
        if (this.openingMoveIndex >= this.currentOpening.moves.length) {
            this.statusElement.textContent = '✓ Eröffnung abgeschlossen! Alle 10 Züge gelernt.';
            return;
        }

        const expectedMove = this.currentOpening.moves[this.openingMoveIndex];
        const player = this.openingMoveIndex % 2 === 0 ? 'Weiß' : 'Schwarz';

        if (this.showingHint) {
            this.statusElement.textContent = `${player} → Zug ${this.openingMoveIndex + 1}/10: ${expectedMove} 💡`;
        } else {
            this.statusElement.textContent = `${player} → Zug ${this.openingMoveIndex + 1}/10: ${expectedMove}`;
        }
    }

    showHint() {
        if (this.gameMode !== 'opening' || this.openingMoveIndex >= this.currentOpening.moves.length) {
            return;
        }

        const expectedMove = this.currentOpening.moves[this.openingMoveIndex];
        const [fromNotation, toNotation] = expectedMove.split('-');

        const fromCol = fromNotation.charCodeAt(0) - 97;
        const fromRow = 8 - parseInt(fromNotation[1]);
        const toCol = toNotation.charCodeAt(0) - 97;
        const toRow = 8 - parseInt(toNotation[1]);

        this.hintMove = { fromRow, fromCol, toRow, toCol };
        this.showingHint = true;
        this.updateOpeningStatus();
        this.render();

        setTimeout(() => {
            this.showingHint = false;
            this.hintMove = null;
            this.updateOpeningStatus();
            this.render();
        }, 5000);
    }

    checkOpeningMove() {
        if (this.openingMoveIndex >= this.currentOpening.moves.length) {
            return;
        }

        const expectedMove = this.currentOpening.moves[this.openingMoveIndex];
        const lastMove = this.game.moveHistory[this.game.moveHistory.length - 1];
        const actualMove = `${String.fromCharCode(97 + lastMove.from.col)}${8 - lastMove.from.row}-${String.fromCharCode(97 + lastMove.to.col)}${8 - lastMove.to.row}`;

        if (actualMove === expectedMove) {
            this.openingMoveIndex++;
            this.updateOpeningStatus();
        } else {
            this.statusElement.textContent = `❌ Falscher Zug! Erwartet: ${expectedMove}. Versuche es nochmal.`;
            this.game.undo();
            this.game.selectedSquare = null;
            this.game.validMoves = [];
        }
    }

    resetGame() {
        if (this.gameMode === 'opening') {
            this.startOpening(OPENINGS.indexOf(this.currentOpening));
        } else {
            this.startGame(this.gameMode, this.computer?.difficulty);
        }
    }

    undoMove() {
        if (this.computerThinking) return;

        if (this.gameMode === 'pvc') {
            if (this.game.undo()) {
                this.game.undo();
                this.openingMoveIndex--;
            }
        } else {
            if (this.game.undo()) {
                this.openingMoveIndex--;
            }
        }

        this.game.selectedSquare = null;
        this.game.validMoves = [];
        this.render();
        this.updateUI();
    }

    renderBoardLabels() {
        const leftLabels = document.getElementById('boardLabelsLeft');
        const topLabels = document.getElementById('boardLabelsTop');

        leftLabels.innerHTML = '';
        topLabels.innerHTML = '';

        // Left labels (8-1 from top to bottom)
        for (let row = 0; row < 8; row++) {
            const label = document.createElement('div');
            label.className = 'board-label';
            label.textContent = 8 - row;
            leftLabels.appendChild(label);
        }

        // Top labels (a-h from left to right)
        for (let col = 0; col < 8; col++) {
            const label = document.createElement('div');
            label.className = 'board-column-label';
            label.textContent = String.fromCharCode(97 + col);
            topLabels.appendChild(label);
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

                if (this.showingHint && this.hintMove) {
                    if (row === this.hintMove.fromRow && col === this.hintMove.fromCol) {
                        square.classList.add('hint-from');
                    } else if (row === this.hintMove.toRow && col === this.hintMove.toCol) {
                        square.classList.add('hint-to');
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
    window.ui = new ChessUI();
});
