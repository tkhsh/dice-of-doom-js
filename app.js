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
            gameInfo.board[i] = initHex(minDiceNum, maxDiceNum);
        }
    }

    function initHex (minDiceNum, maxDiceNum) {
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
                var hex = gameInfo.board[index];
                var hexInfo = gameInfo.players[hex.playerNumber] + ":" + hex.dice + " ";
                boardString += hexInfo;
            }
        }

        document.getElementById("display").innerHTML = boardString;
    }

    function showButtons(possibleMoves) {
        deleteButtons();

        generateAttackButtons(possibleMoves);
        generatePassButton();
    }

    function generateAttackButtons(possibleMoves) {
        for (var i = 0; i < possibleMoves.length; i++) {
            var moveInfo = possibleMoves[i];
            var installationElement = document.getElementById("uiButton");

            for (var j = 0; j < moveInfo.to.length; j++) {
                var buttonElement = document.createElement("input");
                buttonElement.type = "button";
                buttonElement.value = "From: " + moveInfo.from + " To: " + moveInfo.to[j];
                buttonElement.addEventListener("click", attack(moveInfo.from, moveInfo.to[j]), false);
                installationElement.appendChild(buttonElement);
            }
        }
    }

    function generatePassButton() {
        var installationElement = document.getElementById("uiButton");

        var passButton = document.createElement("input");
        passButton.type = "button";
        passButton.value = "TURN END";
        // TODO: ターン終了の処理を行う関数を追加
        // passButton.addEventListener("click", endTurn(), false);  
        installationElement.appendChild(passButton);
    }

    function deleteButtons() {
        // 現在表示されているボタンを削除する。
        var element = document.getElementById("uiButton");
        while(element.firstChild) {
            element.removeChild(element.firstChild);
        }
    }

    function attack(from, to) {
        return function(e) {
            // 陣地の変更
            gameInfo.board[to].playerNumber = gameInfo.board[from].playerNumber;

            // ダイスの移動
            gameInfo.board[to].dice = gameInfo.board[from].dice - 1;
            gameInfo.board[from].dice = 1;

            // ボタンを再描画
            generateButtons(gameInfo.board[from].playerNumber);

            // 盤面を再描画
            draw();
        }
    }

    function getNextPlayerNumber(playerNumber) {
        return (playerNumber + 1) % gameInfo.players.length;
    }

    function listPossibleMoves(playerNumber) {
        var possibleMoves = [];

        for (var i = 0; i < gameInfo.board.length; i++) {
            if (playerNumber === gameInfo.board[i].playerNumber) {
                var adjacentPositions = listAdjacentHexPositions(i);
                var movesFromTheHex = makeMoves(i, adjacentPositions);

                if(movesFromTheHex.length > 0) {
                    possibleMoves.push({
                        from: i,
                        to: movesFromTheHex
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
        var playerHex = gameInfo.board[pos];
        var moves = [];

        for (var i = 0; i < adjacentPositions.length; i++) {
            var adjacentPos = adjacentPositions[i];
            var oppositeHex = gameInfo.board[adjacentPos];

            if(playerHex.playerNumber !== oppositeHex.playerNumber) {
                if (playerHex.dice > oppositeHex.dice) {
                    moves.push(adjacentPositions[i]);
                }
            }
        }

        return moves;
    }

    initGame();
    draw();
    showButtons(listPossibleMoves(0));
})();