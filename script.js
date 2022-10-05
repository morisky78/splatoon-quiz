//buttons
var startBtn = document.querySelector("#start-btn");
var homeBtn = document.querySelector("#home-btn");
var initSubmitBtn = document.querySelector("#initSubmit");
var playAgainBtn = document.querySelector("#play-again");
var ScoreBtn = document.querySelector("#score-btn")
var resetBtn = document.querySelector("#reset")

// main area sections (home / gamestage / gameover/ scoreboard)
var homeSection = document.querySelector("#home");
var gameStageSection = document.querySelector("#game-stage");
var gameOverSection = document.querySelector("#gameover");
var scoreSection = document.querySelector("#scorebox");

// quiz part
var qImgEl = document.querySelector("#q-img");
var qQuestionEl = document.querySelector("#q-question");
var qChoicesEl = document.querySelector("#q-choices");

// etc. elements
var timeLeftSpan = document.querySelector("#time-left");
var gameOverMsgEl = document.querySelector("#game-over-msg");
var pointSpan = document.querySelector("#point");
var nameInput = document.querySelector("#gamer-name");
var scoreListDiv = document.querySelector("#score-list");
var gameOverImg = document.querySelector("#game-over-img");

var curQ = 0;
var numOfQuestions = quizSet.length;
// total game time in second
var gameTime = 100;
// delay after a choice is clicked. (in millisecond)
var delaySec = 1000;

var timer;
var timeLeft;
var numCorrect;

// Randomize array in-place using Durstenfeld shuffle algorithm (link on README)
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

// Print out a Quiz set (image, question, choices) 
// and add event listerner on choices
function displayQuestion(i) {
    console.log("display question #"+i);
    console.log(quizSet[i]);

    qImgEl.setAttribute("src", quizSet[i].imgsrc);
    qQuestionEl.innerHTML = "<strong>[<span>Q"+(curQ+1)+"</span>/"+numOfQuestions+"]</strong> "+quizSet[i].q;

    qChoicesEl.textContent = '';

    // show choices in random order
    shuffleArray(quizSet[i].choices);

    for (let x = 0; x < quizSet[i].choices.length; x++) {
        var aChoice = document.createElement("li");
        aChoice.textContent = quizSet[i].choices[x];
        qChoicesEl.appendChild(aChoice);
    }

    qChoicesEl.addEventListener("click", choiceClicked );

}

// Print out scores from local storage
function showScores() {
    // clear timer, and hide all other main section.
    clearInterval(timer);
    homeSection.style.display="none";
    gameStageSection.style.display="none";
    gameOverSection.style.display = "none";
    scoreSection.style.display="block";
    homeBtn.style.display='block';

    var scoreRecordStr = localStorage.getItem("HighScoreArray") ;
    // cleardata
    scoreListDiv.innerHTML = '';
    
    // if there is no stored data, do not excute below. show the defualt message
    if ( !scoreRecordStr ) {
        scoreListDiv.innerHTML = '<p class="nodata"><img src="assets/images/purplepainting.jpg" alt="Just painting"/>No data yet!</p>';
        return;
    } 

    var scoreArr = scoreArr = JSON.parse(scoreRecordStr) ;

    scoreArr.sort((a,b) => b.point - a.point);

    var listTable = document.createElement("table");
   
    // create a table and table header 
    var listTr = document.createElement("tr");
    var listTh_name = document.createElement("th");
    listTh_name.textContent = 'Name';
    listTr.appendChild(listTh_name);
    var listTh_correct = document.createElement("th");
    listTh_correct.textContent = 'Correct #';
    listTr.appendChild(listTh_correct);
    var listTh_point = document.createElement("th");
    listTh_point.textContent = 'Scores';
    listTr.appendChild(listTh_point);
    listTable.appendChild(listTr);
    scoreListDiv.appendChild(listTable); 

    // print each data
    for (let i = 0; i < scoreArr.length; i++) {
        console.log(scoreArr[i].name);   

        var listTr = document.createElement("tr");
        var listTd_name = document.createElement("td");
        listTd_name.textContent = scoreArr[i].name;
        listTd_name.setAttribute("class", "ini");
        listTr.appendChild(listTd_name);

        var listTd_correct = document.createElement("td");
        listTd_correct.textContent = scoreArr[i].correct;
        listTr.appendChild(listTd_correct);

        var listTd_point = document.createElement("td");
        listTd_point.textContent = scoreArr[i].point;
        listTr.appendChild(listTd_point);

        listTable.appendChild(listTr);
        scoreListDiv.appendChild(listTable); 
        
    }

}


function gameOver(){
    console.log("Game Over!");
    // clear timer, and hide other main sections
    clearInterval(timer);
    gameStageSection.style.display = 'none';
    gameOverSection.style.display = "block";
    pointSpan.textContent = timeLeft;
    nameInput.value="";

    // when game is over becuase time ran out, show different msg, and image
    if (timeLeft > 0){
        gameOverMsgEl.textContent = "Congrats!";
    } else{
        gameOverMsgEl.textContent = "Time's up! Too bad..."
        gameOverImg.setAttribute("src", "assets/images/timeover.png");
    }
    
    // Gaveover-Your scroe message: You scored x points! /  0 point.
    var scoreStr = timeLeft + ' point';
    if (timeLeft > 1) {
        scoreStr += 's!';
    }  else {
        scoreStr += '.';
    }
    pointSpan.textContent = scoreStr;
}


function choiceClicked(event) {
    
    var clickedEl = event.target;
    if ( !clickedEl.matches("li")) return;

    console.log(clickedEl.textContent+" clicked!");

    // after a choice is clicked, user can't click another answer until new question shows up
    qChoicesEl.removeEventListener("click", choiceClicked );

    // an element created in choice <LI> to show correct / wrong msg
    var correctMsg;
    var correctSpan = document.createElement("span");

    // correct answer
    if ( quizSet[curQ].answer == clickedEl.textContent ) {
        
        clickedEl.setAttribute("class", "clicked-right");
        correctMsg = 'correct';

        numCorrect++;
    } else{
        // alert("wrong");
        // when wrong answered, time is subtracted 
        clickedEl.setAttribute("class", "clicked-wrong");
        correctMsg = 'wrong';
        timeLeftSpan.setAttribute("class", "deducted")
        timeLeft -= 10;
    }
    correctSpan.textContent  = correctMsg;
    clickedEl.appendChild(correctSpan);

    curQ++;
    
    // show result and give 3 seconds before move to next one
    var delayToShowAnswer = setTimeout (function(){
        if (curQ === numOfQuestions) {
            gameOver();
        } else {
            timeLeftSpan.setAttribute("class", "")
            displayQuestion(curQ);
        }
    }, delaySec);
        
}

var startGame = function() {

    console.log("game started");
    //initialize
    clearInterval(timer);
    timeLeftSpan.textContent = gameTime;
    // set the class to defualt in case it has 'deducted' class from last game
    timeLeftSpan.setAttribute("class",'');
    
    curQ = 0;
    numCorrect = 0;
    timeLeft = gameTime;

    // hide other main sections
    homeSection.style.display='none';
    gameStageSection.style.display='block';
    scoreSection.style.display="none";

    homeBtn.style.display='block';

    // display the first question
    displayQuestion(curQ);

    // count down every second
    timer = setInterval(function () {
        timeLeft--;
        timeLeftSpan.textContent = timeLeft;

        // time counted down to zero or below 
        // (negative cases: when -10s deducted from wrong answer)
        if (timeLeft <= 0){
            clearInterval(timer);
            gameOver();
        }

    }, 1000);

    
}


// buttns with addEventListers!
startBtn.addEventListener("click", startGame );
playAgainBtn.addEventListener("click", startGame);
ScoreBtn.addEventListener("click", showScores);

resetBtn.addEventListener("click", function() {
    localStorage.setItem("HighScoreArray", '');
    showScores();
})

// when initial inserted
initSubmitBtn.addEventListener("click", function(event) {
    event.preventDefault();
    var gamerName = nameInput.value.trim();
    
    // get the localstorage data, and parse into original array
    var oldRecordStr = localStorage.getItem("HighScoreArray")
    var scoreArr = [];
    if (oldRecordStr) {
        scoreArr = JSON.parse(oldRecordStr) ;
    }
    var newRecord = {
        name: gamerName,
        point: timeLeft,
        correct: numCorrect
    }
    // and insert new record to the array 
    scoreArr.push(newRecord);
  
    var newRecordStr = JSON.stringify(scoreArr);

    // insert to the local storage with combined stingified array
    // console.log(newRecordStr);
    localStorage.setItem("HighScoreArray",newRecordStr);

    showScores();


});

// home btn - refresh the page
homeBtn.addEventListener("click", function(){
    location.href = "index.html";
})