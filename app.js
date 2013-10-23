(function () {
    var gameInfo = {};

    function initGame() {
        gameInfo.boardSize = 2; // board の一辺の長さ
        gameInfo.board = new Array(gameInfo.boardSize * gameInfo.boardSize);
        gameInfo.players = ["A", "B"];

        initBoard();
    }

    function initBoard () {
        var minDiceNum = 1;
        var maxDiceNum = 3;

        for (var i = 0; i < gameInfo.board.length; i++) {
            gameInfo.board[i] = initSquare(minDiceNum, maxDiceNum);
        }
    }

    function initSquare (minDiceNum, maxDiceNum) {
        var numberOfDices = Math.floor(Math.random() * (maxDiceNum - minDiceNum + 1)) + minDiceNum;
        var playerNumber = Math.floor(Math.random() * gameInfo.players.length);

        return {
            dice: numberOfDices,
            playerNumber: playerNumber
        };
    }

    function draw() {
        var boardString = "";
        for (var i = 0; i < gameInfo.boardSize; i++) {
            boardString += "\n";

            for (var j = 0; j < gameInfo.boardSize; j++) {
                var index = j + (i * gameInfo.boardSize);
                var square = gameInfo.board[index];
                var squareInfo = gameInfo.players[square.playerNumber] + ":" + square.dice + " ";
                boardString += squareInfo;
            }
        }

        document.getElementById("display").innerHTML = boardString;
    }

    $('#dummyButton').click(function () {
        console.log("Attack");
        // TODO: 攻撃の処理を行う関数を追加する。
    });

    function getNextPlayerNumber(playerNumber) {
        return (playerNumber + 1) % gameInfo.players.length;
    }

    function listPossibleMoves(playerNumber) {
        var possibleMoves = [];

        for (var i = 0; i < gameInfo.board.length; i++) {
            if (playerNumber === gameInfo.board[i].playerNumber) {
                var adjacentPositions = listAdjacentHexPositions(i);
                var movesFromTheSquare = makeMoves(i, adjacentPositions);

                if(movesFromTheSquare.length > 0) {
                    possibleMoves.push({
                        from: i,
                        to: movesFromTheSquare
                    });
                }
            }
        }

        return possibleMoves;
    }

    function listAdjacentHexPositions(pos) {
        var boardSize = gameInfo.boardSize;
        var allAdjacentPositions = [
            pos-boardSize-1,
            pos-boardSize,
            pos-1,
            pos+1,
            pos+boardSize,
            pos+boardSize+1
        ];

        var nonexistentPositions = [];

        if((0 <= pos) && (pos < boardSize)) { // 最も上の行だった場合
            nonexistentPositions.push(0, 1);
        } else if ((boardSize*(boardSize-1) <= pos) && (pos < gameInfo.board.length)) { // 最も下の行だった場合
            nonexistentPositions.push(4, 5);
        }

        if (pos%boardSize === 0) { // 最も左の列だった場合
            nonexistentPositions.push(0, 2);
        } else if (pos%boardSize === boardSize-1) { // 最も右の列だった場合
            nonexistentPositions.push(3, 5);
        }

        // allAdjacentPositions から nonexistentPositions を取り除く
        for (var i = 0; i < nonexistentPositions.length; i++) {
            var index = nonexistentPositions[i];
            allAdjacentPositions[index] = null;
        }

        var adjacentPositions = [];
        for (var i = 0; i < allAdjacentPositions.length; i++) {
            if (allAdjacentPositions[i] !== null) {
                adjacentPositions.push(allAdjacentPositions[i]);
            }
        }

        return adjacentPositions;
    }

    function makeMoves(pos, adjacentPositions) {
        var playerPos = gameInfo.board[pos];
        var moves = [];

        for (var i = 0; i < adjacentPositions.length; i++) {
            var adjacentPos = adjacentPositions[i];
            var oppositePos = gameInfo.board[adjacentPos];

            if(playerPos.playerNumber !== oppositePos.playerNumber) {
                if (playerPos.dice > oppositePos.dice) {
                    moves.push(adjacentPositions[i]);
                }
            }
        }

        return moves;
    }

    initGame();
    draw();
})();