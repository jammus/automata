(function() {

    const STATES = {
        OFF: 0,
        ON: 1,
        DYING: 2,

        EMPTY: 0,
        HEAD: 1,
        TAIL: 2,
        CONDUCTOR: 3
    };

    const COLORS = {
        [STATES.OFF]: '#ffffff',
        [STATES.ON]: '#ff0000',
        [STATES.DYING]: '#0000ff',
        [STATES.CONDUCTOR]: '#ffff00',
    };

    const makeArray = (length, f) => [...Array(length)].map(f);

    const randomRow = (length) => makeArray(length, () => Math.round(Math.random()));

    const makeSoup = (width, height) => randomRow(width * height);

    const rowColumnFromIndex = (board, index) => [
        Math.floor(index / board.width),
        index % board.width
    ];

    const automata = window.automata = {
        nextGeneration: (board, rule, neighbourhood) => ({
            ...board,
            cells: board.cells.map((cell, index) => {
                const liveNeighbours = countNeighbours(board, index, neighbourhood);
                return rule(cell, liveNeighbours);
            })
        }),

        draw: (context, board) => {
            const height = board.height,
                width = board.width,
                blockSize = context.canvas.width / Math.max(height, width);

            board.cells.forEach((cell, index) => {
                const [row, column] = rowColumnFromIndex(board, index);
                const x = column * blockSize;
                const y = row * blockSize;
                context.fillStyle = COLORS[cell];
                context.fillRect(x, y, blockSize, blockSize);
            });
        },

        rules: {
            gameOfLife: function(cell, neighbours) {
                if (cell == STATES.OFF && neighbours == 3) {
                    return STATES.ON;
                }

                if (cell == STATES.ON && neighbours < 2) {
                    return STATES.OFF;
                }

                if (cell == STATES.ON && neighbours > 3) {
                    return STATES.OFF;
                }

                return cell;
            },

            seeds: function(cell, neighbours) {
                if (cell == STATES.OFF && neighbours == 2) {
                    return STATES.ON;
                }

                return STATES.OFF;
            },

            briansBrain: function(cell, neighbours) {
                if (cell == STATES.OFF && neighbours == 2) {
                    return STATES.ON;
                }

                if (cell == STATES.ON) {
                    return STATES.DYING;
                }

                return STATES.OFF;
            },

            wireworld: function(cell, neighbours) {
                if (cell == STATES.HEAD) {
                    return STATES.TAIL;
                }

                if (cell == STATES.TAIL) {
                    return STATES.CONDUCTOR;
                }

                if (cell == STATES.CONDUCTOR && (neighbours == 1 || neighbours == 2)) {
                    return STATES.HEAD;
                }

                return cell;
            }
        },

        neighbourhoods: {

            /**
             *
             * . . . . .
             * . x x x .
             * . x o x .
             * . x x x .
             * . . . . .
             *
             * The Moore neighbourhood comprises the eight cells surrounding
             * a central cell
             *
             */
            moore: function(row, column) {
                return [
                    [ row - 1, column - 1 ],
                    [ row - 1, column ],
                    [ row - 1, column + 1],

                    [ row, column - 1 ],
                    [ row, column + 1],

                    [ row + 1, column - 1 ],
                    [ row + 1, column ],
                    [ row + 1, column + 1]
                ];
            },

            /**
             *
             * . . . . .
             * . . x . .
             * . x o x .
             * . . x . .
             * . . . . .
             *
             * The von Neumann neighbourhood comprises the four cells orthogonally
             * surrounding a central cell.
             *
             */
            vonNeumann: function(row, column) {
                return [
                    [ row - 1, column ],

                    [ row, column - 1 ],
                    [ row, column + 1 ],

                    [ row + 1, column ]
                ];
            }
        },

        patterns: {
            glider: {
                width: 10,
                height: 10,
                cells: [
                    0, 0, 1, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 1, 0, 0, 0, 0, 0, 0,
                    0, 1, 1, 1, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0
                ]
            },

            pentomino: {
                width: 10,
                height: 9,
                cells: [
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 1, 1, 0, 0, 0,
                    0, 0, 0, 0, 1, 1, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 1, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                ]
            },

            oscillator: {
                width: 6,
                height: 6,
                cells: [
                    0, 0, 0, 0, 0, 0,
                    0, 0, 2, 0, 0, 0,
                    0, 0, 1, 1, 2, 0,
                    0, 2, 1, 1, 0, 0,
                    0, 0, 0, 2, 0, 0,
                    0, 0, 0, 0, 0, 0
                ],
            },

            xor: {
                width: 24,
                height: 13,
                cells: [
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 3, 3, 3, 3, 3, 3, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 3, 3, 3, 1, 2, 3, 3, 3, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 3, 3, 3, 3, 3,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 0, 0, 0, 0,
                    0, 0, 0, 2, 1, 3, 3, 3, 3, 2, 1, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0,
                    0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
                ],
            },

            soup: {
                width: 150,
                height: 150,
                cells: makeSoup(150, 150),
            }
        }

    };

    const isCellLive = (cell) => cell == STATES.ON;

    const cellAt = (board, row, column) => {
        if (row < 0) {
            row += board.height;
        }
        if (row >= board.height) {
            row -= board.height;
        }
        if (column < 0) {
            column += board.width;
        }
        if (column >= board.width) {
            column -= board.width;
        }
        const index = (row * board.width) + column;
        return board.cells[index];
    };

    const countNeighbours = (board, index, neighbourhood) => {
        const [row, column] = rowColumnFromIndex(board, index);
        const neighbouringCells = neighbourhood(row, column);
        return neighbouringCells.reduce((count, candidate) => {
            const cell = cellAt(board, candidate[0], candidate[1]);
            return isCellLive(cell) ? count + 1 : count;
        }, 0);
    };
})();
