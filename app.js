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
            gameInfo.board[i] = (function () {
                var numberOfDices = Math.floor(Math.random() * (maxDiceNum - minDiceNum + 1)) + minDiceNum;

                var playerNumber = Math.floor(Math.random() * gameInfo.players.length);

                return {
                    dice: numberOfDices,
                    playerNumber: playerNumber
                };
            })();
        }
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

    function changeTurn(playerNumber) {
        if(gameInfo.players.length === playerNumber + 1) {
            return 0;
        } else {
            return playerNumber + 1;
        }
    }

    function listPossibleMoves(obj) {
        var moves = [];

        // TODO: 実装する
        // makePossibleDirections(arg);
        // canAttack(arg);

        return moves;
    }

    function makePossibleDirections(pos) {
        var boardSize = gameInfo.boardSize;
        var allDirections = [
            pos-boardSize-1,
            pos-boardSize,
            pos-1,
            pos+1,
            pos+boardSize,
            pos+boardSize+1
        ];

        var impossibleDirections = [];

        if(0 <= pos < boardSize) { // 最も上の行だった場合
            impossibleDirections.push(0, 1);
        } else if (boardSize*(boardSize-1) <= pos < gameInfo.board.length) { // 最も下の行だった場合
            impossibleDirections.push(4, 5);
        }

        if (pos%boardSize === 0) { // 最も左の列だった場合
            impossibleDirections.push(0, 2);
        } else if (pos%boardSize === boardSize-1) { // 最も右の列だった場合
            impossibleDirections.push(3, 5);
        }

        // allDirections から impossibleDirections を取り除く
        for (var i = 0; i < impossibleDirections.length; i++) {
            var index = impossibleDirections[i];
            allDirections[index] = null;
        }

        var possibleDirections = [];
        for (var i = 0; i < allDirections.length; i++) {
            if (allDirections[i] !== null) {
                possibleDirections.push(allDirections[i]);
            }
        }

        return possibleDirections;
    }

    function makeMoves(pos, possibleDirs) {
        var player = gameInfo.board[pos].playerNumber;
        var moves = [];

        for (var i = 0; i < possibleDirs.length; i++) {
            var possiblePos = possibleDirs[i];
            if(player !== gameInfo.board[possiblePos].playerNumber) {
                moves.push(possibleDirs[i]);
            }
        }

        return moves;
    }

    initGame();
    draw();
})();