var gotten;
var START = "Start";
var STOP = "Stop";

var start;
var end;
var current;
var wrong; //keeps track of mistakes currently in box
var incorrect; //keeps track of all mistakes to track accuracy
var running = false;

var button = document.getElementById("start-button");
var inputBox = document.getElementById("input-text");
var toTypeDiv = document.getElementById("text-to-type");
var authorDiv = document.getElementById("author");
var authorName = '';
var textToType = Array.from(document.getElementById("text-to-type").textContent);


const http = new XMLHttpRequest;
const url = 'https://quotes15.p.rapidapi.com/quotes/random/';

button.disabled = true;

function callAPI(){
    http.open("GET", url);
    http.setRequestHeader('X-RapidAPI-Host', 'quotes15.p.rapidapi.com');
    http.setRequestHeader('X-RapidAPI-Key', '82e49981edmsh51f070fdf1cb9dap1930d5jsn458ee671c233')
    http.send();
}

http.onreadystatechange=(e)=>{
    gotten = JSON.parse(http.responseText);
    console.log(gotten);
    textToType = gotten['content'];
    authorName = gotten['originator']['name'];
    setText();
}

function setText(){
    toTypeDiv.textContent = textToType;
    authorDiv.textContent = '- ' + authorName;
    button.disabled = false;
}

button.addEventListener("click", mainButton);
inputBox.addEventListener("keypress", function(e){
    if(running){
        console.log(e.key);
        console.log(textToType[current]);
        if(e.key === textToType[current] && current === inputBox.selectionStart){
            inputBox.style.background = "green";
            console.log(true);
            current++;
            wrong--;
            if(wrong<0){
                wrong = 0;
            }
        }else{
            inputBox.style.background = "red";
            wrong++;
            incorrect++;
            console.log(incorrect);
        }
    }
});
inputBox.addEventListener("keyup", function(e){
    if(wrong === 0 && current === textToType.length){
        endGame();
    }
});
inputBox.addEventListener("keydown", function(e){
    if(running){
        if(e.keyCode === 8 && wrong === 0 && inputBox.selectionStart === current){
            current--;
            if(current < 0){
                current = 0;
            }
        }
    }
});
document.body.addEventListener("click", function(e){
    if(running){
        inputBox.focus();
    }
})

function mainButton(){
    console.log("started");
    button.disabled = true;
    inputBox.disabled = false;
    current = 0;
    wrong = 0;
    incorrect = 0;  
    running = true;
    inputBox.value = "";
    inputBox.focus();
    start = new Date();
    console.log(current + ", " + wrong + ", " + incorrect);
}

function endGame(){
    running = false;
    var fullText = inputBox.value;
    button.innerText = START;
    end = new Date();
    var fullTime = ((end.getTime() - start.getTime()));
    var spaces = 0;
    var i = 0;
    for(i; i<fullText.length; i++){
        if(fullText[i] === " "){
            spaces++;
        }
    }
    alert("You typed " + getWPM(fullTime, spaces+1) + " wpm with an accuracy of " + Math.round((((textToType.length-incorrect) / textToType.length)*100)) + "%.");
    inputBox.value = "";
    inputBox.style.background = "white";
    inputBox.disabled = true;
    toTypeDiv.innerText = "Loading..."
    callAPI();
}

function getWPM(time, words){
    return Math.round(words/(time/60000));
}