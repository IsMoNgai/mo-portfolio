class Graph {
    constructor(points = [], segments = []) {
        this.points = points;
        this.segments = segments;
    }
    getSegmentsWithPoint(point) {
        const segs = [];
        for(const seg of this.segments) {
            if(seg.includes(point)) {
                segs.push(seg);
            }   
        } 
        return segs;
    }
    removePoint(point) {
        const segs = this.getSegmentsWithPoint(point);
        for(const seg of segs) {
            this.removeSegment(seg);
        }
        this.points.splice(this.points.indexOf(point), 1)
    }

    static load(info) {
        const points = [];
        const segments = [];
        for (const pointInfo of info.points) {
            points.push(new Point(pointInfo.x, pointInfo.y));
        }
        for (const segInfo of info.segments) {
            segments.push(new Segment(
                points.find((p) => p.equals(segInfo.p1)), 
                points.find((p) => p.equals(segInfo.p2))
            ));
        }
        return new Graph(points, segments);
    }

    hash() {
        return JSON.stringify(this);
    }

    addPoint(point) {
        if(!this.containsPoint(point)) {
            this.points.push(point);
            return true;
        }else {
            return false;
        }        
    }

    removeSegment(segment) {
        this.segments.splice(this.segments.indexOf(segment), 1)
    }

    addSegment(segment) {
        if(!this.containsSegment(segment) && !segment.p1.equals(segment.p2)) {
            this.segments.push(segment);
            return true;
        } else {
            return false;
        }
    }

    containsSegment(segment) {
        return this.segments.find((s) => s.equals(segment));
    }

    containsPoint(point) {
        return this.points.find((p) => p.equals(point));
    }

    dispose() {
        // this.segments = [] this way will generate a new object which is not good for memory  
        this.segments.length = 0;
        this.points.length = 0;
    }

    draw(ctx) {
        for(const seg of this.segments) {
            seg.draw(ctx);
        }

        for(const point of this.points) {
            point.draw(ctx);
        }
    }
}