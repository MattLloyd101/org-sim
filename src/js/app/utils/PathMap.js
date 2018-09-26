define([], function () {

    const constructor = function (containerX, containerY, width, height, resolution, safeSpace) {
        const This = {
            containerX, containerY,
            width, height,
            resolution
        };

        let obstacleId = 0;
        const obstacles = {};

        // probably could be inlined.
        const isObstructed = function (testX, testY) {
            const obstructedKey = Object.keys(obstacles).find(function (key) {
                const obstacle = obstacles[key];
                // intersectsWithObstacle inlined
                const {x, y, width, height} = obstacle;
                return containerX + testX >= x && containerX + testX < (x + width) &&
                    containerY + testY >= y && containerY + testY < (y + height);
            });

            return obstructedKey !== undefined;
        };

        // This is dumb and brute forcing it, probably should be using a quad tree instead
        This.recalculate = function () {
            This.calculatedMap = {};
            let distEntrance = Number.POSITIVE_INFINITY;

            for (let x = safeSpace, ix = 0; x < width - safeSpace; x += resolution, ix++) {
                for (let y = safeSpace, iy = 0; y < height - safeSpace; y += resolution, iy++) {
                    if (!isObstructed(x, y)) {
                        const point = {x, y, ix, iy};
                        This.calculatedMap[ix + "," + iy] = point;

                        //noinspection EqualityComparisonWithCoercionJS
                        if (This.doorwayX != null && this.doorwayY != null) {
                            const dX = (This.doorwayX) - (containerX + x);
                            const dY = (This.doorwayY) - (containerY + y);
                            const thisDistEntrance = Math.sqrt(dX * dX + dY * dY);
                            if (thisDistEntrance < distEntrance) {
                                This.entrancePoint = point;
                                distEntrance = thisDistEntrance;
                            }
                        }
                    }
                }
            }
        };

        This.renderDebug = function () {
            const debugPointColour = this.color(172, 0xFF, 0xFF, 64);
            const context = this;

            this.push();
            this.translate(0, 0, 0);
            this.colorMode(this.RGB, 0xFF);
            this.stroke(0, 0, 0xFF);
            this.line(This.doorwayX, This.doorwayY, 0, This.doorwayX, This.doorwayY, 100);
            this.pop();

            this.noStroke();
            Object.keys(This.calculatedMap).map(function (key) {
                const point = This.calculatedMap[key];
                const {x, y} = point;
                context.push();
                context.translate(containerX + x, containerY + y, 0);
                if (This.entrancePoint.x === x && This.entrancePoint.y === y) {
                    context.fill(context.color(50, 0xFF, 0xFF, 64));
                } else {
                    context.fill(debugPointColour);
                }

                context.rect(0, 0, resolution, resolution);
                context.pop();
            });
        };

        // assumes euclidian coordinates TL -> BR
        This.addObstacle = function (x, y, width, height) {
            const id = obstacleId++;

            obstacles[id] = {
                x, y,
                width, height
            };

            This.recalculate();

            return id;
        };

        This.setDoorway = function (x, y) {
            This.doorwayX = x;
            This.doorwayY = y;
            This.recalculate();
        };

        This.updateObstacle = function (id, x, y, width, height) {
            const obstacle = obstacles[id];
            obstacle.x = x;
            obstacle.y = y;
            obstacle.width = width;
            obstacle.height = height;
            recalculate();
        };

        This.removeObstacle = function (id) {
            delete obstacles[id];
            This.recalculate();
        };

        This.recalculate();

        return This;
    };

    return {
        new: constructor,

    }
});