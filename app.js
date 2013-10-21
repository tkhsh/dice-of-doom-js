(function () {
    var gameInfo = {};

    function initGame() {
        gameInfo.boardSize = 2; // board の一辺の長さ
        gameInfo.board = new Array(gameInfo.boardSize * gameInfo.boardSize);

        for (var i = 0; i < gameInfo.board.length; i++) {
            // 表示を確かめるために、仮の文字（"□"）をいれる。
            gameInfo.board[i] = "□";
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

    initGame();
    draw();
})();