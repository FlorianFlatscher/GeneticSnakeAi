class Snake {
  constructor(brain) {
    if (brain === undefined) {
      this.brain = new NeuralNetwork(7, 11, 8, 3);
    } else {
      this.brain = brain
    }
    this.field = [...Array(fieldX)].map(e => Array(fieldY).fill(0));

    this.posSnakeParts = [];
    for (let i = 0; i < 3; i++) {
      this.posSnakeParts.push([floor(this.field.length / 2 - i), floor(this.field[0].length / 2)]);
    }

    this.posApple = this.getPosApple();

    this.dir = 1;
    this.fitness = 0;
    this.lifeTime = 50;

    this.alive = true;

    this.col = random(255); //HSB color for more party
  }

  show(x, y, w) {
    const sc = w / this.field.length;


    colorMode(HSB, 255);
    if (this.best) {
      strokeWeight(10);
    } else {
      strokeWeight(2);
    }
    if (mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + w)
      stroke(this.col, 255, 255);
    else
      stroke(0);



    fill(0, 0, 60);
    rect(x, y, w, this.field[0].length * sc);




    noStroke();
    textSize(8);
    fill(this.col, 255, 255);
    

    for (let i = 0; i < this.posSnakeParts.length; i++) {
      if (this.alive)
        fill(this.col, 255, 255, map(i, 0, this.posSnakeParts.length, 255, 20));
      else
        fill(0, 0, 0, map(i, 0, this.posSnakeParts.length, 255, 20))
      rect(this.posSnakeParts[i][0] * sc + x, this.posSnakeParts[i][1] * sc + y, sc, sc);
    }
    this.col++;
    this.col %= 255;
    colorMode(RGB);
    fill(255, 0, 0);

    rect(this.posApple[0] * sc + x, this.posApple[1] * sc + y, sc, sc, 3);


  }

  update() {
    this.think();
    let newPos = [];

    switch (this.dir) {
      case 0:
        newPos = [this.posSnakeParts[0][0], this.posSnakeParts[0][1] - 1];
        if (!this.validApplePos(newPos[0], newPos[1]) || newPos[1] < 0) {
          this.alive = false;
          this.reset();
          return;
        }
        this.posSnakeParts.unshift(newPos);
        if (newPos[0] != this.posApple[0] || newPos[1] != this.posApple[1])
          this.posSnakeParts.splice(this.posSnakeParts.length - 1, 1);
        else {
          this.posApple = this.getPosApple();
          this.fitness += this.posSnakeParts.length * 2;
          this.lifeTime = 400;
        }
        break;

      case 1:
        newPos = [this.posSnakeParts[0][0] + 1, this.posSnakeParts[0][1]];
        if (!this.validApplePos(newPos[0], newPos[1]) || newPos[0] >= fieldX) {
          this.alive = false;
          this.reset();
          return;
        }
        this.posSnakeParts.unshift(newPos);
        if (newPos[0] != this.posApple[0] || newPos[1] != this.posApple[1])
          this.posSnakeParts.splice(this.posSnakeParts.length - 1, 1);
        else {
          this.posApple = this.getPosApple();
          this.fitness += this.posSnakeParts.length * 2;
          this.lifeTime = 400;
        }
        break;

      case 2:
        newPos = [this.posSnakeParts[0][0], this.posSnakeParts[0][1] + 1];
        if (!this.validApplePos(newPos[0], newPos[1]) || newPos[1] >= fieldY) {
          this.alive = false;
          this.reset()
          return;
        }
        this.posSnakeParts.unshift(newPos);

        if (newPos[0] != this.posApple[0] || newPos[1] !== this.posApple[1])
          this.posSnakeParts.splice(this.posSnakeParts.length - 1, 1);
        else {
          this.posApple = this.getPosApple();
          this.fitness += this.posSnakeParts.length * 2;
          this.lifeTime = 400;
        }
        break;

      case 3:
        newPos = [this.posSnakeParts[0][0] - 1, this.posSnakeParts[0][1]];
        if (!this.validApplePos(newPos[0], newPos[1]) || newPos[0] < 0) {
          this.alive = false;
          this.reset();
          return;
        }
        this.posSnakeParts.unshift(newPos);
        if (newPos[0] != this.posApple[0] || newPos[1] != this.posApple[1])
          this.posSnakeParts.splice(this.posSnakeParts.length - 1, 1);
        else {
          this.posApple = this.getPosApple();
          this.fitness += this.posSnakeParts.length * 2;
          this.lifeTime = 400;
        }
        break;
    }




    if (this.lifeTime < 0) {
      this.alive = false;
      this.reset();
    }
  }

  dist(ax, ay, bx, by) {
    let vecA = createVector(ax, ay);
    let vecB = createVector(bx, by);
    return p5.Vector.sub(vecA, vecB).mag();
  }

  think() {

    let inputs = []



    let vecA = createVector(this.posSnakeParts[0][0], this.posSnakeParts[0][1]);
    let vecB = createVector(this.posApple[0], this.posApple[1]);
    let dir = p5.Vector.sub(vecB, vecA);
    let a = dir.heading() + 1.25 * PI;

    if (a >= 2 * PI) {
      a -= 2 * PI;
    }

    a -= this.dir * 0.5 * PI;
    if (a < 0) {
      a += 2 * PI;
    }

    inputs.push(a < 0.5 * PI ? 1 : 0);
    inputs.push(a >= 0.5 * PI && a <= PI ? 1 : 0);
    inputs.push(a > PI && a <= 1.5 * PI ? 1 : 0);
    inputs.push(a > 1.5 * PI && a < 2 * PI ? 1 : 0);

    // let vec;
    //
    // let angle =  this.dir * 0.5 * PI -  1 * PI;
    //
    // angleMode(RADIANS);
    // vec = p5.Vector.fromAngle(angle);
    //
    // for (let i = 0; i < 3; i++) {
    //   let distance = this.getAppleInDir(vec);
    //   inputs.push(distance ? 1 : 0);
    //   vec.rotate((0.5 * PI));
    //   vec.x = Math.floor(vec.x + 0.5);
    //   vec.y = Math.floor(vec.y + 0.5);
    // }

    

      switch (this.dir) {
       case 0:
         inputs.push(
           this.getDangerOfBlock(this.posSnakeParts[0][0] - 1, this.posSnakeParts[0][1]),
           this.getDangerOfBlock(this.posSnakeParts[0][0], this.posSnakeParts[0][1] - 1),
           this.getDangerOfBlock(this.posSnakeParts[0][0] + 1, this.posSnakeParts[0][1])
         );
         break;
       case 1:
         inputs.push(
           this.getDangerOfBlock(this.posSnakeParts[0][0], this.posSnakeParts[0][1] - 1),
           this.getDangerOfBlock(this.posSnakeParts[0][0] + 1, this.posSnakeParts[0][1]),
           this.getDangerOfBlock(this.posSnakeParts[0][0], this.posSnakeParts[0][1] + 1)
         );
         break;
       case 2:
         inputs.push(
           this.getDangerOfBlock(this.posSnakeParts[0][0] + 1, this.posSnakeParts[0][1]),
           this.getDangerOfBlock(this.posSnakeParts[0][0], this.posSnakeParts[0][1] + 1),
           this.getDangerOfBlock(this.posSnakeParts[0][0] - 1, this.posSnakeParts[0][1])
         );
         break;
       case 3:
         inputs.push(
           this.getDangerOfBlock(this.posSnakeParts[0][0], this.posSnakeParts[0][1] + 1),
           this.getDangerOfBlock(this.posSnakeParts[0][0] - 1, this.posSnakeParts[0][1]),
           this.getDangerOfBlock(this.posSnakeParts[0][0], this.posSnakeParts[0][1] - 1)
         );
         break;
     }

    // let vec2;
    //
    // let angle2 =  this.dir * 0.5 * PI -  1 * PI;
    //
    // angleMode(RADIANS);
    // vec2 = p5.Vector.fromAngle(angle2);
    //
    // for (let i = 0; i < 5; i++) {
    //   let distance = this.getDistanceToDanger(vec2);
    //   inputs.push(distance / sqrt(pow(fieldX, 2) + pow(fieldY, 2)));
    //   vec2.rotate((0.25 * PI));
    //   vec2.x = floor(vec2.x + 0.5);
    //   vec2.y = floor(vec2.y + 0.5);
    // }

    // for (let i = 0; i < 4; i ++) {
    //   if (this.dir === i) {
    //     inputs.push(1);
    //   } else{
    //     inputs.push(0);
    //   }
    // }
   

    let output = this.brain.feedForward(inputs.slice());

    let maxOut = 0;


    for (let i = 0; i < 3; i++) {
      if (output[i] > output[maxOut]) {
        maxOut = i;
      }
    }



    maxOut--;

    this.dir = (this.dir + maxOut);
    if (this.dir < 0)
      this.dir += 4;
    if (this.dir > 3)
      this.dir -= 4;

    maxOut++;

    if (maxOut === 2) {
      maxOut = 3;
    }


    let goodMove = true;
    let arr = [];
    arr.push(a < 0.5 * PI ? 1 : 0);
    arr.push(a >= 0.5 * PI && a <= PI ? 1 : 0);
    arr.push(a > PI && a <= 1.5 * PI ? 1 : 0);
    arr.push(a > 1.5 * PI && a < 2 * PI ? 1 : 0);
    for (let i = 0; i < 4; i++) {
      if (arr[i] === 1 && i !== 2 && maxOut === i) {
           goodMove = false;
      }
    }

    if (this.alive && !goodMove) {
      this.fitness += 0.5;
    } else if (this.alive){
      this.lifeTime -= 1;
      this.fitness -= 0.5;
    } else {
      this.lifeTime -= 1;
    }
    this.fitness = max(this.fitness, 0);
    
  }

  getDangerOfBlock(x, y) {
    if (x < 0 || x >= fieldX || y < 0 || y >= fieldY) {
      return 1;
    }
    for (let arr of this.posSnakeParts) {
      if (arr[0] == x && arr[1] == y) {
        return 1;
      }
    }
    return 0;
  }

  getPosApple() {
    let x;
    let y;

    do {
      x = floor(random(this.field.length));
      y = floor(random(this.field[0].length));
    } while (!this.validApplePos(x, y));
    return [x, y];
  }

  validApplePos(x, y) {
    for (const pos of this.posSnakeParts) {
      if (pos[0] == x && pos[1] == y) {
        return false;
      }
    }
    return true;
  }

  calcFitness() {
    // this.fitness += Math.pow(this.posSnakeParts.length, 1.15) * 10;
    this.fitness = max(this.fitness, 0.001)
    
    
  }

  reset() {
    this.dir = 1;
    this.lifeTime = 50;

    this.posSnakeParts = [];
    for (let i = 0; i < 3; i++) {
      this.posSnakeParts.push([floor(fieldX / 2 - i, 10), floor(fieldY / 2, 10)]);
    }

    this.posApple = this.getPosApple();

  }

  getDistanceToDanger(dir) {
    
    let countX = 0;
    let countY = 0;
    let x = this.posSnakeParts[0][0];
    let y = this.posSnakeParts[0][1];
    do {
      x += dir.x;
      y += dir.y;

      
      countX += dir.x;
      countY += dir.y;
    } while (this.getDangerOfBlock(floor(x + 0.5), floor(y + 0.5)) === 0);

    return sqrt(pow(countX, 2) + pow(countY,2));
  }

  getAppleInDir(dir) {


    let x = this.posSnakeParts[0][0];
    let y = this.posSnakeParts[0][1];

    do {
      x += dir.x;
      y += dir.y;


      if (x - this.posApple[0] < 0.1 && y - this.posApple[1] < 0.1)
        return true;
    } while (!(x < 0) &&! (x >= fieldX) &&! (y < 0) &&! (y >= fieldY));

    return false;
  }
}
