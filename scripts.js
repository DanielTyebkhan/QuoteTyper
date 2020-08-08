var gotten;
var START = "Start";
var STOP = "Stop";
const keyboard = ["`", "~", "1", "!", "2", "@", "3", "#", "4", "$", "5",
    "%", "6", "^", "7", "&", "8", "*", "9", "(", "0", ")", "-", "_", "=", "+",
    "q", "Q", "w", "W", "e", "E", "r", "R", "t", "T", "y", "Y", "u", "U", "i",
    "I", "o", "O", "p", "P", "[", "{", "]", "}", "\\", "|", "a", "A", "s",
    "S", "d", "D", "f", "F", "g", "G", "h", "H", "j", "J", "k", "K", "l", "L",
    ";", ":", "'", "\"", "z", "Z", "x", "X", "c", "C", "v", "V", "b", "B",
    "n", "N", "m", "M", ",", "<", ".", ">", "/", "?", " "]

var start;
var end;
var current;
var wrong; //keeps track of mistakes currently in box
var incorrect; //keeps track of all mistakes to track accuracy
var running = false;
var shouldPrint = true; 
var previous;

var button = document.getElementById("start-button");
var inputBox = document.getElementById("input-text");
var toTypeDiv = document.getElementById("text-to-type");
var authorDiv = document.getElementById("author");
var authorName = '';
var textToType = Array.from(document.getElementById("text-to-type").textContent);


const http = new XMLHttpRequest;
const url = 'https://quotes15.p.rapidapi.com/quotes/random/';

button.disabled = true;

function callAPI() {
    http.open("GET", url);
    http.setRequestHeader('X-RapidAPI-Host', 'quotes15.p.rapidapi.com');
    http.setRequestHeader('X-RapidAPI-Key', '82e49981edmsh51f070fdf1cb9dap1930d5jsn458ee671c233')
    http.send();
}

http.onreadystatechange = async function (e) {
    if (http.status === 429) {
        await new Promise(r => setTimeout(r, 7000));
        callAPI();
    }
    else if (running === false) {
        var received = JSON.parse(http.responseText);
        textToType = received['content'];
        authorName = "- " + received['originator']['name'];
        while (isTypeable(textToType) === false) {
            await new Promise(r => setTimeout(r, 7000));
            callAPI();
        }
        setText();
    }
}

function setText() {
    toTypeDiv.textContent = textToType;
    authorDiv.textContent = authorName;
    if (running === false) 
        button.disabled = false;
}

button.addEventListener("click", mainButton);

inputBox.addEventListener("keypress", function (e) {
    if (running) {
        if (e.key === textToType[current] && current === inputBox.selectionStart) {
            current++;
            wrong--;
            wrong = Math.max(0, wrong);
            inputBox.style.background = "green";
        } else {
            inputBox.style.background = "red";
            wrong++;
            incorrect++;
        }
    previous = e.key;
    }
});

inputBox.addEventListener("keyup", function (e) {
    if ((wrong === 0 && current === textToType.length) || inputBox.value.length === textToType.length) {
        endGame();
    }
    shouldPrint = true;
});

inputBox.addEventListener("keydown", function (e) {
    if (shouldPrint === false && previous === e.key) {
        e.preventDefault();
        e.stopPropagation();
    } else {
        if (running) {
            if (e.keyCode === 8 && wrong === 0 && inputBox.selectionStart === current) {
                current--;
                current = Math.max(0, current);
            } else if (e.keyCode != 16){
                shouldPrint = false;
            }
        }
    }
});

document.body.addEventListener("click", function (e) {
    if (running) {
        inputBox.focus();
    }
})

function mainButton() {
    button.disabled = true;
    inputBox.disabled = false;
    current = 0;
    wrong = 0;
    incorrect = 0;
    running = true;
    inputBox.value = "";
    inputBox.focus();
    start = new Date();
}

function endGame() {
    running = false;
    var fullText = inputBox.value;
    button.innerText = START;
    end = new Date();
    var fullTime = ((end.getTime() - start.getTime()));
    var spaces = countSpaces(fullText);
    alert("You typed " + getWPM(fullTime, spaces + 1) + " wpm with an accuracy of " + getAccuracy(textToType.length, incorrect) + "%.");
    inputBox.value = "";
    inputBox.style.background = "white";
    inputBox.disabled = true;
    toTypeDiv.innerText = "Loading...";
    authorDiv.innerText = "";
    callAPI();
}

getWPM = (time, words) => Math.round(words / (time / 60000));

getAccuracy = (total, mistakes) =>   Math.round(((total - mistakes) / total) * 100); 

function countSpaces(text) {
    var spaces = 0;
    for (var i = 0; i < text.length; i++) {
        if (text[i] === " ") {
            spaces++;
        }
    }
    return spaces;
}

/*
Checks that a string can be typed on a standard keyboard

@param {contents} The contents to check for typability
@return true if it can be typed, else false
*/
function isTypeable(contents) {
    for (var i = 0; i < contents.length; i++) {
        if (!keyboard.includes(contents.charAt(i))) {
            return false;
        }
    }
    return true;
}