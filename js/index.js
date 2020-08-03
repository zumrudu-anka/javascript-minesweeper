document.addEventListener("DOMContentLoaded", () => {
    let playButton = document.querySelector(".startButton");
    let difficultOptions = document.querySelectorAll(".chooseDifficult");
    let difficultToBoardSizesAndBombAmount = {
        0 : "9x9:10",
        1 : "16x16:40",
        2 : "30x16:99"
    }

    let boardWidth = 0;
    let boardHeight = 0;
    let bombAmount = 0;
    let mainMenu = document.querySelector(".mainMenu");
    let title = document.querySelector("header h1");
    playButton.addEventListener('click', ()=>{
        let isDifficultChosen = false;
        difficultOptions.forEach(option => {
            if(option.checked){
                isDifficultChosen = true;
                boardWidth = parseInt(difficultToBoardSizesAndBombAmount[option.value].split("x")[0]);
                boardHeight = parseInt(difficultToBoardSizesAndBombAmount[option.value].split("x")[1].split(":")[0]);
                bombAmount = parseInt(difficultToBoardSizesAndBombAmount[option.value].split("x")[1].split(":")[1]);
                
                title.style.animation = "titleAnim 0.5s linear forwards";

                createBoard();
            }
        });
        if(!isDifficultChosen){
            alert("Please select difficulty");
        }
    });

    const gameBoard = document.querySelector(".gameBoard");
    // let width = 10;
    let flags = 0;
    let squares = [];
    let isGameOver = false;

    let gameOver = (square) =>{
        isGameOver = true;

        //Show ALL the bombs
        squares.forEach(square => {
            if(square.classList.contains('bomb')){
                square.innerHTML = '💣';
                square.classList.remove('bomb');
                square.classList.add('gameOver');
            }
        });
    };

    let checkForWin = () => {
        let matches = 0;
        for(let i = 0; i< squares.length; i++){
            if(squares[i].classList.contains('flag') && squares[i].classList.contains('bomb')){
                matches++;
            }
            if(matches === bombAmount){
                console.log('YOU WIN!');
                isGameOver = true;
            }
        }
    }

    let addFlag = (square) =>{
        if(isGameOver){
            return;
        }
        if(!square.classList.contains('checked') && (flags < bombAmount)){
            if(!square.classList.contains('flag')){
                square.classList.add('flag');
                square.innerHTML = '🚩';
                flags++;
                checkForWin();
            }
            else{
                square.classList.remove('flag');
                square.innerHTML = '';
                flags--;
            }
        }
    };

    //check neighboring squares once square is clicked
    let checkSquare = (square, currentId) =>{
        const isLeftEdge = (currentId % boardWidth === 0);
        const isRightEdge = (currentId % boardWidth === boardWidth - 1);

        setTimeout(() =>{
            if(currentId > 0 && !isLeftEdge){
                const newId = squares[parseInt(currentId) - 1].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
            if(currentId < squares.length && !isRightEdge){
                const newId = squares[parseInt(currentId) + 1].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
            if(currentId > (boardWidth - 1)){
                const newId = squares[parseInt(currentId) - boardWidth].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
            if(currentId < (squares.length - boardWidth)){
                const newId = squares[parseInt(currentId) + boardWidth].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
            if(currentId > (boardWidth - 1) && !isLeftEdge){
                const newId = squares[parseInt(currentId) - boardWidth - 1].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
            if(currentId > (boardWidth - 1) && !isRightEdge){
                const newId = squares[parseInt(currentId) - boardWidth + 1].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
            if(currentId < (squares.length - boardWidth) && !isLeftEdge){
                const newId = squares[parseInt(currentId) + boardWidth - 1].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
            if(currentId < (squares.length - boardWidth) && !isRightEdge){
                const newId = squares[parseInt(currentId) + boardWidth + 1].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
            
        }, 10);
    };

    let click = (square) => {
        let currentId = square.id;
        if(isGameOver){
            return;
        }
        if(square.classList.contains('checked') || square.classList.contains('flag'))
        {
            return;
        }
        if(square.classList.contains('bomb')){
            gameOver(square);
        }
        else{
            let total = square.getAttribute('data');
            if(total != 0){
                square.classList.add('checked');
                square.innerHTML = total;
                square.classList.add(`bombCountIs${total}`);
                return;
            }
            checkSquare(square, currentId);
        }
        square.classList.add('checked');
    };

    //create Board
    let createBoard = () => {
        
        gameBoard.innerHTML = "";
        gameBoard.style.width = 40 * boardWidth + "px";
        gameBoard.style.height = 40 * boardHeight + "px";
        gameBoard.style.display = "flex";
        mainMenu.style.display = "none";

        //get shuffled game array with random bombs
        
        const bombArray = Array(bombAmount).fill('bomb');
        const emptyArray = Array(boardWidth * boardHeight - bombAmount).fill('valid');
        const gameArray = emptyArray.concat(bombArray);

        const shuffledArray = gameArray.sort(() => Math.random() - 0.5);
        for (let i = 0; i < boardWidth * boardHeight; i++) {
            const square = document.createElement("div");
            square.setAttribute("id", i);
            square.classList.add(shuffledArray[i]);
            gameBoard.appendChild(square);
            squares.push(square);

            //normal click
            square.addEventListener('click', () =>{
                click(square);
            });

            //add flag with right click
            square.oncontextmenu = (e) =>{
                e.preventDefault();
                addFlag(square);
            }
        }

        //add numbers
        for (let i = 0; i < squares.length; i++) {
            let total = 0;
            const isLeftEdge = (i % boardWidth === 0);
            const isRightEdge = (i % boardWidth === boardWidth - 1);

            if(squares[i].classList.contains('valid')){
                // left square check
                if(i > 0 && !isLeftEdge && squares[i - 1].classList.contains('bomb')){
                    total++;
                }

                //right square check
                if(i < (squares.length - 1) && !isRightEdge && squares[i + 1].classList.contains('bomb')){
                    total++;
                }

                //upper square check
                if(i > (boardWidth - 1) && squares[i - boardWidth].classList.contains('bomb')){
                    total++;
                }

                //lower square check
                if(i < (squares.length - boardWidth) && squares[i + boardWidth].classList.contains('bomb')){
                    total++;
                }

                //upper left square check
                if(i > (boardWidth - 1) && !isLeftEdge && squares[i - 1 - boardWidth].classList.contains('bomb')){
                    total++
                }

                //upper right square check
                if(i > (boardWidth - 1) && !isRightEdge && squares[i + 1 - boardWidth].classList.contains('bomb')){
                    total++;
                }

                //lower left square check
                if(i < (squares.length - boardWidth) && !isLeftEdge && squares[i - 1 + boardWidth].classList.contains('bomb')){
                    total++;
                }

                //lower right square check
                if(i < (squares.length - boardWidth) && !isRightEdge && squares[i + 1 + boardWidth].classList.contains('bomb')){
                    total++;
                }
                squares[i].setAttribute('data', total);
            }
        }
    };

});