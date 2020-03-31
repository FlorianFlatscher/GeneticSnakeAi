class NeuralNetwork {
    constructor(numInputs, numHidden1, numHidden2, numOutputs) {
        if (numHidden1 === undefined) {
            this.layers = numInputs

        } else {
            let genesLayer1 = [];

            for (let i = 0; i < numInputs + 1; i++) {
                const arr = [];
                for (let l = 0; l < numHidden1; l++) {
                    arr.push(random(2) - 1);
                }

                genesLayer1.push(arr);
            }

            let genesLayer2 = [];

            for (let i = 0; i < numHidden1 + 1; i++) {
                const arr = [];
                for (let l = 0; l < numHidden2; l++) {
                    arr.push(random(2) - 1);
                }
                genesLayer2.push(arr);
            }

            let genesLayer3 = [];

            for (let i = 0; i < numHidden1 + 1; i++) {
                const arr = [];
                for (let l = 0; l < numHidden2; l++) {
                    arr.push(random(2) - 1);
                }
                genesLayer3.push(arr);
            }


            let genesLayer4 = [];

            for (let i = 0; i < numHidden2 + 1; i++) {
                const arr = [];
                for (let l = 0; l < numOutputs; l++) {
                    arr.push(random(2) - 1);
                }
                genesLayer4.push(arr);
            }

            this.layers = [genesLayer1, genesLayer2, genesLayer3, genesLayer4];
        }
    }

    feedForward(inputs) {

        let arr = inputs.slice();
        for (let l = 0; l < this.layers.length; l++) {
            arr.push(1);

            arr = this.feedIntoLayer(arr, l);

        }

        return arr;

    }

    feedIntoLayer(inputs, layer) {
        let output = new Array(this.layers[layer][0].length);
        for (let inp = 0; inp < inputs.length; inp++) {
            for (let w = 0; w < output.length; w++) {
                if (!output[w]) {
                    output[w] = 0;
                }

                output[w] += inputs[inp] * this.layers[layer][inp][w];

            }
        }
        for (let i = 0; i < output.length; i++) {
            output[i] = this.activationFunc(output[i]);

        }

        return output;
    }

    activationFunc(x) {

        return x > 0 ? x : 0;
    }

    crossover(partner) {
        let genes = [];
        let count = 0;
        let breakingPoint = floor(random(this.getGenesLength()));

        for (let layer = 0; layer < this.layers.length; layer++) {
            let dataLayer = [];
            for (let n = 0; n < this.layers[layer].length; n++) {
                let dataNode = [];
                for (let i = 0; i < this.layers[layer][n].length; i++) {
                    if (count < breakingPoint) {
                        dataNode.push(this.layers[layer][n][i]);
                    } else {
                        dataNode.push(partner.layers[layer][n][i]);
                    }
                    count++;
                }
                dataLayer.push(dataNode.slice());
            }
            genes.push(dataLayer.slice());
        }

        return new NeuralNetwork(genes);
    }

    getGenesLength() {
        let sum = 0;
        for (let layer = 0; layer < this.layers.length; layer++) {
            for (let n = 0; n < this.layers[layer].length; n++) {
                for (let i = 0; i < this.layers[layer][n].length; i++) {
                    sum++;
                }
            }
        }
        return sum;
    }

    mutate() {
        for (let layer = 0; layer < this.layers.length; layer++) {
            for (let n = 0; n < this.layers[layer].length; n++) {
                for (let i = 0; i < this.layers[layer][n].length; i++) {
                    if (random() > 0.5) {
                        this.layers[layer][n][i] += randomGaussian() / 35;
                        this.layers[layer][n][i] = max(this.layers[layer][n][i], -1);
                        this.layers[layer][n][i] = min(this.layers[layer][n][i], 1);
                    }
                }
            }
        }
    }

    copy() {
        return new NeuralNetwork(this.layers.slice());
    }


}




