class Segment {
    constructor(p1, p2, oneWay = false) {
        this.p1 = p1;
        this.p2 = p2;
        this.oneWay = oneWay;
    }

    length() {
        return distance(this.p1, this.p2);
    }

    directionVector() {
        // v/|v|
        return normalize(subtract(this.p2, this.p1));
    }

    equals(segment) {
        // return (this.p1.equals(segment.p1) && this.p2.equals(segment.p2)) || (this.p2.equals(segment.p1) && this.p2.equals(segment.p1));
        return this.includes(segment.p1) && this.includes(segment.p2);
    }

    includes(point) {
        return this.p1.equals(point) || this.p2.equals(point);
    }

    // basically linear algebra 
    // https://www.youtube.com/watch?v=jvqomjmMsPI&t=0s
    // https://www.youtube.com/watch?v=8bQlwo31k2E
    distanceToPoint(point) {
        // projectPoint return {}
        const proj = this.projectPoint(point);
        if (proj.offset > 0 && proj.offset < 1) {
           return distance(point, proj.point);
        }
        // this is the tricky question in exam if you remember
        // if outside of the segment then distance is just the below 
        const distToP1 = distance(point, this.p1);
        const distToP2 = distance(point, this.p2);
        return Math.min(distToP1, distToP2);
    }

    projectPoint(point) {
        const a = subtract(point, this.p1);
        const b = subtract(this.p2, this.p1);
        const normB = normalize(b);
        const scaler = dot(a, normB); // magnitude of B
        const proj = {
           point: add(this.p1, scale(normB, scaler)), // this is the projected point on B
           offset: scaler / magnitude(b), // offset t in interpolation
        };
        return proj;
    }

    draw(ctx, { width = 2, color = "black", dash = [] } = {}) {
        ctx.beginPath();
        ctx.lineWidth = width;
        ctx.strokeStyle = color;
        // one way indicator
        if (this.oneWay) {
            dash = [4,4];
        }
        ctx.setLineDash(dash);
        ctx.moveTo(this.p1.x, this.p1.y);
        ctx.lineTo(this.p2.x, this.p2.y);
        ctx.stroke();
        ctx.setLineDash([]);
    }
}