class NerualNetwork{
    constructor(neuronCounts) {
        this.levels = [];
        for(let i = 0; i < neuronCounts.length-1; i++) {
            this.levels.push(new Level(
                neuronCounts[i], neuronCounts[i+1]
            ));
        }
    }

    static feedForward(givenInputs, network) {
        let outputs = Level.feedForward(
            givenInputs, network.levels[0]);
        for(let i = 1; i < network.levels.length; i++) {
            outputs = Level.feedForward(
                outputs, network.levels[i]);
        }
        return outputs;
    }

    // amount = 1 means randomize it 100%
    // if amount = 0 then it will stay the same
    static mutate(network, amount = 1) {
        network.levels.forEach(level=>{
            for(let i = 0; i < level.biases.length; i++) {
                level.biases[i] = lerp(
                    level.biases[i],
                    Math.random()*2-1,
                    amount
                )
            }
            for(let i = 0; i < level.weights.length;i++) {
                for(let j = 0; j < level.weights[i].length; j++) {
                    level.weights[i][j] = lerp(
                        level.weights[i][j],
                        Math.random()*2-1,
                        amount
                    )
                }
            }
        })
    }
}

class Level{
    constructor(inputCount, outputCount){
        this.inputs = new Array(inputCount);
        this.outputs = new Array(outputCount);
        this.biases = new Array(outputCount);

        this.weights=[];
        for(let i = 0; i < inputCount; i++) {
            this.weights[i] = new Array(outputCount);
        }

        Level.#randomize(this);

    }
    // static: belong to class and cannot access this.
    static #randomize(level) {
        for(let i = 0; i < level.inputs.length; i++) {
            for(let j = 0; j < level.outputs.length; j++) {
                level.weights[i][j] = Math.random()*2-1;
            }
        }
        for(let j = 0; j < level.outputs.length; j++) {
            level.biases[j] = Math.random()*2-1;
        }
    }

    static feedForward(givenInputs, level) {
        for(let i = 0; i < level.inputs.length; i++) {
            level.inputs[i] = givenInputs[i];
        }
        for(let i = 0; i < level.outputs.length; i++) {
            let sum = 0;
            for(let j = 0; j < level.inputs.length; j++) {
                sum += level.inputs[j]*level.weights[j][i];
            }
            sum -= level.biases[i];

            // Activation function:
            // ReLu activation function
            level.outputs[i] = Math.max(0, sum);

            // high/low activation function
            // if(sum > 0) {
                    //output neruon
            //     level.outputs[i] = 1;
            // } else {
            //     level.outputs[i] = 0;
            // }
        }
        return level.outputs;
    }
}