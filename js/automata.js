window.automata = {

    states: {
        OFF: 0,

        ON: 1,

        DYING: 2,
    },

    nextGeneration: function(cells, rule, neighbourhood) {
        var height = cells.length,
            width = cells[0].length;

        var nextGeneration = initialiseCells(width, height),
            cell, neighbours;

        for (var row = 0; row < height; row++) {
            for (var column = 0; column < width; column++) {
                cell = cells[row][column];
                neighbours = neighbourhood(cells, row, column);
                nextGeneration[row][column] = rule(cell, neighbours.length);
            }
        }

        return nextGeneration;

        function initialiseCells(width, height) {
            var cells = [ ];

            for (var i = 0; i < height; i++) {
                cells[i] = [ ];
            }

            return cells;
        }
    },

    draw: function(context, cells) {
        var COLORS = {
            0: '#ffffff',
            1: '#ff0000',
            2: '#0000ff'
        };

        var height = cells.length,
            width = cells[0].length,
            blockSize = context.canvas.width / height,
            x, y, cell;

        for (var row = 0; row < height; row++) {
            for (var column = 0; column < width; column++) {
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
            if (cell == automata.states.OFF && neighbours == 3) {
                return automata.states.ON;
            }

            if (cell == automata.states.ON && neighbours < 2) {
                return automata.states.OFF;
            }

            if (cell == automata.states.ON && neighbours > 3) {
                return automata.states.OFF;
            }

            return cell;
        },

        seeds: function(cell, neighbours) {
            if (cell == 0 && neighbours == 2) {
                return automata.states.ON;
            }

            return automata.states.OFF;
        },

        briansBrain: function(cell, neighbours) {
            if (cell == 0 && neighbours == 2) {
                return automata.states.ON;
            }

            if (cell == automata.states.ON) {
                return 2;
            }

            return automata.states.OFF;
        },
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
            var candidates = [
                [ row - 1, column - 1 ],
                [ row - 1, column ],
                [ row - 1, column + 1],

                [ row, column - 1 ],
                [ row, column + 1],

                [ row + 1, column - 1 ],
                [ row + 1, column ],
                [ row + 1, column + 1]
            ];

            return new automata.Neighbourhood(cells, candidates);
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
            var candidates = [
                [ row - 1, column ],

                [ row, column - 1 ],
                [ row, column + 1 ],

                [ row + 1, column ]
            ];

            return new automata.Neighbourhood(cells, candidates);
        }
    },

    Neighbourhood: function(cells, candidates) {
        var neighbours = [ ],
            height = cells.length,
            width = cells[0].length,
            candidate,
            cell;

        for (var index = 0; index < candidates.length; index++) {
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
            return cell == automata.states.ON;
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
        ]
    }

};
