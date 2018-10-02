define([], function () {

    const euclidianDistance = function (start, end) {
        const dX = end.x - start.x;
        const dY = end.y - start.y;
        return Math.sqrt(dX * dX + dY * dY);
    };

    const pointIndex = function (point) {
        if (point.__index === undefined) {
            point.__index = point.ix + "," + point.iy;
        }
        return point.__index;
    };

    const getNeighbours = function (position, map) {
        const {ix, iy} = position;
        const neighbours = [
            map[(ix     ) + "," + (iy - 1)],
            map[(ix + 1 ) + "," + (iy - 1)],
            map[(ix + 1 ) + "," + (iy)],
            map[(ix + 1 ) + "," + (iy + 1)],
            map[(ix     ) + "," + (iy + 1)],
            map[(ix - 1 ) + "," + (iy + 1)],
            map[(ix - 1 ) + "," + (iy)],
            map[(ix - 1 ) + "," + (iy - 1)]
        ];

        return neighbours.filter(function (entry) {
            return entry !== undefined;
        });
    };

    const nodeWithLowestFScore = function (openSet, fScore) {
        return Object.keys(openSet).reduce(function (currentAndScore, nextKey) {
            const score = fScore[nextKey];
            const [_, currentScore] = currentAndScore;
            if (score < currentScore) {
                return [nextKey, score];
            }

            return currentAndScore;
        }, [null, Number.POSITIVE_INFINITY]);
    };

    const reconstructPath = function (cameFrom, closedSet, map, current) {
        let path = [];
        while (current !== undefined) {
            const currentIndex = pointIndex(current);
            path = path.concat([current]);
            const nextIndex = cameFrom[currentIndex];
            current = map[nextIndex];
        }

        return path.reverse();
    };

    const pathBetween = function (map, start, end, heuristicFn) {
        const startIndex = pointIndex(start);
        const endIndex = pointIndex(end);
        const distanceHeuristic = heuristicFn || euclidianDistance;

        const closedSet = [startIndex];
        closedSet[startIndex] = true;

        const openSet = {};
        openSet[startIndex] = start;
        const cameFrom = {};

        const gScore = {};
        gScore[startIndex] = 0;

        const fScore = {};
        fScore[startIndex] = distanceHeuristic(start, end);

        while (openSet.length !== 0) {
            const [currentIndex, _] = nodeWithLowestFScore(openSet, fScore);

            const current = openSet[currentIndex];

            if (currentIndex === endIndex) {
                return reconstructPath(cameFrom, closedSet, map, current)
            }

            // remove from openSet
            delete openSet[currentIndex];
            // add to closedSet
            closedSet[currentIndex] = true;

            const neighbours = getNeighbours(current, map);
            neighbours.map(function (neighbor) {
                const neighborIndex = pointIndex(neighbor);
                // if this neighbor is already in closed set, skip.
                if (neighborIndex in closedSet) {
                    return;
                }

                const neighborGScore = gScore[currentIndex] + euclidianDistance(current, neighbor);
                const currentNeighborGScore = gScore[neighborIndex] || Number.POSITIVE_INFINITY;
                if (!(neighborIndex in openSet)) {
                    openSet[neighborIndex] = neighbor;
                } else if (neighborGScore >= currentNeighborGScore) {
                    // if we have a worse gScore then this isn't the path.
                    return;
                }

                // otherwise it is the path.
                cameFrom[neighborIndex] = currentIndex;
                gScore[neighborIndex] = neighborGScore;
                fScore[neighborIndex] = gScore[neighborIndex] + distanceHeuristic(neighbor, end);
            });
        }
    };

    return {
        pathBetween
    }
});
