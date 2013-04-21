(function() {
    var Board = function(context, initialState) {
        this._context = context;
        this._state = initialState;
        
        this._height = this._state.length;
        this._width = this._state[0].length;
        
        this._blockSize = 20;
    };

    Board.prototype.update = function() {
        var newState = [ ],
            row, column, tile, newTile, neighbours;

        for (row = 0; row < this._height; row++) {
            newState[row] = [ ]
        }

        for (row = 0; row < this._height; row++) {
            for (column = 0; column < this._width; column++) {
                var neighbours = this._countNeighbours(row, column);
                tile = this._state[row][column];
                newTile = tile;
                if (tile == 0 && neighbours == 3) {
                    newTile = 1;
                }
                if (tile == 1 && neighbours < 2) {
                    newTile = 0;
                }
                if (tile == 1 && neighbours > 3) {
                    newTile = 0;
                }
                newState[row][column] = newTile;
            }
        }

        this._state = newState;
    };

    Board.prototype.draw = function() {
        var row, column;
        for (row = 0; row < this._height; row++) {
            for (column = 0; column < this._width; column++) {
                var x = column * this._blockSize,
                    y = row * this._blockSize;
                var tile = this._state[row][column];
                this._context.fillStyle = tile == 1 ? '#ff0000' : '#ffffff';
                this._context.fillRect(x, y, this._blockSize, this._blockSize);
            }
        }
    };
    
    Board.prototype._countNeighbours = function(tileRow, tileColumn) {
        var row, column, neighbours = 0;
        for (row = tileRow - 1; row <= tileRow + 1; row++) {
            for (column = tileColumn - 1; column <= tileColumn + 1; column++) {
                if (row == tileRow && column == tileColumn) {
                    continue;
                }
                if (this._isLive(row, column)) {
                    neighbours++;
                }
            }
        }
        return neighbours;
    };
    
    Board.prototype._isLive = function(row, column) {
        if (row < 0 || row >= this._height) {
            return false;
        }
        if (column < 0 || column >= this._width) {
            return false;
        }
        return this._state[row][column] == 1;
    };
    
    window.addEventListener('load', function() {
        var c = document.getElementById('board'),
            context = c.getContext("2d");
        
        var board = new Board(
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
        
        
        board.draw();
        setTimeout(tick, 200);
        function tick() {
            board.update();
            board.draw();
            setTimeout(tick, 200);
        }
    });
})();
