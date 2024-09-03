class StartEditor extends MarkingEditor {
    constructor(viewport, world) {
        super(viewport, world, world.laneGuides);
    }

    createMarking(center, directionVector) {
        return new Start(
            center,
            directionVector,
            world.roadWidth,
            world.roadWidth / 2
        );
    }
}