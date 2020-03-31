class SnakeGame {

    constructor(sketch, width, height) {
        this.sketch = sketch;
        this.width = width;
        this.height = height;
        this.snakePositions = [];
        for (let x = Math.floor(width / 2) + 1; x > Math.floor(width / 2) - 2; x--) {
            this.snakePositions.push([x, Math.floor(height / 2)]);
        }
        this.applePosition = this.findApplePos();
        this.direction = 1;
        this.score = 0;
    }

    draw() {
        this.sketch.fill(40);
        this.sketch.noStroke();
        this.sketch.colorMode(this.sketch.RGB, 255);
        this.sketch.strokeWeight(5);
        this.sketch.textSize(400);
        this.sketch.textAlign(this.sketch.CENTER, this.sketch.CENTER);
        this.sketch.text(this.score, this.sketch.width / 2, this.sketch.height / 2);

        const scX = this.sketch.width / this.width;
        const scY = this.sketch.height / this.height;
        this.sketch.noStroke();
        this.sketch.colorMode(this.sketch.HSB, 100);
        for (let i = 0; i < this.snakePositions.length; i++) {
            this.sketch.fill(0, 100, 100, this.sketch.map(i, this.snakePositions.length, 0, 50, 100));
            this.sketch.rect(scX * this.snakePositions[i][0], scY * this.snakePositions[i][1], scX, scY);
        }
        this.sketch.fill(32, 100, 100);
        this.sketch.rect(scX * this.applePosition[0], scY * this.applePosition[1], scX, scY, scX / 5);
        this.sketch.colorMode(this.sketch.RGB, 255);
    }

    update() {
        if (this.nextDir !== undefined && this.direction !== (this.nextDir + 2) % 4) {
            this.direction = this.nextDir;
            this.nextDir = undefined;
        }
        let newPos = [];
        switch (this.direction) {
            case 0:
                newPos = [this.snakePositions[0][0], this.snakePositions[0][1] - 1];
                break;
            case 1:
                newPos = [this.snakePositions[0][0] + 1, this.snakePositions[0][1]];
                break;
            case 2:
                newPos = [this.snakePositions[0][0], this.snakePositions[0][1] + 1];
                break;
            case 3:
                newPos = [this.snakePositions[0][0] - 1, this.snakePositions[0][1]];
                break;
            default:

        }
        this.snakePositions.unshift(newPos);
        if (!(this.snakePositions[0][0] === this.applePosition[0] && this.snakePositions[0][1] === this.applePosition[1]))
            this.snakePositions.splice(-1);
        else {
            this.applePosition = this.findApplePos();
            this.score++;
        }
        if (this.checkBounds()) {
            return true;
        }
    }

    changeDirection(dir) {
        this.nextDir = dir;
    }

    findApplePos() {
        let x = Math.floor(Math.random() * this.width);
        let y = Math.floor(Math.random() * this.height);
        while (this.isPositionOnSnake(x, y)) {
            x = Math.floor(Math.random() * this.width);
            y = Math.floor(Math.random() * this.height);
        }
        return [x, y];
    }

    isPositionOnSnake(x, y) {
        for (let e of this.snakePositions) {
            if (e[0] === x && e[1] === y)
                return true;
        }
    }

    checkBounds() {
        if (this.snakePositions[0][0] < 0 || this.snakePositions[0][0] > this.width - 1 || this.snakePositions[0][1] < 0 || this.snakePositions[0][1] > this.width - 1) {
            return true;
        }
        for (let i = 1; i < this.snakePositions.length; i++) {
            if (this.snakePositions[i][0] === this.snakePositions[0][0] && this.snakePositions[i][1] === this.snakePositions[0][1])
                return true;
        }
    }

    getDangerOfBlock(x, y) {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
            return 1;
        }
        for (let arr of this.snakePositions) {
            if (arr[0] === x && arr[1] === y) {
                return 1;
            }
        }
        return 0;
    }
}

function createAiSnakeGame(sketch, width, height, file, group) {
    const g = new SnakeGame(sketch, width, height);


    g.brain = new NeuralNetwork(file.layers);
    console.log(file.layers);


    g.update = () => {

        let newPos = [];

        switch (g.direction) {
            case 0:
                newPos = [g.snakePositions[0][0], g.snakePositions[0][1] - 1];
                break;
            case 1:
                newPos = [g.snakePositions[0][0] + 1, g.snakePositions[0][1]];
                break;
            case 2:
                newPos = [g.snakePositions[0][0], g.snakePositions[0][1] + 1];
                break;
            case 3:
                newPos = [g.snakePositions[0][0] - 1, g.snakePositions[0][1]];
                break;
            default:

        }
        g.snakePositions.unshift(newPos);

        if (!(g.snakePositions[0][0] === g.applePosition[0] && g.snakePositions[0][1] === g.applePosition[1]))
            g.snakePositions.splice(-1);
        else {
            g.applePosition = g.findApplePos();
            g.score++;
        }
        if (g.checkBounds()) {
            return true;
        }
        g.think();
    }

    g.think = () => {
        let inputs = [];


        let vecA = sketch.createVector(g.snakePositions[0][0], g.snakePositions[0][1]);
        let vecB = sketch.createVector(g.applePosition[0], g.applePosition[1]);
        let dir = p5.Vector.sub(vecB, vecA);
        let a = dir.heading() + 1.25 * Math.PI;

        if (a >= 2 * Math.PI) {
            a -= 2 * Math.PI;
        }

        a -= g.direction * 0.5 * Math.PI;
        if (a < 0) {
            a += 2 * Math.PI;
        }
        if (group === 0 || group === 1 || group === 2) {
            inputs.push(a < 0.5 * Math.PI ? 1 : 0);
            inputs.push(a >= 0.5 * Math.PI && a <= Math.PI ? 1 : 0);
            inputs.push(a > Math.PI && a <= 1.5 * Math.PI ? 1 : 0);
            inputs.push(a > 1.5 * Math.PI && a < 2 * Math.PI ? 1 : 0);
        }

        if (group === 3) {
            let vec;

            let angle =  g.direction * 0.5 * Math.PI -  1 * Math.PI;
            g.sketch.angleMode(sketch.RADIANS);

            vec = p5.Vector.fromAngle(angle);

            for (let i = 0; i < 3; i++) {
                let distance = g.getAppleInDir(vec);
                inputs.push(distance ? 1 : 0);
                vec.rotate((0.5 * Math.PI));
                vec.x = Math.floor(vec.x + 0.5);
                vec.y = Math.floor(vec.y + 0.5);
            }
        }

        if ( group === 2 || group === 3) {
            switch (g.direction) {
                case 0:
                    inputs.push(
                        g.getDangerOfBlock(g.snakePositions[0][0] - 1, g.snakePositions[0][1]),
                        g.getDangerOfBlock(g.snakePositions[0][0], g.snakePositions[0][1] - 1),
                        g.getDangerOfBlock(g.snakePositions[0][0] + 1, g.snakePositions[0][1])
                    );
                    break;
                case 1:
                    inputs.push(
                        g.getDangerOfBlock(g.snakePositions[0][0], g.snakePositions[0][1] - 1),
                        g.getDangerOfBlock(g.snakePositions[0][0] + 1, g.snakePositions[0][1]),
                        g.getDangerOfBlock(g.snakePositions[0][0], g.snakePositions[0][1] + 1)
                    );
                    break;
                case 2:
                    inputs.push(
                        g.getDangerOfBlock(g.snakePositions[0][0] + 1, g.snakePositions[0][1]),
                        g.getDangerOfBlock(g.snakePositions[0][0], g.snakePositions[0][1] + 1),
                        g.getDangerOfBlock(g.snakePositions[0][0] - 1, g.snakePositions[0][1])
                    );
                    break;
                case 3:
                    inputs.push(
                        g.getDangerOfBlock(g.snakePositions[0][0], g.snakePositions[0][1] + 1),
                        g.getDangerOfBlock(g.snakePositions[0][0] - 1, g.snakePositions[0][1]),
                        g.getDangerOfBlock(g.snakePositions[0][0], g.snakePositions[0][1] - 1)
                    );
                    break;
            }
        }
        if (group === 0||group === 1) {
            let vec;

            let angle = g.direction * 0.5 * Math.PI - 1 * Math.PI;

            g.sketch.angleMode(g.sketch.RADIANS);
            vec = p5.Vector.fromAngle(angle);
            vec.x = Math.round(vec.x);
            vec.y = Math.round(vec.y);


            for (let i = 0; i < 5; i++) {
                let distance = g.getDistanceToDanger(vec);
                inputs.push(distance / Math.sqrt(Math.pow(g.width, 2) + Math.pow(g.height, 2)));
                vec.rotate(0.25 * Math.PI);
                vec.x = Math.round(vec.x);
                vec.y = Math.round(vec.y);
            }
        }

        if (group === 1 || group === 2 || group === 3) {
            for (let i = 0; i < 4; i++) {
                if (g.direction === i) {
                    inputs.push(1);
                } else {
                    inputs.push(0);
                }
            }
        }

        console.log(inputs);

        let output = g.brain.feedForward(inputs.slice());

        let maxOut = 0;

        for (let i = 0; i < 3; i++) {
            if (output[i] > output[maxOut]) {
                maxOut = i;
            }
        }

        maxOut--;

        g.direction = (g.direction + maxOut);
        if (g.direction < 0)
            g.direction += 4;
        if (g.direction > 3)
            g.direction -= 4;
    }
    g.draw = () => {
        g.sketch.fill(40);
        g.sketch.noStroke();
        g.sketch.colorMode(g.sketch.RGB, 255);
        g.sketch.strokeWeight(5);
        g.sketch.textSize(400);
        g.sketch.textAlign(g.sketch.CENTER, g.sketch.CENTER);
        g.sketch.text(g.score, g.sketch.width / 2, g.sketch.height / 2);

        g.sketch.colorMode(g.sketch.HSB, 100);
        const scX = g.sketch.width / g.width;
        const scY = g.sketch.height / g.height;
        g.sketch.noStroke();
        g.sketch.fill(32, 100, 100);
        for (let i = 0; i < g.snakePositions.length; i++) {
            g.sketch.fill(32, 100, 100, g.sketch.map(i, g.snakePositions.length, 0, 50, 100));
            g.sketch.rect(scX * g.snakePositions[i][0], scY * g.snakePositions[i][1], scX, scY);
        }
        g.sketch.colorMode(g.sketch.RGB, 255);
        g.sketch.fill(255, 0, 0);
        g.sketch.rect(scX * g.applePosition[0], scY * g.applePosition[1], scX, scY, scX / 5);

    }


    g.getDistanceToDanger = (dir) => {

        let countX = 0;
        let countY = 0;
        let x = g.snakePositions[0][0];
        let y = g.snakePositions[0][1];
        do {
            x += dir.x;
            y += dir.y;

            countX += dir.x;
            countY += dir.y;
        } while (g.getDangerOfBlock(Math.floor(x + 0.5), Math.floor(y + 0.5)) === 0);

        return Math.sqrt(Math.pow(countX, 2) + Math.pow(countY, 2));
    }

    g.getAppleInDir = (dir) => {
        let x = g.snakePositions[0][0];
        let y = g.snakePositions[0][1];

        do {
            x += dir.x;
            y += dir.y;


            if (x - g.applePosition[0] < 0.1 && y - g.applePosition[1] < 0.1)
                return true;
        } while (x >= 0 && x < g.width && y >= 0 && y < g.height);
        return false;
    }


    return g;
}