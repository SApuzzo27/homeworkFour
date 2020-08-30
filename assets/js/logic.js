// variables to keep track of quiz state
var currentQuestionIndex = 0;
var time = questions.length * 15;
var timerId;

// variables to reference DOM elements
var questionsEl = document.querySelector("#questions");
var timerEl = document.querySelector("#time");
var choicesEl = document.querySelector("#choices");
var submitBtn = document.querySelector("#submit");
var startBtn = document.querySelector("#start");
var initialsEl = document.querySelector("#initials");
var feedbackEl = document.querySelector("#feedback");
var startScreenEl = document.querySelector("#start-screen");
var questionTextEl = document.querySelector("#question-text");
var endScreenEl = document.querySelector("#end-screen");
var finalScoreEl = document.querySelector("#final-score");

// sound effects
var sfxRight = new Audio("assets/sfx/correct.wav");
var sfxWrong = new Audio("assets/sfx/incorrect.wav");


function startQuiz() {
  // hide start screen
  startScreenEl.setAttribute ("class","hide");
  // un-hide questions section
  questionsEl.setAttribute ("class", "show");
  // start timer
  timerId = setInterval(clockTick, 1000) 
  // show starting time
  timerEl.textContent = time;
  getQuestion();
};


function getQuestion() {
  // get current question object from array
  var currentQuestion = questions[currentQuestionIndex];
  // update title with current question
  var titleEl = document.querySelector("#question-title");
  titleEl.textContent = currentQuestion.title;
  // clear out any old question choices
  choicesEl.innerHTML = "";
  // loop over choices
  currentQuestion.choices.forEach(function (choice, i) {
    // create new button for each choice
    var choiceNode = document.createElement("button");
    choiceNode.setAttribute("class", "choice");
    choiceNode.setAttribute("value", choice);

    choiceNode.textContent = i + 1 + ". " + choice;
    // attach click event listener to each choice
    choiceNode.onclick = questionClick;

    // display on the page
    choicesEl.appendChild(choiceNode);
  });
}


function questionClick() {
// check if user guessed wrong
if (this.value !== questions[currentQuestionIndex].answer){
  // penalize time
  time -= 10 ; 
  
    if (time < 0) {
    time = 0;
    }
  // display new time on page
  timerEl.textContent = time ;
  
  // flash wrong feedback on page for half a second
  feedbackEl.setAttribute("class", "feedback");
  setTimeout(function() {
  feedbackEl.setAttribute("class", "feedback hide");
  }, 1000);
  feedbackEl.textContent = "Wrong!" ;
  // play "wrong" sound effect
  
  sfxWrong.play()
  
}
// else 
else { 
  // flash right feedback on page for half a second
  feedbackEl.setAttribute("class", "feedback");
  setTimeout(function() {
  feedbackEl.setAttribute("class", "feedback hide");
  }, 1000);
  feedbackEl.textContent = "Nice!" ;    
// play "right" sound effect

  sfxRight.play(); 
// move to next question
currentQuestionIndex++;
}
// check if we've run out of questions
if (currentQuestionIndex === questions.length) {
  // quizEnd
  quizEnd();
}
  // else 
else {
  // getQuestion
  getQuestion();
}
}

function quizEnd() {
// stop timer
clearInterval(timerId);
// show end screen
endScreenEl.setAttribute ("class", "show");
// show final score
finalScoreEl.textContent = time;
// hide questions section
questionsEl.setAttribute ("class", "hide");
}

function clockTick() {
// update time
time --; 
timerEl.textContent =time;
// check if user ran out of time
if (time <= 0) {
quizEnd();
}
}


function saveHighscore() {
// get value of input box
var initials = initialsEl.value.trim();
// make sure value wasn't empty
if (initials !=="") {
// get saved scores from localstorage, or if not any, set to empty array
var highscores =
  JSON.parse(window.localStorage.getItem("highscores")) || [];
// format new score object for current user
var newScore = {
  score: time,
  initials: initials
};
// save to localstorage
highscores.push(newScore);
window.localStorage.setItem("highscores", JSON.stringify(highscores));
// redirect to next page
window.location.href = "highscores.html" ;
  }
}

function checkForEnter(event) {
 // check if event key is enter
  if (event.key ==="Enter"){ 
  //saveHighscore   
  saveHighscore();
  }
}

// user clicks button to submit initials
submitBtn.onclick = saveHighscore;

// user clicks button to start quiz
startBtn.onclick = startQuiz;

initialsEl.onkeyup = checkForEnter;