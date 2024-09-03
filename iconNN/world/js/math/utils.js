// this function return the nearest point
function getNearestPoint(loc, points, threshold = Number.MAX_SAFE_INTEGER) {
    let minDist = Number.MAX_SAFE_INTEGER;
    let nearest = null;
    for (const point of points) {
        const dist = distance(point, loc);
        if(dist < minDist && dist < threshold) {
            minDist = dist;
            nearest = point;
        }
    }
    return nearest;
}

function getNearestSegment(loc, segments, threshold = Number.MAX_SAFE_INTEGER) {
    let minDist = Number.MAX_SAFE_INTEGER;
    let nearest = null;
    for (const seg of segments) {
        const dist = seg.distanceToPoint(loc);
        if(dist < minDist && dist < threshold) {
            minDist = dist;
            nearest = seg;
        }
    }
    return nearest;
}

function distance(p1, p2) {
    return Math.hypot(p1.x-p2.x, p1.y-p2.y);
}

function average(p1, p2) {
    return new Point((p1.x + p2.x)/2, (p1.y + p2.y)/2);
}

function dot(p1, p2) {
    return p1.x * p2.x + p1.y * p2.y;
 }

function add(p1, p2) {
    return new Point(p1.x + p2.x, p1.y + p2.y);
}

function subtract(p1, p2) {
    return new Point(p1.x - p2.x, p1.y - p2.y);
}

function scale(p, scaler) {
    return new Point(p.x * scaler, p.y * scaler);
}

function normalize(p) {
    return scale(p, 1/magnitude(p));
}

function magnitude(p) {
    return Math.hypot(p.x, p.y);
}

function perpendicular(p) {
    return new Point(-p.y, p.x);
}

function translate(loc, angle, offset) {
    return new Point(
        loc.x + Math.cos(angle) * offset, 
        loc.y + Math.sin(angle) * offset
    );
}

function angle(p) {
    return Math.atan2(p.y, p.x);
}

function degToRad(degree) {
    return degree * Math.PI/180;
}

function lerp(a,b,t) {
    return a+(b-a)*t;
}

function lerp2D(A, B, t) {
    return new Point(lerp(A.x, B.x, t), lerp(A.y, B.y, t));
}

function invLerp(a, b, v) {
    return (v-a)/(b-a);
}

// if t = 0 the intersection point is at the start of segment a
// if t = 1 the intersection point is at the en of segment b
// if 0 < t < 1 the intersection point is somewhere between a and b
function getIntersection(a,b,c,d) {
    const tTop=(d.x-c.x)*(a.y-c.y)-(d.y-c.y)*(a.x-c.x);
    const uTop=(c.y-a.y)*(a.x-b.x)-(c.x-a.x)*(a.y-b.y);
    const bottom=(d.y-c.y)*(b.x-a.x)-(d.x-c.x)*(b.y-a.y);

    const eps = 0.001;
    // bottom != 0 but in this way we avoid floating problem
    if(Math.abs(bottom) > eps) {
        const t = tTop/bottom;
        const u = uTop/bottom;
        if(t>=0 && t<=1 && u>=0 && u<=1) {
            return {
                x:lerp(a.x, b.x, t),
                y:lerp(a.y, b.y, t),
                offset:t

            }
        }
    }
    return null;
}

function getRandomColor() {
    const hue = 290 + Math.random() * 260;
    return "hsl(" + hue + ", 100%, 60%)";
}