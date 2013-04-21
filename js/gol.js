(function() {

    var gameOfLife = function(world) {
        var height = world.length,
            width = world[0].length;

        var newWorld = [ ],
            row, column, cell, newCell, neighbours;

        for (row = 0; row < height; row++) {
            newWorld[row] = [ ]
        }

        for (row = 0; row < height; row++) {
            for (column = 0; column < width; column++) {
                var neighbours = countNeighbours(row, column);
                cell = world[row][column];
                newCell = cell;
                if (cell == 0 && neighbours == 3) {
                    newCell = 1;
                }
                if (cell == 1 && neighbours < 2) {
                    newCell = 0;
                }
                if (cell == 1 && neighbours > 3) {
                    newCell = 0;
                }
                newWorld[row][column] = newCell;
            }
        }

        return newWorld;

        function countNeighbours(cellRow, cellColumn) {
            var row, column, neighbours = 0;

            for (row = cellRow - 1; row <= cellRow + 1; row++) {
                for (column = cellColumn - 1; column <= cellColumn + 1; column++) {
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

            return world[row][column] == 1;
        }

    };

    var drawWorld = function(context, world) {
        var height = world.length,
            width = world[0].length;

        var blockSize = context.canvas.width / height;

        var row, column;

        for (row = 0; row < height; row++) {
            for (column = 0; column < width; column++) {
                var x = column * blockSize,
                    y = row * blockSize,
                    cell = world[row][column];

                context.fillStyle = cell == 1 ? '#ff0000' : '#ffffff';
                context.fillRect(x, y, blockSize, blockSize);
            }
        }
    };

    window.addEventListener('load', function() {
        var canvas = document.getElementById('board'),
            context = canvas.getContext("2d");
        
        var world = [
                [ 0, 0, 1, 0, 0, 0, 0, 0, 0, 0 ],
                [ 0, 0, 0, 1, 0, 0, 0, 0, 0, 0 ],
                [ 0, 1, 1, 1, 0, 0, 0, 0, 0, 0 ],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
            ];
        
        drawWorld(context, world);
        setTimeout(tick, 200);
        function tick() {
            world = gameOfLife(world);
            drawWorld(context, world);
            setTimeout(tick, 200);
        }
    });
})();
