define(["app/tiles/Tileset", "app/tiles/Map"], function(Tileset, Map) {

    const tileset = Tileset.loadNoRiversTileset();
    const map = Map.new(tileset);
    const tileContainer = document.getElementById("tile-container");

    // TODO: move to utils.
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

    const setupListeners = function () {
        const tiles = document.querySelectorAll(".tile");

        tiles.forEach(function(tile) {

            const index = tile.dataset.index;
            tile.addEventListener('click', function () {
                const potentialTiles = map.get(index);
                const pickedTile = weightedRandomSelection(potentialTiles);
                map.fixPosition(index, pickedTile);
                map.restrict();
                render();
            });
        });
    };

    const render = function () {
        map.render(tileContainer);

        setupListeners();
    };

    render();
});