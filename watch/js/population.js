class Population {
    constructor(sizeWidth) {
        this.sizeWidth = sizeWidth;
        let size = sizeWidth * sizeWidth;
        this.snakes = [];

        for (let i = 0; i < size; i++) {
            this.snakes.push(new Snake());
        }


        this.bestFit = 0;
        this.gen = 0;

        this.showBest = false;
    }

    update() {
        let ev = false;
        for (let i = 0; i < this.snakes.length; i++) {
            if (this.snakes[i].alive)
                this.snakes[i].update();
            if (this.snakes[i].alive) {
                ev = true;
            }
            if (this.showBest && this.best && !this.best.alive) {
              this.showBest = false;
                document.querySelector('#back').style.display = "none";

            }
        }
        if (!ev) {
            this.evolve();
        }
    }

    show(xPos, yPos, w) {
        if (!this.showBest) {
            for (let y = 0; y < this.sizeWidth; y++) {
                for (let x = 0; x < this.sizeWidth; x++) {
                    if (this.snakes[y * this.sizeWidth + x].alive)
                        this.snakes[y * this.sizeWidth + x].show(xPos + x * (w / this.sizeWidth), yPos + y * (w / this.sizeWidth), w / this.sizeWidth - 2);
                }
            }
        } else {
            this.best.show(xPos, yPos, w);
        }
    }

    evolve() {
        let sum = 0;
        let best = 0;

        for (let s of this.snakes) {
            s.calcFitness();


            sum += s.fitness;
            if (s.fitness > best) {
                this.champ = new Snake(s.brain);
                best = s.fitness;
            }
        }
        this.bestFit = max(best, this.bestFit);

        let newSnakes = [];
        newSnakes.push(this.champ);
        for (let i = 0; i < this.snakes.length - 1; i++) {
            let a = random(0, sum);

            let count = 0;
            let partnerA = null;

            for (let s of this.snakes) {
                count += s.fitness;
                if (count > a) {
                    partnerA = s;
                    break;
                }
            }
            a = random(0, sum);

            count = 0;
            let partnerB = null;
            for (let s of this.snakes) {
                count += s.fitness;
                if (count > a) {
                    partnerB = s;
                    break;
                }
            }

            let brain = partnerA.brain.crossover(partnerB.brain);
            if (random() > 0.5) {
                brain.mutate();
            }
            let child = new Snake(brain);
            newSnakes.push(child);
        }
        this.snakes = newSnakes;
        this.gen++;
    }
}
