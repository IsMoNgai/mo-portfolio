class Car{
    constructor(x,y,width,height,controlType, angle = 0, maxSpeed = 3) {
        // car dimension
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        // car attributes
        this.speed = 0;
        this.acceleration = 0.2;
        this.friction = 0.05;
        this.maxSpeed = maxSpeed;
        this.angle = angle;
        this.damaged = false;

        // training fittness variables
        this.fittness = 0;

        // type of control
        this.useBrain = controlType == "AI";

        // rayCount->input layer
        // 6 -> middle layer
        // 4 -> output layer [left, right, up, down] arrows
        if(controlType != "NPC") {
            this.sensor = new Sensor(this);
            this.brain = new NerualNetwork(
                [this.sensor.rayCount, 6, 4]
            );
        }  
        this.controls = new Controls(controlType);
    }

    // update the motion of car
    update(roadBorders, traffic) {
        if(!this.damaged) {
            this.#move();
            this.fittness += Math.abs(this.speed); // this fittness is getting the distance traveled by car
            this.polygon = this.#createPolygon();
            this.damaged = this.#assessDamage(roadBorders, traffic);
        }
        if(this.sensor){
            this.sensor.update(roadBorders, traffic); 
            const offsets = this.sensor.readings.map(
                // the 1-s.offset explanation:
                // return low value when object is far away
                // return high value when object is close
                s=>s==null? 0:1-s.offset
            );
            
            const outputs = NerualNetwork.feedForward(offsets, this.brain);
            // console.log(outputs);

            if(this.useBrain) {
                this.controls.forward = outputs[0];
                this.controls.left = outputs[1];
                this.controls.right = outputs[2];
                this.controls.reverse = outputs[3];
            }
        }         
    }

    // check if the car crash border
    #assessDamage(roadBorders, traffic) {
        for(let i = 0; i < roadBorders.length; i++) {
            if(polysIntersect(this.polygon, roadBorders[i])) {
                return true;
            }
        }
        for(let i = 0; i < traffic.length; i++) {
            if(polysIntersect(this.polygon, traffic[i].polygon)) {
                return true;
            }
        }
        return false;
    }

    // get the 4 points of the car
    #createPolygon(){
        const points = [];
        const rad=Math.hypot(this.width, this.height)/2;
        const alpha=Math.atan2(this.width, this.height);
        points.push({
            x:this.x-Math.sin(this.angle-alpha)*rad,
            y:this.y-Math.cos(this.angle-alpha)*rad
        })
        points.push({
            x:this.x-Math.sin(this.angle+alpha)*rad,
            y:this.y-Math.cos(this.angle+alpha)*rad
        })
        points.push({
            x:this.x-Math.sin(Math.PI+this.angle-alpha)*rad,
            y:this.y-Math.cos(Math.PI+this.angle-alpha)*rad
        })
        points.push({
            x:this.x-Math.sin(Math.PI+this.angle+alpha)*rad,
            y:this.y-Math.cos(Math.PI+this.angle+alpha)*rad
        })
        return points;
    }

    // the movement of car
    #move() {
        if(this.controls.forward) {
            this.speed -= this.acceleration;
        }
        if(this.controls.reverse) {
            this.speed += this.acceleration;
        }
        // backing speed is slower than forward
        if(this.speed > this.maxSpeed/2) {
            this.speed = this.maxSpeed/2;
        }
        if(this.speed < -this.maxSpeed) {
            this.speed = -this.maxSpeed;
        }
        if(this.speed > 0) {
            this.speed -= this.friction;
        }
        if(this.speed < 0) {
            this.speed += this.friction;
        }
        // to avoid tiny movement afterward:
        if(Math.abs(this.speed) < this.friction) {
            this.speed = 0;
        }
        if(this.speed != 0) {
            if(this.controls.right) {
                this.angle -= 0.03;
            }
            if(this.controls.left) {
                this.angle += 0.03;
            }
        }
        this.x += Math.sin(this.angle)*this.speed;
        this.y += Math.cos(this.angle)*this.speed;
    }

    // draw the car out
    draw(ctx, color, drawSensor=false) {
        if(this.damaged) {
            ctx.fillStyle="gray";
        }else {
            ctx.fillStyle=color;
        }
        ctx.beginPath();
        ctx.moveTo(this.polygon[0].x, this.polygon[0].y);
        for(let i = 1; i < this.polygon.length; i++) {
            ctx.lineTo(this.polygon[i].x, this.polygon[i].y)
        }
        ctx.fill();

        if(this.sensor && drawSensor)
            this.sensor.draw(ctx);
    }
}