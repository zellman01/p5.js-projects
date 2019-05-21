// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain

// Minesweeper
// Video: https://youtu.be/LFU5ZlrR21E

class Cell {
  constructor(i, j, w) {
    this.i = i;
    this.j = j;
    this.x = i * w;
    this.y = j * w;
    this.w = w;
    this.pos = createVector(i, j);
    
    this.neighborCount = 0;
    
    this.bomb = false;
    this.revealed = false;
    this.prev = false;
    this.active = true;
    this.cod = false;
  }
  
  show() {
    stroke(0);
    noFill();
    rect(this.x, this.y, this.w, this.w);
    if (this.revealed) {
      if (this.bomb) {
        if (!this.cod)
          fill(85);
        else
          fill('red');
        ellipse(this.x + this.w * 0.5, this.y + this.w * 0.5, this.w * 0.5);
      } else {
        if (!this.prev) {
          fill(127);
          rect(this.x, this.y, this.w, this.w);
        } else {
          fill(180);
          rect(this.x, this.y, this.w, this.w);
        }
        if (this.neighborCount > 0) {
          textAlign(CENTER);
          fill(0);
          text(this.neighborCount, this.x + this.w * 0.5, this.t + this.w - 6);
        }
      }
    }
    if (!this.active && this.bomb) {
      fill(0);
      rect(this.x, this.y, this.w, this.w);
    }
  }
  
  countBombs() {
    if (this.bomb) {
      this.neighborCount = -1;
      return;
    }
    let total = 0;
    for (let xoff = -1; xoff <= 1; xoff++) {
      let i = this.i + xoff;
      if (i < 0 || i >= cols) continue;
      
      for (let yoff = -1; yoff <= 1; yoff++) {
        let j = this.j + yoff;
        if (j < 0 || j >= rows) continue;
        
        let neighbor = grid[i][j];
        if (neighbor.bomb) {
          total++
        }
      }
    }
    this.neighborCount = total;
  }
  
  contains(x, y) {
    return (x > this.x && x < this.x + this.w && y > this.y && y < this.y + this.w) && this.active;
  }
  
  reveal() {
    this.revealed = true;
    this.show();
    if (this.neighborCount === 0) {
      this.floodFill();
    }
  }
  
  floodFill() {
    for (let xoff = -1; xoff <= 1; xoff++) {
    let i = this.i + xoff;
    if (i < 0 || i >= cols) continue;

    for (let yoff = -1; yoff <= 1; yoff++) {
      let j = this.j + yoff;
      if (j < 0 || j >= rows) continue;

      let neighbor = grid[i][j];
      if (!neighbor.revealed) {
        neighbor.reveal();
      }
    }
  }
  }
  
  toString() {
    return "x: " + this.pos.x + " y " + this.pos.y;
  }
}