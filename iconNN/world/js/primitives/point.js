class Point {
    constructor (x, y) {
        this.x = x;
        this.y = y;
    }

    equals(point) {
        return this.x == point.x && this.y == point.y; 
    }

    draw(ctx, { size = 18, color = "black", outline = false, fill = false } = {}) {
        const rad = size/2;
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.arc(this.x, this.y, rad, 0, 2*Math.PI);
        ctx.fill();
        if(outline) {
            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = "yellow";
            ctx.arc(this.x, this.y, rad/2, 0, 2*Math.PI);
            ctx.stroke();
        }
        if(fill) {
            ctx.beginPath();
            ctx.fillStyle = "yellow";
            ctx.arc(this.x, this.y, rad/3, 0, 2*Math.PI);
            ctx.fill();
        }
    }
}