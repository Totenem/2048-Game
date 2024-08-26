// console.log("Lesgoo")

// Declare variables for 2d array, score, row, and columns
let board;
let score = 0;
let rows = 4;
let columns = 4;
let is2048Exist = false;
let is4096Exist = false;
let is8192Exist = false;
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;
// Function to set the game
// Start of setGame()
function setGame() {
    // Initialize the game board
    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ]

    // Create the game board now on the page
    // First loop is to create rows, second is to create columns
    // Inner loop will be executed first before outer loop
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            // console.log('[r${r}-c${c}]');

            //Crteate a div element representing a tile
            let tiles = document.createElement("div");

            // Set a unique id for each tile base on its coordinates
            tiles.id = r.toString() + "-" + c.toString();

            // to get the number from the board
            let num = board[r][c];

            // Update the tile's appearance based on the value
            updateTile(tiles, num);

            // Placing the tile inside the board, in right column and row
            document.getElementById("board").append(tiles);
        }
    }

    setTwo();
    setTwo();

}
// End of setGame()

// Start of  updateTile();
function updateTile(tiles, num) {
    // clear the tile text
    tiles.innerText = "";

    // clear the classlist to avoid multiple class
    tiles.classList.value = "";

    // add class named "tile" to the classList
    tiles.classList.add("tiles")

    // check if the current num parameter is not zero
    if (num > 0) {
        //set the tile text to the number based on the num value
        tiles.innerText = num.toString();

        if (num <= 4096) {
            tiles.classList.add("x" + num.toString());
        }
        else {
            tiles.classList.add("x8192")
        }
    }
}
// End of  updateTile();

// start of  window.onload

//event that triggers when a webpage is done loading
window.onload = function () {
    setGame();

    document.addEventListener('touchstart', handleTouchStart, false);
    document.addEventListener('touchmove', handleTouchMove, false);
    document.addEventListener('touchend', handleTouchEnd, false);
}

//end of window.onload

// Start handleSlide()
// "e" represent the event object
function handleSlide(e) {
    console.log(e.code);

    if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.code)) {
        // Prevent scrolling when player plays on its arrow keys
        e.preventDefault();

        //function controls
        if (e.code == "ArrowLeft") {
            slideLeft();
            setTwo()
        }
        else if (e.code == "ArrowRight") {
            slideRight()
            setTwo()
        }
        else if (e.code == "ArrowUp") {
            slideUp()
            setTwo()
        }
        else if (e.code == "ArrowDown") {
            slideDown()
            setTwo()
        }

        document.getElementById("score").innerText = score;

        setTimeout(() => {
            if (hasLost()) {
                alert("Game over T-T. Game will restart");
                restartGame();
                alert("Press any arrow key to star new game!");
            } else {
                checkWin();
            }
        }, 100); // delay for allert
    }

}

document.addEventListener("keydown", handleSlide);
// End handleSlide()

document.addEventListener('touchstart', function(e) {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
});

document.addEventListener('touchmove', function(e) {
    e.preventDefault();
}, { passive: false });

document.addEventListener('touchend', function(e) {
    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
});

function handleSwipe() {
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal swipe
        if (deltaX > 0) {
            slideRight();
        } else {
            slideLeft();
        }
    } else {
        // Vertical swipe
        if (deltaY > 0) {
            slideDown();
        } else {
            slideUp();
        }
    }

    setTwo();
    document.getElementById("score").innerText = score;

    setTimeout(() => {
        if (hasLost()) {
            alert("Game over T-T. Game will restart");
            restartGame();
            alert("Press any arrow key or swipe to start a new game!");
        } else {
            checkWin();
        }
    }, 100); // delay for alert
}

// start of filterZero(tiles)
// removing empty tiles
function filterZero(tiles) {
    // create a new array removung the zeroes
    return tiles.filter(num => num != 0);

}
// end of filterZero(tiles)


// start of slide(tiles)
// for sliding and merging tiles
function slide(tiles) {
    tiles = filterZero(tiles);

    for (let i = 0; i < tiles.length; i++) {

        // if two adjacent numbers are equal
        if (tiles[i] == tiles[i + 1]) {
            //merge them by doubling the first one
            tiles[i] *= 2;
            // set the second one to zero
            tiles[i + 1] = 0;
            score += tiles[i];

        }
    }


    tiles = filterZero(tiles);

    while (tiles.length < 4) {
        //add zero on the end of the array(create the othere columns)
        tiles.push(0);
    }

    return tiles;

}
// end of slide(tiles)

// Start of slideLeft()
function slideLeft() {
    for (let r = 0; r < rows; r++) {

        // store current row in the row variable
        let row = board[r];

        // for animation
        let orginalRow = row.slice();

        // slide() function, will return a new value ona specific row
        row = slide(row);

        // Updated value in the board
        board[r] = row;
        for (let c = 0; c < columns; c++) {
            let tiles = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];

            // line for animation
            if (orginalRow[c] !== num && num !== 0) {
                tiles.style.animation = "slide-from-right 0.3s";

                setTimeout(() => {
                    tiles.style.animation = "";
                }, 300)
            }
            updateTile(tiles, num);
        }
    }
}
// End of slideLeft()

// Start of slideRight()
function slideRight() {
    for (let r = 0; r < rows; r++) {

        // store current row in the row variable
        let row = board[r];

        // for animation
        let orginalRow = row.slice();

        //reverse the row array since its slide to right
        row.reverse();

        // slide() function, will return a new value ona specific row
        row = slide(row);

        row.reverse();

        // Updated value in the board
        board[r] = row;
        for (let c = 0; c < columns; c++) {
            let tiles = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];

            // line for animation
            if (orginalRow[c] !== num && num !== 0) {
                tiles.style.animation = "slide-from-left 0.3s";

                setTimeout(() => {
                    tiles.style.animation = "";
                }, 300)
            }

            updateTile(tiles, num);
        }
    }
}
// End of slideRight()

// Start of slideUp()
function slideUp() {
    for (let c = 0; c < columns; c++) {

        // create a temporary array column that represents the column
        let col = [
            board[0][c],
            board[1][c],
            board[2][c],
            board[3][c]
        ]

        let orginalCol = col.slice();

        col = slide(col);

        for (let r = 0; r < rows; r++) {
            // set the values of board array back to the values of the modified columns
            board[r][c] = col[r];

            let tiles = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];

            if(orginalCol[r] !== num && num !== 0){
                tiles.style.animation = "slide-from-bottom 0.3s";

                setTimeout(() =>{
                    tiles.style.animation = "";
                }, 300)
            }
            updateTile(tiles, num);
        }
    }
}
// End of slideUp()

// Start of slideDown()
function slideDown() {
    for (let c = 0; c < columns; c++) {

        // create a temporary array column that represents the column
        let col = [
            board[0][c],
            board[1][c],
            board[2][c],
            board[3][c]
        ]

        let orginalCol = col.slice();

        col.reverse();
        col = slide(col);
        col.reverse();

        for (let r = 0; r < rows; r++) {
            // set the values of board array back to the values of the modified columns
            board[r][c] = col[r];

            let tiles = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];

            if(orginalCol[r] !== num && num !== 0){
                tiles.style.animation = "slide-from-top 0.3s";

                setTimeout(() =>{
                    tiles.style.animation = "";
                }, 300)
            }
            updateTile(tiles, num);
        }
    }
}
// End of slideDown()


// Start of hasEmptyTile()
function hasEmptyTile() {

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            // check if current tile is equal to 0, if yes return true
            if (board[r][c] == 0) {
                return true;
            }
        }
    }

    // no tile is equal 0
    return false;
}
// End of hasEmptyTile()

// Start of setTwo() (add random 2 tile in the game baord)
function setTwo() {
    if (!hasEmptyTile()) {
        return;
    }

    // Declare a value found tile
    let found = false;

    // will run until random empty tile is found
    while (!found) {
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);

        if (board[r][c] == 0) {
            board[r][c] = 2;
            let tiles = document.getElementById(r.toString() + "-" + c.toString());
            tiles.innerText = "2"
            tiles.classList.add("x2");

            // set the found var to true

            found = true;
        }
    }
}
// End of setTwo()

// start of checkWin()
function checkWin() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            // check if the current tile is win

            if (board[r][c] == 2048 && is2048Exist == false) {
                alert("You win!");
                is2048Exist = true; //when true, it will not alret again if another 2048 appear
            }
            else if (board[r][c] == 4096 && is4096Exist == false) {
                alert("Wow you're on 4096!");
                is4096Exist = true;
            }
            else if (board[r][c] == 8192 && is8192Exist == false) {
                alert("Absolute Victory!!")
                is8192Exist = true;
            }
        }
    }
}
// end of checkWin()

// start of hasLost()
function hasLost() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            //if empty tile user is not lost
            if (board[r][c] == 0) {
                return false;
            }

            const currentTile = board[r][c]

            if (
                r > 0 && board[r - 1][c] === currentTile ||
                r < rows - 1 && board[r + 1][c] === currentTile ||
                c > 0 && board[r][c - 1] === currentTile ||
                c < columns - 1 && board[r][c + 1] === currentTile) {
                return false;
            }
        }
    }

    return true;
}
// End of hasLost()

// start of restartGame()
// RestartGame by replacing all values into zero.
function restartGame() {
    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];

    setTwo();   // new tile
    score = 0;

}
// end of restartGame()
