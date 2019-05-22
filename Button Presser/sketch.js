const BUTTONS = ["ArrowUp", "ArrowDown", "ArrowLeft" ,"ArrowRight", "a", "b", "x", "y", "q", "v", "p", "r", "f", "k", "l"];
let prevButton = [];
let requiredButton;
let displayButton;
let lives = 3, score = 0, correctRow = 0;
let wait = false, gameOver = false;
let delay = 500;
let diff = ["Easy", "Normal", "Hard", "Expert"];
let diffInd;
let nextLevel = 25;

function setup() {
  createCanvas(400, 400);
  diffInd = 0;
  requiredButton = BUTTONS[Math.floor(random(checkDiff()))];
}

function checkDiff() {
  let value = 0;
  switch (diff[diffInd]) {
    case "Easy":
      value = 4;
      break;
    case "Normal":
      value = 4+4;
      break;
    case "Hard":
      value = 4+4+3;
      break;
    default:
      value = BUTTONS.length
  }
  return value;
}

function draw() {
  background(220);
  textSize(32);
  displayButton = correctKey(requiredButton);
  textAlign(CENTER, CENTER);
  text(displayButton, width/2, height/2);
  textAlign(LEFT, TOP);
  text("Score: " + score, 10, 30);
  text("Lives: " + lives, 10, 70);
  if (keyIsPressed && !wait && !gameOver) {
    if (key === requiredButton) {
      wait = true;
      correctRow++;
      updateScore(1);
      newRequiredKey();
      waitSetup();
    } else {
      wait = true;
      updateScore(-1);
      correctRow = 0;
      updateLives(-1);
      newRequiredKey();
      diffInd = 0;
      if (lives < 1) {
        gameOver = true;
        requiredButton = "GAME OVER";
      }
      waitSetup();
    }
    if (correctRow > nextLevel) {
      updateLives(1);
      correctRow = 0;
      if (diffInd < diff.length)
        diffInd++;
    }
  }
}
  
function waitSetup() {
  setTimeout(function() {
    wait = false;
  }, delay);
}

function updateScore(a) {
  a=parseInt(a);
  score+=a;
}

function updateLives(a) {
  a=parseInt(a);
  lives+=a;
}

function newRequiredKey() {
  if (prevButton.length >= 1 && diffInd === 0 || prevButton.length >= 2 && diffInd === 1 || prevButton.length >= 3 && diffInd >= 2) {
    prevButton.shift();
  }
  prevButton.push(requiredButton);
  console.log(prevButton);
  do {
    requiredButton = BUTTONS[Math.floor(random(checkDiff()))];
  } while (!checkArray(requiredButton));
}

function checkArray(key) {
  for (let i = 0; i < prevButton.length; i++) {
    if (key === prevButton[i]) {
      return false;
    }
  }
  return true;
}

function correctKey(key) {
  switch (key) {
    case "ArrowUp":
      key = "up";
      break;
    case "ArrowDown":
      key = "down";
      break;
    case "ArrowLeft":
      key = "left";
      break;
    case "ArrowRight":
      key = "right";
      break;
  }
  return key.toUpperCase();
}
