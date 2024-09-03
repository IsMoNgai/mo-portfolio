class Visualizer{
    static drawNetwork(ctx, network) {
        const margin = 50;
        const left = margin;
        const top = margin;
        const width = ctx.canvas.width-margin*2;
        const height = ctx.canvas.height-margin*2;

        const levelHeight = height/network.levels.length;
    
        for(let i = network.levels.length-1; i >= 0; i--) {
            const levelTop = top+lerp(
                height-levelHeight,
                0,
                network.levels.length == 1 ? 1 : i/(network.levels.length-1)
            );

            // ctx.setLineDash([7,3]);

            Visualizer.drawLevel(ctx, network.levels[i],
                left, levelTop,
                width, levelHeight,
                i == network.levels.length-1
                    ?['up', 'left', 'right', 'down']
                    :[]
            );            
        }

    }

    static drawLevel(ctx, level, left, top, width, height, outputLabels) {
        const right = left + width;
        const bottom = top + height;

        const {inputs, outputs, weights, biases} = level;

        const nodeRadius = 18;
        
        // connect lines:
        for(let i = 0; i < inputs.length; i++) {
            for(let j = 0; j < outputs.length; j++) {
                ctx.beginPath();
                ctx.moveTo(Visualizer.#getNodeX(inputs, i, left, right), bottom);
                ctx.lineTo(Visualizer.#getNodeX(outputs, j, left, right), top);
                ctx.lineWidth = 2;
                // for weights closer to 1 -> solid yellow line
                // for weights closer to -1 -> solid blue line
                // else no color or less solid
                ctx.strokeStyle = getRGBA(weights[i][j]);
                ctx.stroke();
            }
        }
        
        // input layer:
        for(let i = 0; i < level.inputs.length; i++) {
            const x = Visualizer.#getNodeX(level.inputs, i, left, right)
            ctx.beginPath();
            ctx.arc(x, top, nodeRadius, 0, Math.PI*2);
            ctx.fillStyle = "black";
            ctx.fill();
            ctx.beginPath();
            ctx.arc(x, bottom, nodeRadius, 0, Math.PI*2);
            // if input activated then fill with stronger color
            // the more intersection of a ray the more solid the color
            ctx.fillStyle = getRGBA(inputs[i]);
            ctx.fill();
        }

        // output layer:
        for(let i = 0; i < level.outputs.length; i++) {
            const x = Visualizer.#getNodeX(level.outputs, i, left, right)
            ctx.beginPath();
            ctx.arc(x, top, nodeRadius, 0, Math.PI*2);
            ctx.fillStyle = "black";
            ctx.fill();
            ctx.beginPath();
            ctx.arc(x, top, nodeRadius*0.6, 0, Math.PI*2);
            ctx.fillStyle = getRGBA(outputs[i]);
            ctx.fill();
            
            ctx.beginPath();
            ctx.lineWidth=2;
            ctx.arc(x, top, nodeRadius, 0, Math.PI*2);
            // for biases closer to 1 -> yellow dash
            // for biases closer to -1 -> blue dash
            // else no color
            ctx.strokeStyle = getRGBA(biases[i]);
            ctx.setLineDash([3,3]);
            ctx.stroke();
            ctx.setLineDash([]);
            
            if(outputLabels[i]){
                ctx.beginPath();
                ctx.textAlign="center";
                ctx.textBaseline="middle";
                ctx.fillStyle="black";
                ctx.strokeStyle="white";
                ctx.font = (nodeRadius*1.5) + "px Arial";
                ctx.fillText(outputLabels[i],x,top);
                ctx.lineWidth = 0.5;
                ctx.strokeText(outputLabels[i], x, top);
            }
        }
    }

    static #getNodeX(nodes, index, left, right) {
        return lerp(
            left, 
            right,
            nodes.length == 1 
                ? 0.5 
                : (index / (nodes.length - 1))
        )
    }
}