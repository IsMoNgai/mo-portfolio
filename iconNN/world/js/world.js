class World {
    constructor(
        graph, 
        options = {}
    ) {
        // roadWidth = 100, 
        // roadRoundness = 10,
        // buildingWidth = 150,
        // buildingMinLength = 150,
        // spacing = 50,
        // treeSize = 160,
        // showBuilding = true,
        // showTree = true,
        this.graph = graph;
        this.roadWidth = options.roadWidth ?? 100;
        this.roadRoundness = options.roadRoundness ?? 10;
        this.buildingWidth = options.buildingWidth ?? 150;
        this.buildingMinLength = options.buildingMinLength ?? 150;
        this.spacing = options.spacing ?? 50;
        this.treeSize = options.treeSize ?? 160;

        this.envelopes = []; // road itself (type envelopes)
        this.roadBorders = []; // type Segments
        this.buildings = []; // type Building
        this.trees = []; //  type Tree
        this.laneGuides = []; // type Segments

        this.markings = [];

        this.cars = [];
        this.bestCar = null;

        this.generate();
    }

    static load(info) {
        const world = new World(new Graph());
        world.graph = Graph.load(info.graph);
        world.roadWidth = info.roadWidth;
        world.roadRoundness = info.roadRoundness;
        world.buildingWidth = info.buildingWidth;
        world.buildingMinLength = info.buildingMinLength;
        world.spacing = info.spacing;
        world.treeSize = info.treeSize;
        world.envelopes = info.envelopes.map((e) => Envelope.load(e));
        world.roadBorders = info.roadBorders.map((b) => new Segment(b.p1, b.p2));
        world.buildings = info.buildings.map((e) => Building.load(e));
        world.trees = info.trees.map((t) => new Tree(t.center, info.treeSize));
        world.laneGuides = info.laneGuides.map((l) => new Segment(l.p1, l.p2)); // type Segments
        world.markings = info.markings.map((m) => Marking.load(m));
        world.zoom = info.zoom;
        world.offset = info.offset;
        return world;
    }

    generate(genTree = true, genBuilding = true) {
        this.envelopes.length = 0;
        for (const seg of this.graph.segments) {
            this.envelopes.push(
                new Envelope(seg, this.roadWidth, this.roadRoundness)
            );
        }

        this.roadBorders = Polygon.union(this.envelopes.map((e) => e.poly));
        this.buildings = genBuilding ? this.#generateBuildings() : [];
        this.trees = genTree ? this.#generateTrees() : [];

        this.laneGuides.length = 0;
        this.laneGuides.push(...this.#generateLaneGuides());
    }

    #generateLaneGuides() {
        const tmpEnvelopes = [];
        for (const seg of this.graph.segments) {
            tmpEnvelopes.push (
                new Envelope(
                    seg,
                    this.roadWidth / 2,
                    this.roadRoundness
                )
            );
        }
        const segments = Polygon.union(tmpEnvelopes.map((e) => e.poly));
        return segments;
    }

    #generateTrees() {
        const points = [
            ...this.roadBorders.map((s) => [s.p1, s.p2]).flat(), // .flat() make [[a,b,c]] to [a,b,c]
            ...this.buildings.map((b) => b.base.points).flat()
        ]
        const left = Math.min(...points.map((p) => p.x));
        const right = Math.max(...points.map((p) => p.x));
        const top = Math.max(...points.map((p) => p.y));
        const bottom = Math.min(...points.map((p) => p.y));

        const illegalPolys = [
            ...this.buildings.map((b) => b.base),
            ...this.envelopes.map((e) => e.poly)
        ]

        const trees = [];
        // tryCount so we didnt force it to build 100 trees since it might
        // be too hard to build exactly 10 trees which make it end up infinite loop
        let tryCount = 0;
        while (tryCount < 100) {
            const p = new Point(
                lerp(left, right, Math.random()),
                lerp(bottom, top, Math.random())
            );

            // check if the tree is inside road or nearby road
            let keep = true;
            for (const poly of illegalPolys) {
                if(poly.containsPoint(p) || poly.distanceToPoint(p) < this.treeSize / 2) {
                    keep = false;
                    break;
                }
            }

            // check if tree is too close to other tree
            if(keep) {
                for (const tree of trees) {
                    if(distance(tree.center, p) < this.treeSize) {
                        keep = false;
                        break;
                    }
                }
            }

            // avoiding tree from middle of no where
            if(keep) {
                let closeToSomething = false;
                for (const poly of illegalPolys) {
                    if(poly.distanceToPoint(p) < this.treeSize * 2) {
                        closeToSomething = true;
                        break;
                    }
                }
                keep =  closeToSomething;
            }

            if(keep) {
                trees.push(new Tree(p, this.treeSize));
                tryCount = 0;
            }
            tryCount++;
        }
        return trees;
    }

    // this function return envolopes
    #generateBuildings() {
        const tmpEnvelopes = [];
        for (const seg of this.graph.segments) {
            tmpEnvelopes.push (
                new Envelope(
                    seg,
                    this.roadWidth + this.buildingWidth + this.spacing*2,
                    this.roadRoundness
                )
            );
        }

        const guides = Polygon.union(tmpEnvelopes.map((e) => e.poly));
        
        for (let i = 0; i < guides.length; i++) {
            const seg = guides[i];
            if (seg.length() < this.buildingMinLength) {
                guides.splice(i, 1);
                i--;
            }
        }

        const supports = [];

        for (let seg of guides) {
            const len = seg.length() + this.spacing;
            const buildingCount = Math.floor(
                len / (this.buildingWidth + this.spacing)
            );
            const buildingLength = len/buildingCount - this.spacing;
            
            // create a direction vector in the direction of building area
            // which is parallel to road
            const dir = seg.directionVector();

            // now we add intilize the support
            // this seg(q1, q2) is the first house along the direction vector
            let q1 = seg.p1;
            let q2 = add(q1, scale(dir, buildingLength));
            supports.push(new Segment(q1, q2));

            for (let i = 2; i <= buildingCount; i++) {
                q1 = add(q2, scale(dir, this.spacing));
                q2 = add(q1, scale(dir, buildingLength));
                supports.push(new Segment(q1, q2));
            }
        }
            
        // now create a envolopes around each seg
        const bases = [];
        for (const seg of supports) {
            bases.push(new Envelope(seg, this.buildingWidth).poly)
        }

        // we need to remove either one of the intersecting pair poly
        const eps = 0.001;
        for (let i = 0; i < bases.length-1; i++) {
            for (let j = i+1; j < bases.length; j++) {
                if(bases[i].intersectsPoly(bases[j]) || bases[i].distanceToPoly(bases[j]) < this.spacing - eps) {
                    bases.splice(j, 1);
                    j--;
                }
            }
        }

        return bases.map((b) => new Building(b));
    }

    draw(ctx, viewPoint, showStartMarkings = true, renderRadius = 1000, showBuilding = true, showTree = true) {
        for (const env of this.envelopes) {
            env.draw(ctx, {fill: "#BBB", stroke: "#BBB", lineWidth: 15});
        }
        for (const marking of this.markings) {
            if (!(marking instanceof Start) || showStartMarkings) {
                marking.draw(ctx);     
            } 
        }
        for (const seg of this.graph.segments) {
            seg.draw(ctx, {color: "white", width: 5, dash: [10,10]});
        }
        for (const seg of this.roadBorders) {
            seg.draw(ctx, {color : "white", width: 5})
        }

        // we need to group these two items tgt
        // so we can draw them in order based on viewPoint distance
        const items = []
        if(showBuilding) {
            items.push(...this.buildings)
        }
        if(showTree) {
            items.push(...this.trees)
        }
        if(items) {
            items.filter(
                (i) => i.base.distanceToPoint(viewPoint) < renderRadius 
                // little optimization here: we only render things within a distance
                // this is like most of the game you only render when you see it
            );      
            items.sort(
                // tree and building both have bases so we sort based on bases
                // base are type Polygon so we can use poly.distanceToPoint
                (a,b) => b.base.distanceToPoint(viewPoint) - a.base.distanceToPoint(viewPoint)
            );
            for (const item of items) {
                // testing purposes
                // tree.draw(ctx, {size: this.treeSize, color: "rgba(0,0,0,0.5)"});
                item.draw(ctx, viewPoint);
            }      
        }
    }
 }