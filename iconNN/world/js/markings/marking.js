class Marking {
    constructor(center, directionVector, width, height) {
        this.center = center;
        this.directionVector = directionVector;
        this.width = width;
        this.height = height;

        this.type = "marking";

        this.support = new Segment(
            translate(center, angle(directionVector), height/2),
            translate(center, angle(directionVector), -height/2)
        );
        this.poly = new Envelope(this.support, width/2, 0).poly;
    }

    static load(info) {
        const point = new Point(info.center.x, info.center.y);
        const dir = new Point(info.directionVector.x, info.directionVector.y);
        switch (info.type) {
            case "crossing":
                return new Crossing(point,dir,info.width,info.height);
            case "stop":
                return new Stop(point,dir,info.width,info.height);
            case "start":
                return new Start(point,dir,info.width,info.height);
            case "marking":
                return new Marking(point,dir,info.width,info.height);
        }
    }

    draw(ctx) {
        this.poly.draw(ctx);
    }
}