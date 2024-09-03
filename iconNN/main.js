
// interface setup
const carCanvas=document.getElementById("carCanvas");
carCanvas.width=930;
// const networkCanvas=document.getElementById("networkCanvas");
// networkCanvas.width=300;
// const miniMapCanvas=document.getElementById("miniMapCanvas");
// miniMapCanvas.width=300;
// miniMapCanvas.height=300;

carCanvas.height=window.innerHeight;
// networkCanvas.height = window.innerHeight - 300;

const carCtx = carCanvas.getContext("2d");
// const networkCtx = networkCanvas.getContext("2d");

const viewport = new Viewport(carCanvas, world.zoom, world.offset);
// const miniMap = new MiniMap(miniMapCanvas, world.graph, 300);

//training amount
const maxSpeed = 3;
const N = 10;
const geneticValue = 1;
const cars = generateCars(N);
let bestCar = cars[0];

// genetic function
if(localStorage.getItem("bestBrain")){
    for(let i = 0; i < cars.length; i++) {
        cars[i].brain = JSON.parse(
            localStorage.getItem("bestBrain")
        );
        if(i != 0) {
            // lower the value the more similar the cars' brain to other new gen AI
            // recommend initial = 10, fine tune = 0.05

            NerualNetwork.mutate(cars[i].brain, geneticValue); 
        }
    }
}

// initializaing the road borders and traffic
const traffic = [];
const roadBorders = world.roadBorders.map((s) => [s.p1, s.p2]);

animate();

// saving the NN of the best car
function save() {
    localStorage.setItem("bestBrain", JSON.stringify(bestCar.brain));
}

// delete the NN of the best car
function discard() {
    localStorage.removeItem("bestBrain");
}

function generateCars(N) {
    const startPoints = world.markings.filter((m) => m instanceof Start);
    const cars = [];

    if (startPoints.length > 0) {
        // Loop through each start point
        for (const startPoint of startPoints) {
            const dir = startPoint.directionVector;
            const startAngle = -angle(dir) + Math.PI / 2;

            // Generate N cars at each start point
            for (let i = 1; i <= N; i++) {
                cars.push(new Car(startPoint.center.x, startPoint.center.y, 30, 50, "AI", startAngle, maxSpeed));
            }
        }
    } else {
        // Fallback to a default start point if no startPoints are found
        const defaultPoint = new Point(100, 100);
        const dir = new Point(0, -1);
        const startAngle = -angle(dir) + Math.PI / 2;

        // Generate N cars at the default start point
        for (let i = 1; i <= N; i++) {
            cars.push(new Car(defaultPoint.x, defaultPoint.y, 30, 50, "AI", startAngle, maxSpeed));
        }
    }

    return cars;
}

function animate(time) {
    carPOV = false;
  
    for(let i = 0; i < traffic.length; i++) {
        // we dont want traffic to get damage so 2nd arg is []
        traffic[i].update(roadBorders, []);
    } 
    for(let i = 0; i < cars.length; i++) {
        cars[i].update(roadBorders, traffic);
    }
    for(let i = 0; i < traffic.length; i++) {
        traffic[i].draw(carCtx, "green");
    }

    // FITNESS FUCTION:
    bestCar = cars.find(
        c=>c.fittness == Math.max(...cars.map(c=>c.fittness))
    );
 
    world.cars = cars;
    world.bestCar = bestCar;

    // making the viewpoint base on the best car
    // can make a bool to control this later
    if(carPOV) {
        viewport.offset.x = -bestCar.x;
        viewport.offset.y = -bestCar.y;
        viewport.reset();
        const viewPoint = scale(viewport.getOffset(), -1);
        world.draw(carCtx, viewPoint, false);
    } else {
        viewport.offset.x = 250;
        viewport.offset.y = 300;
        viewport.reset();
        const viewPoint = scale(viewport.getOffset(), -1);
        world.draw(carCtx, viewPoint, false);
    }

    // car rendering
    carCtx.globalAlpha=0.2;
    for(let i = 0; i < cars.length; i++) {
        cars[i].draw(carCtx, "black");
    }
    carCtx.globalAlpha=1;
    bestCar.draw(carCtx, "black", true);
    carCtx.restore();
    
    // visualizing the NN
    requestAnimationFrame(animate);
}