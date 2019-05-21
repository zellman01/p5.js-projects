// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain

// Minesweeper
// Video: https://youtu.be/LFU5ZlrR21E

let grid;
let gridBombs = [];
let cols;
let rows;
let w = 20;
let wait = true;
let bombBusters = 0, bombReveals = 0;
let removedBombs = [];
let prev;
let gameState = "Startup";
let totalBees = 0, d = 0;

const DIFFICULTY = "Easy";

function make2DArray(cols, rows) {
  let arr = new Array(cols);
  for (let i = 0; i < arr.length; i++) {
    arr[i] = new Array(rows);
  }
  return arr;
}

function checkSize(s) {
  s = parseInt(s);
  while (s%w != 0) {
    s++
  }
  return s;
}

function diffScale() {
  switch(DIFFICULTY) {
    case "Easy":
      d = 200;
      totalBees = Math.floor(d/8);
      bombBusters = 5;
      break;
    case "Normal":
      d = 300;
      totalBees = Math.floor(d/6);
      bombBusters = 3;
      break;
    case "Hard":
      d = 350;
      totalBees = Math.floor(d/4);
      bombBusters = 1;
      break;
    case "Difficult":
      d = 450;
      totalBees = Math.floor(d/2);
      bombBusters = 0;
      break;
    default:
      throw new Error("Incorrect difficulty selection. Valid choices are: Easy, Normal, Hard or Difficult.");
  }
  d = checkSize(d);
  bombReveals = bombBusters;
}

function setup() {
  diffScale();
  console.log("You have " + bombReveals + " Bomb reveals and bomb removals. There are a total of " + totalBees + " bombs.");
  console.log("Press '1' to use a bomb removal. Press '2' to use a bomb reveal. You must reveal a space after you use each one, and at the beginning of the game.");
  createCanvas(d, d);
  cols = floor(width / w);
  rows = floor(height / w);
  grid = make2DArray(cols, rows);
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j] = new Cell(i, j, w);
    }
  }

  // Pick totalBees spots
  let options = [];
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      options.push([i, j]);
    }
  }


  for (let n = 0; n < totalBees; n++) {
    let index = floor(random(options.length));
    let choice = options[index];
    let i = choice[0];
    let j = choice[1];
    // Deletes that spot so it's no longer an option
    options.splice(index, 1);
    grid[i][j].bomb = true;
    gridBombs.push([i, j]);
  }


  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j].countBombs();
    }
  }
  
  gameState = "Continue";
}

function gameOver() {
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j].revealed = true;
    }
  }
  gameState = "DEAD";
}

function mousePressed() {
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      if (grid[i][j].contains(mouseX, mouseY) && gameState === "Continue") {
        if (prev != null) {
          prev.reveal();
          prev.prev = false;
        }
        fill(85);
        let cell = grid[i][j];
        cell.reveal();
        cell.prev = true;
        cell.active = false;

        if (cell.bomb) {
          if (prev != null)
            prev.prev = true;
          cell.active = true;
          cell.reveal();
          cell.cod = true;
          gameOver();
          if (removedBombs.length > 1) {
            console.log("These were the removed bombs: " + removedBombs + ".");
          }
        }
        
        if (wait) {
          wait = false;
        }
        prev = cell;
      }
    }
  }
}

function draw() {
  background(255);
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j].show();
    }
  }
  if (keyIsPressed && !wait) {
    if (key === "1") {
      if (bombBusters !== 0) {
        let index = floor(random(gridBombs.length));
        let choice = gridBombs[index];
        let i = choice[0];
        let j = choice[1];
        gridBombs.splice(index, 1);
        grid[i][j].bomb = false;
        removedBombs.push(grid[i][j]);
        bombBusters--;
        wait = true;
      }
    }
    if (key === "2") {
      if (bombReveals !== 0) {
        let index = floor(random(gridBombs.length));
        let choice = gridBombs[index];
        let i = choice[0];
        let j = choice[1];
        let cell = grid[i][j];
        fill(0);
          rect(cell.x, cell.y, cell.w, cell.w);
        gridBombs.splice(index, 1);
        cell.active = false;
        bombReveals--;
        wait = true;
      }
    }
  }
}
