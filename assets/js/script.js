document.addEventListener('DOMContentLoaded', () => {
    const interBubble = document.querySelector('.interactive');
    let curX = 0;
    let curY = 0;
    let tgX = 0;
    let tgY = 0;

    const move = () => {
        curX += (tgX - curX) / 20;
        curY += (tgY - curY) / 20;
        interBubble.style.transform = `translate(${Math.round(curX)}px, ${Math.round(curY)}px)`;
        requestAnimationFrame(move);
    };

    window.addEventListener('mousemove', (event) => {
        tgX = event.clientX;
        tgY = event.clientY;
    });

    move();
});


// Assigning the DOM elements
const userGuess = document.getElementById("user-guess");
const submitBtn = document.getElementById("submit");
const playAgainBtn = document.querySelector(".play-again");

const resultField = document.querySelector(".result"),
guessField = document.querySelector(".guess-field"),
infoField = document.querySelector("#info-text"),
statusField = document.querySelector("#status-text"),
introField = document.querySelector(".introduction"),
inputField = document.querySelector("#input-container");

let computerGuess = Math.floor(Math.random() * 100)+1;
let previous_guesses = [];
let numberOfGuessesLeft = 10;

// Checks the user guess and returns wether it's correct or not
function checkGuess(num, cumputerguess) {
    num = Number(num);
    let status = num === cumputerguess ? true : false;
    if (!status) status = num < computerGuess ? "low" : "high";
    return status;
}

// Checks if the user hasn't run out of tries
function isGameOver(remainingGuessesCount) {
    const gameStatus = remainingGuessesCount === 0 ? true : false;
    return gameStatus;
}

// Resets the game to it's starting state
function resetGame() {
    previous_guesses = [];
    numberOfGuessesLeft = 10;
    introField.style.display = "block";
    inputField.style.display = "flex";
    guessField.style.display = "none";
    playAgainBtn.style.display = "none";
    userGuess.value = "";
}

submitBtn.addEventListener("click", () => {
    // retrieving the guess status (true, low, high)
    const guessInfo = checkGuess(userGuess.value, computerGuess);
    previous_guesses.push(Number(userGuess.value));
    numberOfGuessesLeft -= 1;
    guessField.style.display = "block";
    statusField.style.display = "block";
    introField.style.display = "none";

    // Defining the contents of the texts in specific cases
    let contents = {
        game_over: {
            "result text": `Limit exceed, game over!<br><span>The number was ${computerGuess}</span>`,
            "info text": `Previous guesses: ${previous_guesses}`,
            "status text": `${numberOfGuessesLeft} tries left.`
        },
        true: {
            "result text": "Correct! You guessed right!!",
            "info text": `Previous guesses: ${previous_guesses}`,
            "status text": ``
        },
        low: {
            "result text": "Your guess was too low!",
            "info text": `Previous guesses: ${previous_guesses}`,
            "status text": `${numberOfGuessesLeft} tries left.`
        },
        high: {
            "result text": "Your guess was too high",
            "info text": `Previous guesses: ${previous_guesses}`,
            "status text": `${numberOfGuessesLeft} tries left.`
        }
    }
    let resultText;
    let infoText;
    let statusText;
    
    if (isGameOver(numberOfGuessesLeft)){
        resultText  = contents.game_over['result text'];
        infoText  = contents.game_over['info text'];
        statusText  = contents.game_over['status text'];

        inputField.style.display = "none";
        playAgainBtn.style.display = "block";
    } else {
        switch (guessInfo) {
            case "low":
                resultText  = contents.low['result text'];
                infoText  = contents.low['info text'];
                statusText  = contents.low['status text'];
                break;
            case "high":
                resultText = contents.high['result text'];
                infoText = contents.high['info text'];
                statusText = contents.high['status text'];
                break
        
            default:
                resultText = contents.true['result text'];
                infoText = contents.true['info text'];
                statusField.style.display = "none";
                inputField.style.display = "none";
                introField.style.display = "none";

                playAgainBtn.style.display = "block";
                break;
        }
    }
    resultField.innerHTML = resultText;
    infoField.innerHTML = infoText;
    statusField.innerHTML = statusText;
    userGuess.focus();
    userGuess.value = "";
})

playAgainBtn.addEventListener("click", () => {
    resetGame();
})