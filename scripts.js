var START = "Start";
var STOP = "Stop";

var start;
var end;
var current;
var wrong; //keeps track of mistakes currently in box
var incorrect; //keeps track of all mistakes to track accuracy
var running = false;

var button = document.getElementById("start-stop");
var inputBox = document.getElementById("input-text");
var textToType = Array.from(document.getElementById("text-to-type").textContent);

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
    var fullTime = ((end.getTime() - start.getTime()) / 1000);
    var spaces = 0;
    var i = 0;
    for(i; i<fullText.length; i++){
        if(fullText[i] === " "){
            spaces++;
        }
    }
    alert("You typed " + (Math.round(((spaces+1)/fullTime)*60)) + " wpm with an accuracy of " + Math.round((((textToType.length-incorrect) / textToType.length)*100)) + "%.");
    inputBox.value = "";
    inputBox.style.background = "white";
    button.disabled = false;
    inputBox.disabled = true;
}
