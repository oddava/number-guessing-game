document.addEventListener('DOMContentLoaded', () => {
    const languageSelector = document.querySelector('.language-selector');
    const content = document.querySelector('.content');

    let translations = {};

    // Load default language
    loadLanguage('en');

    // Add event listener for language change
    languageSelector.addEventListener('change', (e) => {
        loadLanguage(e.target.value);
    });

    function loadLanguage(lang) {
        fetch(`assets/languages/${lang}.json`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to load ${lang}.json: ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                translations = data;
                applyTranslations(data);
            })
            .catch(error => console.error('Error loading language file:', error));
    }

    function applyTranslations(translations) {
        const elements = content.querySelectorAll('[data-translate]');
        elements.forEach(element => {
            const key = element.getAttribute('data-translate');
            element.innerHTML = translations[key] || key;
        });
    }

    function translate(key, params = {}) {
        let translation = translations[key] || key;
        for (const [param, value] of Object.entries(params)) {
            translation = translation.replace(`{${param}}`, value);
        }
        return translation;
    }


    submitBtn.addEventListener("click", () => {
        const guessInfo = checkGuess(userGuess.value, computerGuess);
        previous_guesses.push(Number(userGuess.value));
        numberOfGuessesLeft -= 1;
        guessField.style.display = "block";
        statusField.style.display = "block";
        introField.style.display = "none";
    
        let resultText, infoText, statusText;
    
        if (isGameOver(numberOfGuessesLeft)) {
            resultText = translate('game_over_result', { number: computerGuess });
            infoText = translate('game_over_info', { previous_guesses: previous_guesses.join(', ') });
            statusText = translate('game_over_status', { tries_left: numberOfGuessesLeft });
    
            inputField.style.display = "none";
            playAgainBtn.style.display = "block";
        } else {
            switch (guessInfo) {
                case "low":
                    resultText = translate('low_result');
                    infoText = translate('game_over_info', { previous_guesses: previous_guesses.join(', ') });
                    statusText = translate('game_over_status', { tries_left: numberOfGuessesLeft });
                    break;
                case "high":
                    resultText = translate('high_result');
                    infoText = translate('game_over_info', { previous_guesses: previous_guesses.join(', ') });
                    statusText = translate('game_over_status', { tries_left: numberOfGuessesLeft });
                    break;
                default:
                    resultText = translate('correct_result');
                    infoText = translate('game_over_info', { previous_guesses: previous_guesses.join(', ') });
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
    });
    
    playAgainBtn.addEventListener("click", () => {
        resetGame();
    });
    

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

const userGuess = document.getElementById("user-guess");
const submitBtn = document.getElementById("submit");
const playAgainBtn = document.querySelector(".play-again");

const resultField = document.querySelector(".result"),
    guessField = document.querySelector(".guess-field"),
    infoField = document.querySelector("#info-text"),
    statusField = document.querySelector("#status-text"),
    introField = document.querySelector(".introduction"),
    inputField = document.querySelector("#input-container");

let computerGuess = Math.floor(Math.random() * 100) + 1;
let previous_guesses = [];
let numberOfGuessesLeft = 10;

function checkGuess(num, computerGuess) {
    num = Number(num);
    let status = num === computerGuess ? true : false;
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