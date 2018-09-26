define(["app/tiles/Tileset", "app/tiles/Map", "app/utils/Random"], function(Tileset, Map, Random) {

    const tileset = Tileset.loadNoRiversTileset();
    const map = Map.new(tileset);
    const tileContainer = document.getElementById("tile-container");

    const setupListeners = function () {
        const tiles = document.querySelectorAll(".tile");

        tiles.forEach(function(tile) {

            const index = tile.dataset.index;
            tile.addEventListener('click', function () {
                const potentialTiles = map.get(index);
                const pickedTile = Random.weightedRandomSelection(potentialTiles);
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