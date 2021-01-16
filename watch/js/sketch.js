//Settings
const fieldX = 40,
  fieldY = 40;

//Ai Stuff
let population;

//Counting
let ct = 1, fr;
let fast = false;

//Dom
let can, canP5; //can: Canvas via "Dom" reference *** canP5: Canvas via P5 refernece

document.querySelector("#speed").oninput = () => {
    ct = this.value;
};

//Called onload
function setup() {
  frameRate(12);
  //P5 Canvas
  canP5= createCanvas(600, 600);
  canP5.parent(document.querySelector("#canvas"));
  //Dom Canvas
  can = document.querySelector("#canvas");
  can.addEventListener("click", onMousePressed);
  console.log(can);
  population = new Population(10);
  frameRate(2000);
}

//Gameloop
function draw() {
  render();
  for (let i = 0; i < ct; i++)
  {
    population.update();
  }
}

function render() {
  background(220);
  population.show(0, 0, 600);
}

function onMousePressed() {
    const sc =  width/sqrt(population.snakes.length);
    for (let y = 0; y < population.sizeWidth; y++) {
        for (let x = 0; x < population.sizeWidth; x++) {
            if (population.snakes[y * population.sizeWidth + x].alive) {
                if (mouseX > x * sc && mouseX < x * sc + sc && mouseY > y * sc && mouseY < y * sc + sc) {
                    population.best = population.snakes[y * population.sizeWidth + x];
                    population.snakes[y * population.sizeWidth + x].best = true;
                    let tl = new TimelineLite();
                    tl.fromTo(document.querySelector('#back'),0.5, {display: "block", opacity: "0.0", top: "20px"}, {opacity: "1", top: "0px"});
                    population.showBest = true
                    document.querySelector('#back').addEventListener('click', (e) => {
                        document.querySelector('#back').style.display = "none";
                        population.showBest = false;
                        population.best.best = false;
                        population.best = false;
                    });
                    return;
                }
            }
        }
    }
}

function saveSnake() {
  saveJSON(population.best.brain, "brain.json");
}


