(function () {
    var gameInfo = {};

    function initGame() {
        gameInfo.boardSize = 2; // board の一辺の長さ
        gameInfo.board = new Array(gameInfo.boardSize * gameInfo.boardSize);
        gameInfo.players = ["A", "B"];
        gameInfo.numOfRemovedDices = 0;
        gameInfo.numOfPasses = 0;

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

    function startNewTurn(playerNumber, isFirstMove) {
        deleteButtons();

        var possibleMoves = listPossibleMoves(gameInfo.board, playerNumber);

        generateAttackButtons(possibleMoves);

        if(isFirstMove) {
            if(possibleMoves.length === 0) {
                generatePassButton(playerNumber);

                // パスの回数を増やす
                gameInfo.numOfPasses += 1;

                // すべてのプレイヤーがパスしたら勝敗を判定
                if (gameInfo.numOfPasses === gameInfo.players.length) {
                    judgeGame();
                }
            }
        } else {
            generatePassButton(playerNumber);
        }

    }

    function generateAttackButtons(possibleMoves) {
        for (var i = 0; i < possibleMoves.length; i++) {
            var moveInfo = possibleMoves[i];
            var installationElement = document.getElementById("uiButton");
            var buttonElement = document.createElement("input");
            buttonElement.type = "button";
            buttonElement.value = "From: " + moveInfo.from + " To: " + moveInfo.to;
            buttonElement.addEventListener("click", playersAttack(moveInfo.from, moveInfo.to), false);
            installationElement.appendChild(buttonElement);
        }
    }

    function generatePassButton(playerNumber) {
        var installationElement = document.getElementById("uiButton");

        var passButton = document.createElement("input");
        passButton.type = "button";
        passButton.value = "TURN END";
        passButton.addEventListener("click", pass(playerNumber), false);  
        installationElement.appendChild(passButton);
    }

    function deleteButtons() {
        // 現在表示されているボタンを削除する。
        var element = document.getElementById("uiButton");
        while(element.firstChild) {
            element.removeChild(element.firstChild);
        }
    }

    function playersAttack(from, to) {
        return function(e) {
            attack(gameInfo.board, from, to);

            // 取り除かれたダイスの数を記録しておく。
            gameInfo.numOfRemovedDices += gameInfo.board[to].dice;

            // パスの回数をリセット
            gameInfo.numOfPasses = 0;

            // ボタンを再描画
            var playerNumber = gameInfo.board[from].playerNumber;
            startNewTurn(playerNumber, false);

            // 盤面を再描画
            draw();
        }
    }

    function attack(board, from, to) {
        console.log("------------------");
        // 陣地の変更
        board[to].playerNumber = board[from].playerNumber;

        // ダイスの移動
        board[to].dice = board[from].dice - 1;
        board[from].dice = 1;

        return board;
    }

    function pass(playerNumber) {
        return function(e) {
            if (gameInfo.numOfRemovedDices > 1) {
                supply(playerNumber);
            }

            var nextPlayerNum = getNextPlayerNumber(playerNumber);

            // if (nextPlayerNum === computerNum) {
            //     ai(nextPlayerNum);
            // } else {
                startNewTurn(nextPlayerNum, true);
            // }
            console.log(gameInfo.players[nextPlayerNum] + " のターンです。");
        }
    }

    function supply(playerNumber) {
        var resource = gameInfo.numOfRemovedDices - 1;
        for (var i = 0; i < gameInfo.board.length; i++) {
            if ((playerNumber === gameInfo.board[i].playerNumber) && (gameInfo.board[i].dice < 3)){
                gameInfo.board[i].dice += 1;
                resource -= 1;
                if (resource === 0) {
                    break;
                }
            }
        }

        // 取り除かれたダイスの数を初期化する。
        gameInfo.numOfRemovedDices = 0;

        draw();
    }

    function getNextPlayerNumber(playerNumber) {
        return (playerNumber + 1) % gameInfo.players.length;
    }

    function listPossibleMoves(board, playerNumber) {
        var possibleMoves = [];

        for (var i = 0; i < board.length; i++) {
            if (playerNumber === board[i].playerNumber) {
                var adjacentPositions = listAdjacentHexPositions(i);
                var movesFromTheHex = makeMoves(board, i, adjacentPositions);

                for (var j = 0; j < movesFromTheHex.length; j++) {
                    possibleMoves.push({
                        from: i,
                        to: movesFromTheHex[j]
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

    function makeMoves(board, pos, adjacentPositions) {
        var playerHex = board[pos];
        var moves = [];

        for (var i = 0; i < adjacentPositions.length; i++) {
            var adjacentPos = adjacentPositions[i];
            var oppositeHex = board[adjacentPos];

            if(playerHex.playerNumber !== oppositeHex.playerNumber) {
                if (playerHex.dice > oppositeHex.dice) {
                    moves.push(adjacentPositions[i]);
                }
            }
        }

        return moves;
    }

    function judgeGame() {
        var scoresOfPlayers = new Array(gameInfo.players.length);
        // 配列を数値型で初期化
        for (var i = 0; i < scoresOfPlayers.length; i++) {
            scoresOfPlayers[i] = 0;
        }

        // スコアを計算
        for (var i = 0; i < gameInfo.board.length; i++) {
            var owner0fTheHex = gameInfo.board[i].playerNumber;
            scoresOfPlayers[owner0fTheHex] += 1;
        }

        // 一番スコアの高い人をみつける
        var highScorePlayer = {
            playerNum: 0,
            score:scoresOfPlayers[0]
        };

        for (var i = 1; i < scoresOfPlayers.length; i++) {
            if (highScorePlayer.score < scoresOfPlayers[i]) {
                highScorePlayer.playerNum = i;
                highScorePlayer.score = scoresOfPlayers[i];
            }
        }

        console.log(gameInfo.players[highScorePlayer.playerNum] + " の勝ちです。");
    }

    // AI //
    function ai(playerNumber) {
        // var boardCopy = [];
        // for (var i = 0; i < gameInfo.board.length; i++) {
        //     boardCopy[i] = gameInfo.board[i];
        // }
        var boardCopy = $.extend(true, [], gameInfo.board);

        var gameTree = makeGameTree(boardCopy, playerNumber, true);
        // var bestMove = searchBestMove(gameTree);
        console.log(gameTree);
        // TODO: 関数 attack の処理をもっと抽象化する。
        // attack(bestMove.from, bestMove.to);
    }

    function makeGameTree(boardCopy, playerNumber, isFirstMoveInTheTurn) {
        return {
            board: boardCopy,
            playerNumber: playerNumber,
            moves: aiListPossibleMoves(boardCopy, playerNumber, isFirstMoveInTheTurn)
        };
    }

    function aiListPossibleMoves(boardCopy, playerNumber, isFirstMoveInTheTurn) {
        var aiPosMoves = [];
        var tmpPossibleMoves = listPossibleMoves(boardCopy, playerNumber);

        if (isFirstMoveInTheTurn) {
            console.log("310");
            if (tmpPossibleMoves === 0) {
                // パスする場合
                aiPosMoves.push(
                    makeGameTree(makeOppositeAttackedBoard(boardCopy, playerNumber), getNextPlayerNumber(playerNumber), false)
                    );

                // パスの回数を増やす
                // gameInfo.numOfPasses += 1;

                // // すべてのプレイヤーがパスしたら、勝敗を決定する
                // if(gameInfo.numOfPasses === gameInfo.players.length) {
                //     judgeGame();
                // }
                ///////
            } else {
                console.log("326");
                // 手を打つ（パスはなし）場合
                console.log("311------------------");
                for (var i = 0; i < tmpPossibleMoves.length; i++) {
                    var playersAttackedBoard = attack(boardCopy, tmpPossibleMoves[i].from, tmpPossibleMoves[i].to);
                    aiPosMoves.push(
                        makeGameTree(playersAttackedBoard, playerNumber, false)
                        );
                }
                ////////////////////////
            }
        } else {
            console.log("338");
            // 手を打つ（パスもあり）場合
            for (var i = 0; i < tmpPossibleMoves.length; i++) {
                var playersAttackedBoard = attack(boardCopy, tmpPossibleMoves[i].from, tmpPossibleMoves[i].to);
                aiPosMoves.push(
                    makeGameTree(playersAttackedBoard, playerNumber, false)
                    );
            }
            aiPosMoves.push(
                makeGameTree(makeOppositeAttackedBoard(boardCopy, playerNumber), getNextPlayerNumber(playerNumber), false)
                );
            ////////////////////////
        }

        return aiPosMoves;
    }

    function makeOppositeAttackedBoard(boardCopy, playerNumber) {
        var oppositePlayerNumber = getNextPlayerNumber(playerNumber);
        var possibleMoves = listPossibleMoves(boardCopy, oppositePlayerNumber);

        if (possibleMoves.length > 0) {
            var move = searchBestMove(boardCopy, playerNumber, possibleMoves);
            return attack(boardCopy, move.from, move.to);
        }
        return boardCopy;
    }

    function searchBestMove(boardCopy, playerNumber, possibleMoves) {
        // for (var i = 0; i < possibleMoves.length; i++) {
        //     var moveInfo = possibleMoves[i];

        //     var attackedBoard = attack(boardCopy, moveInfo.from, moveInfo.to);
        //     var nextPossibleMoves = listPossibleMoves(attackedBoard, playerNumber);
        // }

        // 「優勢」の基準がよく理解できないため、仮にランダムで選択するものとする。
        var rndNum = Math.floor(Math.random() * possibleMoves.length);
        var bestMove = possibleMoves[rndNum];

        return bestMove;
    }

    initGame();
    draw();
    // startNewTurn(0, true);
    console.log("377");
    ai(0);
    console.log(gameInfo.players[0] + " のターンです。");
})();