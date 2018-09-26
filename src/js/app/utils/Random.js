define([], function () {

    const shuffle = function(a) {
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    };

    const between = function(min, max) {
        return min + (max - min) * Math.random();
    };

    // I think there's a bug in this...
    // Things are appearing more often than I'd expect.
    const weightedRandomSelection = function (tiles) {
        const totalWeight = tiles.reduce(function(out, tile) {
            return out + tile.probability;
        }, 0);
        let weight = Math.random() * totalWeight;

        for (let i = 0; i < tiles.length; i ++) {
            const tile = tiles[i];
            weight -= tile.probability;
            if (weight <= 0)
                return tile;
        }
    };

    return {
        shuffle,
        between,
        weightedRandomSelection
    }
});