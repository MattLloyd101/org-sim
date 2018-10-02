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
                return containerX + testX >= x - safeSpace && containerX + testX < (x + width + safeSpace) &&
                    containerY + testY >= y - safeSpace && containerY + testY < (y + height + safeSpace);
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
                        const aX = containerX + x + (resolution / 2);
                        const aY = containerY + y + (resolution / 2);
                        const point = {x:aX, y:aY, ix, iy};
                        This.calculatedMap[ix + "," + iy] = point;

                        //noinspection EqualityComparisonWithCoercionJS
                        if (This.doorwayX != null && this.doorwayY != null) {
                            const dX = (This.doorwayX) - aX;
                            const dY = (This.doorwayY) - aY;
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
                context.translate(x, y, 0);
                if (This.entrancePoint.x === x && This.entrancePoint.y === y) {
                    context.fill(context.color(50, 0xFF, 0xFF, 64));
                } else {
                    context.fill(debugPointColour);
                }

                context.rect(-resolution/2, -resolution/2, resolution, resolution);
                context.pop();
            });

            if(This.path) {
                this.push();
                this.translate(0, 0);
                this.colorMode(this.RGB, 0xFF);
                this.stroke(0xFF, 0, 0);
                for(let i = 1; i < This.path.length; i++) {
                    const a = This.path[i];
                    const b = This.path[i - 1];
                    this.line(a.x, a.y, 0, b.x, b.y, 0);
                }
                this.pop();
            }
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
            This.recalculate();
        };

        This.removeObstacle = function (id) {
            delete obstacles[id];
            This.recalculate();
        };

        This.findClosestPoint = function(position) {
            const {x, y} = position;
            const tx = x, ty = y;
            const keys = Object.keys(This.calculatedMap);
            const [closestKey, _] = keys.reduce(function (closestAndDist, currentKey) {
                const [_, dist] = closestAndDist;
                const current = This.calculatedMap[currentKey];
                const {x, y} = current;
                const dx = tx - x;
                const dy = ty - y;
                // could remove sqrt for an optimisation here.
                const currDist = Math.sqrt(dx*dx + dy*dy);

                if(currDist < dist) {
                    return [currentKey, currDist];
                }

                return closestAndDist;
            }, [null, Number.POSITIVE_INFINITY]);

            return This.calculatedMap[closestKey];
        };

        This.recalculate();

        return This;
    };

    return {
        new: constructor,

    }
});