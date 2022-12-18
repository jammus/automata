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

    const makeSoup = function() {
	const height = 200;
	const width = 200;
	const soup = [];
	for (let i = 0; i < height; i++) {
	   const row = [];
	   for (let j = 0; j < width; j++) {
	      row.push(Math.round(Math.random()));
	   }
	   soup.push(row);
	}
        return soup;
    };


    const automata = window.automata = {

        nextGeneration: function(cells, rule, neighbourhood) {
            const height = cells.length,
                width = cells[0].length;

            const nextGeneration = initialiseCells(width, height);
            let cell, neighbours;

            for (let row = 0; row < height; row++) {
                for (let column = 0; column < width; column++) {
                    cell = cells[row][column];
                    neighbours = neighbourhood(cells, row, column);
                    nextGeneration[row][column] = rule(cell, neighbours.length);
                }
            }

            return nextGeneration;

            function initialiseCells(width, height) {
                const cells = [ ];

                for (let i = 0; i < height; i++) {
                    cells[i] = [ ];
                }

                return cells;
            }
        },

        draw: function(context, cells) {
            const height = cells.length,
                width = cells[0].length,
                blockSize = context.canvas.width / Math.max(height, width);
            let x, y, cell;

            for (let row = 0; row < height; row++) {
                for (let column = 0; column < width; column++) {
                    x = column * blockSize;
                    y = row * blockSize;
                    cell = cells[row][column];

                    context.fillStyle = COLORS[cell];
                    context.fillRect(x, y, blockSize, blockSize);
                }
            }
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
            moore: function(cells, row, column) {
                const candidates = [
                    [ row - 1, column - 1 ],
                    [ row - 1, column ],
                    [ row - 1, column + 1],

                    [ row, column - 1 ],
                    [ row, column + 1],

                    [ row + 1, column - 1 ],
                    [ row + 1, column ],
                    [ row + 1, column + 1]
                ];

                return new Neighbourhood(cells, candidates);
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
            vonNeumann: function(cells, row, column) {
                const candidates = [
                    [ row - 1, column ],

                    [ row, column - 1 ],
                    [ row, column + 1 ],

                    [ row + 1, column ]
                ];

                return new Neighbourhood(cells, candidates);
            }
        },

        patterns: {
            glider: [
                [ 0, 0, 1, 0, 0, 0, 0, 0, 0, 0 ],
                [ 0, 0, 0, 1, 0, 0, 0, 0, 0, 0 ],
                [ 0, 1, 1, 1, 0, 0, 0, 0, 0, 0 ],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]
            ],

            oscillator: [
                [ 0, 0, 0, 0, 0, 0 ],
                [ 0, 0, 2, 0, 0, 0 ],
                [ 0, 0, 1, 1, 2, 0 ],
                [ 0, 2, 1, 1, 0, 0 ],
                [ 0, 0, 0, 2, 0, 0 ],
                [ 0, 0, 0, 0, 0, 0 ]
            ],

            xor: [
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
                [ 0, 0, 0, 3, 3, 3, 3, 3, 3, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
                [ 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0 ],
                [ 0, 0, 0, 3, 3, 3, 1, 2, 3, 3, 3, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0 ],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 0, 0, 0, 0 ],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 3, 3, 3, 3, 3 ],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 0, 0, 0, 0 ],
                [ 0, 0, 0, 2, 1, 3, 3, 3, 3, 2, 1, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0 ],
                [ 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0 ],
                [ 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]
            ],

	    soup: makeSoup(),
        }

    };

    const Neighbourhood = function(cells, candidates) {
        const neighbours = [ ],
            height = cells.length,
            width = cells[0].length;
        let candidate, cell;

        for (let index = 0; index < candidates.length; index++) {
            candidate = candidates[index];
            cell = cellAt(candidate[0], candidate[1]);
            if (isCellLive(cell)) {
                neighbours.push(cell);
            }
        }

        this.length = neighbours.length;

        function cellAt(row, column) {
            if (row < 0) {
                row += height;
            }
            if (row >= height) {
                row -= height;
            }
            if (column < 0) {
                column += width;
            }
            if (column >= width) {
                column -= width;
            }
            return cells[row][column];
        }

        function isCellLive(cell) {
            return cell == STATES.ON;
        }
    };
})();
