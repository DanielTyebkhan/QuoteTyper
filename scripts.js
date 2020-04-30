var START = "Start";
var STOP = "Stop";

var start;
var end;
var current = 0;
var wrong = 0;
var running = false;

var button = document.getElementById("start-stop");
var inputBox = document.getElementById("input-text");
var textToType = Array.from(document.getElementById("text-to-type").textContent);

button.addEventListener("click", mainButton);
inputBox.addEventListener("keypress", function(e){
    if(running){
        console.log(e.key);
        console.log(textToType[current]);
        if(e.key === textToType[current]){
            console.log(true);
            current++;
            wrong--;
            if(wrong<0){
                wrong = 0;
            }
        }else{
            wrong++;
        }
    }
});
inputBox.addEventListener("keydown", function(e){
    if(running){
        if(e.keyCode === 8 && wrong === 0){
            current--;
            if(current < 0){
                current = 0;
            }
        }
    }
})

function mainButton(){
    console.log("started");
    if(button.innerText === START){  
        running = true;
        button.innerText = STOP;  
        inputBox.value = "";
        inputBox.focus();
        start = new Date();
    }else{
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
        inputBox.value = "";
        current = 0;
        alert("You typed " + (Math.round(((spaces+1)/fullTime)*60)) + " wpm");
    }
}
