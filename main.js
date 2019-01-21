// Mark Harder, Basic Tic Tac Toe, Lesson 12, MHIntegrity
// setup the inital state of the board by creating our gameState variable.
// so that we can restart a new game by reinitializing the state, use a function.
// Games can be either turn based on realtime, this game is turn based.
let gameState = {};
InitializeBoard();

function LoadBoardState() {
    // start by checking local storage
    var ls = localStorage.getItem("TicTacToe");

    // Access some stored data
    // alert("TicTacToeState = " + localStorage.getItem("TicTacToe"));

    if (ls !== null) {
        gameState = JSON.parse(ls); 
    } else {
        ResetGame();
    }
}

function ResetGame() {
    // Don't reset the win count
    var tempXWinCount = gameState.XWinCount === null ? 0 : gameState.XWinCount;
    var tempOWinCount = gameState.OWinCount === null ? 0 : gameState.OWinCount;
    var tempTieCount = gameState.TieWins === null ? 0 : gameState.TieWins;
    
    gameState = {
        board: [
            ['', '', ''],
            ['', '', ''],
            ['', '', '']
        ],
        Next: "X",
        Winner: "",
        XWinCount: tempXWinCount,
        OWinCount: tempOWinCount,
        TieWins: tempTieCount
    };
    document.getElementById('AIPlayerMove').disabled = false;
    SaveBoardState();
    InitializeBoard();
}

function ResetWinCount() {
    gameState.XWinCount = 0;
    gameState.OWinCount = 0;
    gameState.TieWins = 0;
    SaveBoardState();
    LoadBoardState();
    UpdateScreenState();
}

function SaveBoardState() {
    localStorage.setItem("TicTacToe", JSON.stringify(gameState));
}

function InitializeBoard() {
    LoadBoardState();

    // add events for when the users click on squares.
    document.querySelectorAll('.sq').forEach((element) => {
        // TODO: bug, after a reload we don't want to add an event to existing locations.
        element.addEventListener('click', MainGameLogic);
    });

    // Update the screen so it is ready to go for the first turn.
    UpdateScreenState();
}

// Use our gameState data to update what is displayed on our app page
function UpdateScreenState() {
    // If there is a winner show it.
    if (gameState.Winner === "") {
        document.getElementById('Winner').innerText = `It is ${gameState.Next}'s turn`;
    } else {
        document.getElementById('AIPlayerMove').disabled = true;
        if (gameState.Winner == "Tie") {
            document.getElementById('Winner').innerText = `The game is a Tie`;
        } else {
            document.getElementById('Winner').innerText = `The winner is ${gameState.Winner}`;
        }
    }

    // Update the Win Counts
    document.getElementById("XWins").innerText = `X has won ${gameState.XWinCount} total times.`;
    document.getElementById("OWins").innerText = `O has won ${gameState.OWinCount} total times.`;
    document.getElementById("TieWins").innerText = `Tied games ${gameState.TieWins} total times.`;
    
    // Update each of the board squares based on gameState
    for (let row = 0; row <= 2; row++) {
        for (let col = 0; col <= 2; col++) {
            document.getElementById(row.toString() + col.toString()).innerText = gameState.board[row][col];
        }
    }

    SaveBoardState();
}

// Event based game loop, called when the user click/chooses a game board square.
function MainGameLogic(event) {
    // event.target.id[0] returns a string, so we need to convert it to a number.
    let row = Number(event.target.id[0]);
    let col = Number(event.target.id[1]);

    // add the next X or O
    gameState.board[row][col] = gameState.Next;
    // change the next X or O
    gameState.Next = gameState.Next === "X" ? "O" : "X";

    // remove the event from the grid so there is no new event
    event.target.removeEventListener('click', MainGameLogic);

    // Check to see if we have a winner
    if (CheckForWinner()) {
        // After we have a winner remove the events for remaining squares so they don't fire.
        for (let row = 0; row <= 2; row++) {
            for (let col = 0; col <= 2; col++) {
                if (gameState.board[row][col] === "") {
                    document.getElementById(`${row}${col}`).removeEventListener('click', MainGameLogic);
                }
            }
        }
    };

    UpdateScreenState();
}

// Break out the test for a specific player win.
// Return 'X' or 'O' of the winner, 'Tie' for a full board, '' for no current winner.
function TestForWin(TestBoard) {
    // Setup the variable we are going to return.
    let Winner = '';
   
    // Here is the simplest logic for checking every possibility for win.
    let row1 = TestBoard[0][0] + TestBoard[0][1] + TestBoard[0][2];
    let row2 = TestBoard[1][0] + TestBoard[1][1] + TestBoard[1][2];
    let row3 = TestBoard[2][0] + TestBoard[2][1] + TestBoard[2][2];
    
    // first check to see of the board is full
    if (row1.length + row2.length + row3.length === 9) {
        Winner = "Tie";
    }
    
    // check rows for win
    if (row1 === "XXX" || row2 === "XXX" || row3 === "XXX") {
        Winner = "X";
    }
    if (row1 === "OOO" || row2 === "OOO" || row3 === "OOO") {
        Winner = "O";
    }

    // check cols for win
    let col1 = TestBoard[0][0] + TestBoard[1][0] + TestBoard[2][0];
    let col2 = TestBoard[0][1] + TestBoard[1][1] + TestBoard[2][1];
    let col3 = TestBoard[0][2] + TestBoard[1][2] + TestBoard[2][2];    
    if (col1 === "XXX" || col2 === "XXX" || col3 === "XXX") {
        Winner = "X";
    }
    if (col1 === "OOO" || col2 === "OOO" || col3 === "OOO") {
        Winner = "O";
    }

    // check diagonal for win
    let x1 = TestBoard[0][0] + TestBoard[1][1] + TestBoard[2][2];
    let x2 = TestBoard[0][2] + TestBoard[1][1] + TestBoard[2][0];
    if (x1 === "XXX" || x2 === "XXX") {
        Winner = "X";
    }
    if (x1 === "OOO" || x2 === "OOO") {
        Winner = "O";
    }

    return Winner;
}

function CheckForWinner() {
    let Winner = TestForWin(gameState.board);
    gameState.Winner = Winner;
    if (Winner === "X") {
        gameState.XWinCount ++;
    }
    if (Winner === "O") {
        gameState.OWinCount ++;
    }
    if (Winner === "Tie") {
        gameState.TieWins ++;
    }

    // Return true if the a winner has been found.
    return (gameState.Winner.length > 0);
}

// Play the next players move
function AIPlayerMove() {
    let PlayLocations = [];
    let PlayLocation = { row: null, col: null };

    // Strategy
    let NextPlayer = gameState.Next;

    // 1. Check the next move for a win location.
    //  Test all empty locations to see if the player can win using it.
    let TestRow = 0;
    let TestCol = 0;
    gameState.board.map(ColArray => {
        TestCol = 0;
        ColArray.map(cell => {
            if (cell === "") {
                gameState.board[TestRow][TestCol] = NextPlayer;
                let test = TestForWin(gameState.board);
                if (test === NextPlayer) {
                    // add the winning location to the array of choices
                    PlayLocations.push({ row: TestRow, col: TestCol });
                }
                gameState.board[TestRow][TestCol] = "";
            };
            TestCol++;
        });
        TestRow++;
    });

    // 2. Check for a block of the other user, next location
    if (PlayLocations.length === 0) {
        let LastPlayer = gameState.Next === "X" ? "O" : "X";
        TestRow = 0;
        gameState.board.map(ColArray => {
            TestCol = 0;
            ColArray.map(cell => {
                if (cell === "") {
                    gameState.board[TestRow][TestCol] = LastPlayer;
                    let test = TestForWin(gameState.board);
                    if (test === LastPlayer) {
                        // add the Blocking location to the array of choices
                        PlayLocations.push({ row: TestRow, col: TestCol });
                    }
                    gameState.board[TestRow][TestCol] = "";
                };
                TestCol++;
            });
            TestRow++;
        });
    };

    // 3. If the center location is available, choose it.
    if (PlayLocations.length === 0 && gameState.board[1][1] === "") {
        PlayLocations.push({ row: 1, col: 1 });
    };

    // 4. TODO: Setup for a double potential win.

    // 5. random select empty cell
    if (PlayLocations.length === 0) {
        TestRow = 0;
        gameState.board.map(ColArray => {
            TestCol = 0;
            ColArray.map(cell => {
                if (cell === "") {
                    // add the empty location to the array of choices
                    PlayLocations.push({ row: TestRow, col: TestCol });
                };
                TestCol++;
            });
            TestRow++;
        });
    };
    
    if (PlayLocations.length > 0) {
        // randomly choose a location from your choices
        let index = Math.floor(Math.random() * PlayLocations.length);
        PlayLocation = { row: PlayLocations[index].row, col: PlayLocations[index].col };
    };

    // asign the ai location
    gameState.board[PlayLocation.row][PlayLocation.col] = NextPlayer;
    // change the next X or O
    gameState.Next = gameState.Next === "X" ? "O" : "X";
    // remove the event from the grid so there is no new event
    document.getElementById(`${PlayLocation.row}${PlayLocation.col}`).removeEventListener('click', MainGameLogic);
    // Check to see if we have a winner
    if (CheckForWinner()) {
        // After we have a winner remove the events for remaining squares so they don't fire.
        for (let row = 0; row <= 2; row++) {
            for (let col = 0; col <= 2; col++) {
                if (gameState.board[row][col] === "") {
                    document.getElementById(`${row}${col}`).removeEventListener('click', MainGameLogic);
                }
            }
        }
    };
    UpdateScreenState();
}