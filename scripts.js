var START = "Start";
var STOP = "Stop";

var start;
var end;
var current = 0;

var button = document.getElementById("start-stop");
var inputBox = document.getElementById("input-text");
var textToType = Array.from(document.getElementById("text-to-type").textContent);

button.addEventListener("click", mainButton);
inputBox.addEventListener("keypress", function(e){
    console.log(e.key);
    console.log(textToType);
    if(e.key === textToType[current]){
        console.log(true);
        current++;
    }
});

function mainButton(){
    console.log("started");
    if(button.innerText === START){  
        button.innerText = STOP;  
        inputBox.value = "";
        inputBox.focus();
        start = new Date();
    }else{
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
