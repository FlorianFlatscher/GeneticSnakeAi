
let canAI, canPlayer;
let aiFinished, playerFinished;
let aiSketchs, playerSketchs;
let aiInstance, playerInstance

const trainedModels = {
    max: {
        file: "brain7.json", group: 0
    },
    sofia: {
        file: "brain8.json", group: 1
    },
    dennis: {
        file: "brain9.json", group: 1
    },
    lenni: {
        file: "brain10.json", group: 2
    },
    cedi: {
        file: "brain11.json", group: 2
    },
    izabell: {
        file: "brain12.json", group: 3
    }
}

const aiDiv = document.querySelector('#ai');
const playerDiv = document.querySelector('#player')
const playerSketch = function (sketch) {
    let snakeGame;
    sketch.setup = () => {
        snakeGame = new SnakeGame(sketch, 35, 35);
        canAI = sketch.createCanvas(aiDiv.clientWidth, aiDiv.clientHeight);
        canAI.parent(aiDiv);
        sketch.setFrameRate(12);

        sketch.noLoop();
        setTimeout(() => {
            sketch.loop();
        }, 1000);

        playerSketchs = sketch;
        playerInstance = this;
        //Events
        document.body.addEventListener("keypress", (e) => {
            console.log(e.key);
            switch (e.key.toLowerCase()) {
                case "w":
                    snakeGame.changeDirection(0);
                    break;
                case "d":
                    snakeGame.changeDirection(1);
                    break;
                case "s":
                    snakeGame.changeDirection(2);
                    break;
                case "a":
                    snakeGame.changeDirection(3);
                    break;
            }
        });
    }

    sketch.draw = () => {
        sketch.background(30, 30, 30);
        if (snakeGame.update()) {
            sketch.score = snakeGame.score;
            playerFinished = true;
            finish();
        }
        snakeGame.draw();
        snakeGame.draw();
    }
}

const aiSketch = function (sketch) {

    let file;
    let snakeGame;
    let group;
    sketch.preload = () => {
        let url = "play/trainedModels/"
        const radio = document.querySelectorAll(".AiRadio");
        for (let i = 0; i < radio.length; i++) {
            if (radio[i].checked) {
                url += trainedModels[radio[i].value].file;
                group = trainedModels[radio[i].value].group;
                break;
            }
        }
        file = sketch.loadJSON(url);



    }
    sketch.setup = () => {

        aiInstance = this;
        aiSketchs = sketch;
        canPlayer = sketch.createCanvas(playerDiv.clientWidth, playerDiv.clientHeight);
        canPlayer.parent(playerDiv);
        snakeGame = createAiSnakeGame(sketch, 35, 35, file, group);
        console.log(group);


        sketch.noLoop();
        setTimeout(() => {
            sketch.loop();
        }, 1000);
        sketch.setFrameRate(17);


    }

    sketch.draw = () => {

        sketch.background(30, 30, 30);

            if (snakeGame.update()) {
                sketch.score = snakeGame.score;
                aiFinished = true;
                finish();

            }

        snakeGame.draw();
    }
}



const finish = function () {
    if (playerFinished && aiFinished) {
        aiSketchs.noLoop();
        playerSketchs.noLoop();
        end();
    } else if (playerFinished) {
        playerSketchs.noLoop();
        aiSketchs.setFrameRate(60);

    } else if (aiFinished) {
        aiSketchs.noLoop();

    }
}

const end = () => {
    if (playerSketchs.score >= aiSketchs.score) {
        alert("You Won! You: " + playerSketchs.score + " AI:" + aiSketchs.score)
    } else {
        alert("You Lost! You: " + playerSketchs.score + " AI:" + aiSketchs.score)
    }

    const tl = new TimelineLite({
        onComplete: () => {
        document.querySelector('#defaultCanvas1').remove();
        document.querySelector('#defaultCanvas0').remove();
    }
    });
    playerFinished = false;
    aiFinished = false;
    tl.to(menu, 1, {borderRadius: "0%", top: "12vh"});


}

let ai;
let player;

function start() {
    ai = new p5(aiSketch, 'first-sketch-container');
    player = new p5(playerSketch, 'second-sketch-container');

}







