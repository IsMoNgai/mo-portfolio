// interpolation
// 300 + (600-300)*2/3
// 300, 400, 500, 600
function lerp(a,b,t) {
    return a+(b-a)*t;
}

// https://www.youtube.com/watch?v=fHOLQJo0FjQ&t=0s
// this function return the x,y,offset of coord where the object intersected with rays
function getIntersection(a,b,c,d) {
    const tTop=(d.x-c.x)*(a.y-c.y)-(d.y-c.y)*(a.x-c.x);
    const uTop=(c.y-a.y)*(a.x-b.x)-(c.x-a.x)*(a.y-b.y);
    const bottom=(d.y-c.y)*(b.x-a.x)-(d.x-c.x)*(b.y-a.y);

    if(bottom != 0) {
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

// poly1[i],
// poly1[(i+1)%poly1.length],
// this part connect 4 points as a line 
// p1 p0
// p2 p3
// as you see we have 4 points and thus poly[(i+1)] will go over 4
// but we can then use (i+1)%poly1.length to make it back to 0
// as we are comparing segment between p1,p0 and other polygons
// this will work for any two polygon objects
function polysIntersect(poly1, poly2) {
    for(let i = 0; i < poly1.length; i++) {
        for(let j = 0; j < poly2.length; j++) {
            const touch = getIntersection(
                poly1[i],
                poly1[(i+1)%poly1.length],
                poly2[j],
                poly2[(j+1)%poly2.length]
            );
            if(touch) {
                return true;
            }
        }
    }
    return false;
}

function getRGBA(value) {
    const alpha = Math.abs(value);
    const R = value<0?0:255;
    const G = R;
    const B = value>0?0:255;

    return "rgba("+R+", "+G+", "+B+", "+alpha+")";
}

function getRandomColor() {
    const hue = 290 + Math.random() * 260;
    return "hsl(" + hue + ", 100%, 60%)";
}