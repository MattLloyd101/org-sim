define(["app/tiles/Tileset", "app/tiles/Map"], function(Tileset, Map) {

    const tileset = Tileset.loadNoRiversTileset();
    const map = Map.new(tileset);
    const tileContainer = document.getElementById("tile-container");

    const setupListeners = function () {
        const tiles = document.querySelectorAll(".tile");

        tiles.forEach(function(tile) {

            const index = tile.dataset.index;
            tile.addEventListener('click', function () {
                const potentialTiles = map.get(index);
                const pickedTileIndex = Math.floor(Math.random() * potentialTiles.length);
                const pickedTile = potentialTiles[pickedTileIndex];
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