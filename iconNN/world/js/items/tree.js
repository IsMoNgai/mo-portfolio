class Tree {
    constructor(point, size, heightCoef = 0.2) {
        this.center = point;
        this.size = size;
        this.heightCoef = heightCoef;
        this.base = this.#generateLevel(this.center, size); // base of tree 
    }
    
    #generateLevel(point, size) {
        const points = [];
        const rad = size/2;
        for (let a = 0; a < Math.PI * 2; a += Math.PI / 16) {
            const kindOfRandom = Math.cos(((a + this.center.x) * size) % 17) ** 2; 
            const noisyRadius = rad * kindOfRandom; //or lerp(0.5, 1, Math.random()) random between 0.5 to 1
            points.push(translate(point, a, noisyRadius));
        }
        return new Polygon(points);
    }

    // https://www.youtube.com/watch?v=aKzlooeJNM8
    // 3D top down looking:
    draw(ctx, viewPoint) {
        const diff = subtract(this.center, viewPoint);
        // this.center.draw(ctx, {size: this.size, color: "green"});
    
        const top = add(this.center, scale(diff, this.heightCoef));

        const levelCount = 7;
        for(let level = 0; level < levelCount; level++) {
            const t = level / (levelCount - 1);
            const point = lerp2D(this.center, top, t);
            const color = "rgb(30," + lerp(50,200, t) + ", 50)";
            const size = lerp(this.size, 40, t);
            const poly = this.#generateLevel(point, size);
            poly.draw(ctx, {fill: color, stroke: "rgba(0,0,0,0)"});
            // point.draw(ctx, { size: size, color: color });
        }
        // new Segment(this.center, top).draw(ctx);
        // this.base.draw(ctx);
    }
}