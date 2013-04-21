window.gameOfLife = {
    calculateNextGeneration: function(cells) {
        var height = cells.length,
            width = cells[0].length;

        var nextGeneration = initialiseCells(width, height);

        for (var row = 0; row < height; row++) {
            for (var column = 0; column < width; column++) {
                nextGeneration[row][column] = transformCell(row, column);
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

        function transformCell(row, column) {
            var cell = cells[row][column],
                neighbours = countNeighbours(row, column);

            if (cell == 0 && neighbours == 3) {
                return 1;
            }

            if (cell == 1 && neighbours < 2) {
                return 0;
            }

            if (cell == 1 && neighbours > 3) {
                return 0;
            }

            return cell;
        }

        function countNeighbours(cellRow, cellColumn) {
            var neighbours = 0;

            for (var row = cellRow - 1; row <= cellRow + 1; row++) {
                for (var column = cellColumn - 1; column <= cellColumn + 1; column++) {
                    if (row == cellRow && column == cellColumn) {
                        continue;
                    }
                    if (isCellLive(row, column)) {
                        neighbours++;
                    }
                }
            }

            return neighbours;
        }
    
        function isCellLive(row, column) {
            if (row < 0 || row >= height) {
                return false;
            }

            if (column < 0 || column >= width) {
                return false;
            }

            return cells[row][column] == 1;
        }

    },

    draw: function(context, cells) {
        var height = cells.length,
            width = cells[0].length;

        var blockSize = context.canvas.width / height;

        var x, y, cell;

        for (var row = 0; row < height; row++) {
            for (var column = 0; column < width; column++) {
                x = column * blockSize;
                y = row * blockSize;
                cell = cells[row][column];

                context.fillStyle = cell == 1 ? '#ff0000' : '#ffffff';
                context.fillRect(x, y, blockSize, blockSize);
            }
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
        ]
    }
};
