(function() {
    var GameOfLife = function(context, initialState) {
        this._context = context;
        this._state = initialState;
        
        this._height = this._state.length;
        this._width = this._state[0].length;
        
        this._blockSize = context.canvas.width / this._height;
    };

    GameOfLife.prototype.update = function() {
        var newState = [ ],
            row, column, cell, newCell, neighbours;

        for (row = 0; row < this._height; row++) {
            newState[row] = [ ]
        }

        for (row = 0; row < this._height; row++) {
            for (column = 0; column < this._width; column++) {
                var neighbours = this._countNeighbours(row, column);
                cell = this._state[row][column];
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
                newState[row][column] = newCell;
            }
        }

        this._state = newState;
    };

    GameOfLife.prototype.draw = function() {
        var row, column;
        for (row = 0; row < this._height; row++) {
            for (column = 0; column < this._width; column++) {
                var x = column * this._blockSize,
                    y = row * this._blockSize;
                var cell = this._state[row][column];
                this._context.fillStyle = cell == 1 ? '#ff0000' : '#ffffff';
                this._context.fillRect(x, y, this._blockSize, this._blockSize);
            }
        }
    };
    
    GameOfLife.prototype._countNeighbours = function(cellRow, cellColumn) {
        var row, column, neighbours = 0;
        for (row = cellRow - 1; row <= cellRow + 1; row++) {
            for (column = cellColumn - 1; column <= cellColumn + 1; column++) {
                if (row == cellRow && column == cellColumn) {
                    continue;
                }
                if (this._isCellLive(row, column)) {
                    neighbours++;
                }
            }
        }
        return neighbours;
    };
    
    GameOfLife.prototype._isCellLive = function(row, column) {
        if (row < 0 || row >= this._height) {
            return false;
        }
        if (column < 0 || column >= this._width) {
            return false;
        }
        return this._state[row][column] == 1;
    };
    
    window.addEventListener('load', function() {
        var canvas = document.getElementById('board'),
            context = canvas.getContext("2d");
        
        var game = new GameOfLife(
            context,
            [
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
            ]
        );
        
        game.draw();
        setTimeout(tick, 200);
        function tick() {
            game.update();
            game.draw();
            setTimeout(tick, 200);
        }
    });
})();
