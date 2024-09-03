class StopEditor extends MarkingEditor {
    constructor(viewport, world) {
        super(viewport, world, world.laneGuides);
    }

    createMarking(center, directionVector) {
        return new Stop(
            center,
            directionVector,
            world.roadWidth,
            world.roadWidth / 2
        );
    }
}