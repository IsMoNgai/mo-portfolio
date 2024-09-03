class Crossing extends Marking {
    constructor(center, directionVector, width, height) {
        super(center, directionVector, width, height);
        this.borders = [this.poly.segments[0], this.poly.segments[2]];
        this.type = "crossing";

        this.start = this.poly.segments[1];
        this.end = this.poly.segments[3];
    }

    draw(ctx) {
        // const sides = [];
        // const sideCount = 5;
        // for(let i = 0; i < sideCount; i++) {
        //     const t = i/(sideCount-1);
        //     const sideX = lerp2D(this.start.p1, this.end.p2, t);
        //     const sideY = lerp2D(this.start.p2, this.end.p1, t);

        //     sides.push(new Segment (sideX, sideY));
        // }
        // for(const side of sides) {
        //     side.draw(ctx, {width: 10, color: "white"});
        // }
        const perp = perpendicular(this.directionVector);
        const line = new Segment(
            add(this.center, scale(perp, this.width / 4)),
            add(this.center, scale(perp, -this.width / 4))
        );
        line.draw(ctx, {width: this.height, color: "white", dash : [11,11]});
    }
}