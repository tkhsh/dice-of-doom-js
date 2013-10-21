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
                var numberOfDices = Math.floor(Math.random() * (maxDiceNum - minDiceNum)) + minDiceNum;

                var rndNum = Math.floor(Math.random() * (gameInfo.players.length - 1));
                var selectedPlayer = gameInfo.players[rndNum];

                return {
                    dice: numberOfDices,
                    player: selectedPlayer
                };
            })();
        }
    }

    function draw() {
        var boardString = "";
        for (var i = 0; i < gameInfo.boardSize; i++) {
            boardString += "\n";

            for (var j = 0; j < gameInfo.boardSize; j++) {
                boardString += gameInfo.board[i + (j * gameInfo.boardSize)];
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

    initGame();
    draw();
})();