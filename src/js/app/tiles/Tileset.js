define(['app/tiles/Tile'], function(Tile) {

    const constructor = function(tileset) {

        const This = {
            allTiles: tileset
        };

        This.findTilesByRestrictions = function(restrictions) {
            if(Object.keys(restrictions).length === 0) return tileset;

            return tileset.filter(function(tile) {
                let matchesRestriction;

                for(let key in restrictions) {
                    if(restrictions.hasOwnProperty(key)) {
                        matchesRestriction = tile[key] === restrictions[key];
                        if (!matchesRestriction) break;
                    }
                }

                return matchesRestriction;
            });
        };

        return This;
    };

    const basePath = 'tiles/';

    const addTileAndRotations = function(tileset, path, features) {
        const ident = path.substr(0, 4);
        const probability = features !== undefined && features.length > 0 ? 0.1 : 1;
        const rot0 = Tile.new(ident, basePath + path, 0, probability, features);
        const rot1 = rot0.rotate(1);
        const rot2 = rot0.rotate(2);
        const rot3 = rot0.rotate(3);

        return tileset.concat([rot0, rot1, rot2, rot3]);
    };

    const loadDefaultTileset = function () {
        let allTiles = [];

        // This is dumb, but quick.
        allTiles = addTileAndRotations(allTiles, "CCGC1.jpg", ["castle"]);
        allTiles = addTileAndRotations(allTiles, "CCGG1.jpg", ["castle", "corn"]);
        allTiles = addTileAndRotations(allTiles, "CCRC1.jpg", ["castle"]);
        allTiles = addTileAndRotations(allTiles, "CCRC2.jpg", ["castle"]);
        allTiles = addTileAndRotations(allTiles, "CGCG1.jpg", ["castle"]);
        allTiles = addTileAndRotations(allTiles, "CGGC1.jpg", ["castle"]);
        allTiles = addTileAndRotations(allTiles, "CGGC2.jpg", ["castle"]);
        allTiles = addTileAndRotations(allTiles, "CGGC3.jpg", ["castle"]);
        allTiles = addTileAndRotations(allTiles, "CGGC4.jpg", ["castle", "corn"]);
        allTiles = addTileAndRotations(allTiles, "CGGG1.jpg", ["castle"]);
        allTiles = addTileAndRotations(allTiles, "CGGG2.jpg", ["castle", "shrine"]);
        allTiles = addTileAndRotations(allTiles, "CGRC1.jpg", ["castle"]);
        allTiles = addTileAndRotations(allTiles, "CGRG1.jpg", ["castle", "shrine"]);
        allTiles = addTileAndRotations(allTiles, "CGRR1.jpg", ["castle"]);
        allTiles = addTileAndRotations(allTiles, "CGRR2.jpg", ["castle", "corn"]);
        allTiles = addTileAndRotations(allTiles, "CLCL1.jpg", ["castle", "river"]);
        allTiles = addTileAndRotations(allTiles, "CLCL2.jpg", ["castle", "river"]);
        allTiles = addTileAndRotations(allTiles, "CLLC1.jpg", ["castle", "river"]);
        allTiles = addTileAndRotations(allTiles, "CLRL1.jpg", ["castle", "river"]);
        allTiles = addTileAndRotations(allTiles, "CRCR1.jpg", ["castle"]);
        allTiles = addTileAndRotations(allTiles, "CRGG1.jpg", ["castle", "corn"]);
        allTiles = addTileAndRotations(allTiles, "CRGR1.jpg", ["castle"]);
        allTiles = addTileAndRotations(allTiles, "CRGR2.jpg", ["castle", "shrine"]);
        allTiles = addTileAndRotations(allTiles, "CRRC1.jpg", ["castle"]);
        allTiles = addTileAndRotations(allTiles, "CRRC2.jpg", ["castle"]);
        allTiles = addTileAndRotations(allTiles, "CRRG1.jpg", ["castle"]);
        allTiles = addTileAndRotations(allTiles, "CRRR1.jpg", ["castle"]);
        allTiles = addTileAndRotations(allTiles, "CRRR2.jpg", ["castle"]);
        allTiles = addTileAndRotations(allTiles, "CRRR3.jpg", ["castle", "lake"]);
        allTiles = addTileAndRotations(allTiles, "GCGC1.jpg", ["castle"]);
        allTiles = addTileAndRotations(allTiles, "GCRC1.jpg", ["castle"]);
        allTiles = addTileAndRotations(allTiles, "GGGG1.jpg", ["church"]);
        allTiles = addTileAndRotations(allTiles, "GGGG2.jpg");
        allTiles = addTileAndRotations(allTiles, "GGGG3.jpg", ["shrine"]);
        allTiles = addTileAndRotations(allTiles, "GGGL1.jpg", ["lake", "river"]);
        allTiles = addTileAndRotations(allTiles, "GGLL1.jpg", ["river"]);
        allTiles = addTileAndRotations(allTiles, "GGRG1.jpg", ["church"]);
        allTiles = addTileAndRotations(allTiles, "GGRG2.jpg", ["shrine"]);
        allTiles = addTileAndRotations(allTiles, "GGRR1.jpg");
        allTiles = addTileAndRotations(allTiles, "GGRR2.jpg", ["corn"]);
        allTiles = addTileAndRotations(allTiles, "GLGG1.jpg", ["river"]);
        allTiles = addTileAndRotations(allTiles, "GLGL1.jpg", ["river"]);
        allTiles = addTileAndRotations(allTiles, "GLGR1.jpg", ["river"]);
        allTiles = addTileAndRotations(allTiles, "GLRL1.jpg", ["church", "river"]);
        allTiles = addTileAndRotations(allTiles, "GRGR1.jpg");
        allTiles = addTileAndRotations(allTiles, "GRRR1.jpg");
        allTiles = addTileAndRotations(allTiles, "GRRR2.jpg", ["lake"]);
        allTiles = addTileAndRotations(allTiles, "LRLR1.jpg", ["river"]);
        allTiles = addTileAndRotations(allTiles, "RCRC1.jpg", ["castle"]);
        allTiles = addTileAndRotations(allTiles, "RGRG1.jpg", ["shrine"]);
        allTiles = addTileAndRotations(allTiles, "RGRR1.jpg", ["corn"]);
        allTiles = addTileAndRotations(allTiles, "RRLL1.jpg", ["river"]);
        allTiles = addTileAndRotations(allTiles, "RRRR1.jpg");
        allTiles = addTileAndRotations(allTiles, "RRRR2.jpg", ["church"]);

        return allTiles;
    };

    const defaultTileset = loadDefaultTileset();

    const tilesWithoutFeature = function(feature) {
        return defaultTileset.filter(function(tile) {
            return tile.features.indexOf(feature) === -1;
        });
    };

    const tilesWithFeature = function(feature) {
        return defaultTileset.filter(function(tile) {
            return tile.features.indexOf(feature) !== -1;
        });
    };

    const loadNoRiversTileset = function() {
        const noRiversTileset = tilesWithoutFeature("river");

        return constructor(noRiversTileset);
    };

    const loadTileset = function() {
        const defaultTileset = loadDefaultTileset();
        return constructor(defaultTileset());
    };

    return {
        new: constructor,

        loadTileset,
        loadNoRiversTileset,

        tilesWithFeature,
        tilesWithoutFeature
    };
});