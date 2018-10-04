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
                    if(key !== "offset" && restrictions.hasOwnProperty(key)) {
                        matchesRestriction = tile[key] === restrictions[key];
                        if (!matchesRestriction) break;
                    }
                }

                return matchesRestriction;
            });
        };

        This.featuredTiles = function () {
            return tileset.filter(function(tile) {
                return tile.features.indexOf("castle") !== -1 ||
                    tile.features.indexOf("church") !== -1 ||
                    tile.features.indexOf("lake") !== -1 ||
                    tile.features.indexOf("shrine") !== -1;
            });
        };

        This.nonFeaturedTiles = function () {
            return tileset.filter(function(tile) {
                return tile.features.indexOf("castle") === -1 &&
                    tile.features.indexOf("church") === -1 &&
                    tile.features.indexOf("lake") === -1 &&
                    tile.features.indexOf("shrine") === -1;
            });
        };

        return This;
    };

    const basePath = 'tiles/';

    const addTileAndRotations = function(context, tileset, path, features) {
        const ident = path.substr(0, 4);
        const rot0 = Tile.new(context, ident, basePath + path, 0, features);
        const rot1 = rot0.rotate(1);
        const rot2 = rot0.rotate(2);
        const rot3 = rot0.rotate(3);

        return tileset.concat([rot0, rot1, rot2, rot3]);
    };

    const loadDefaultTileset = function (context) {
        let allTiles = [];

        // This is dumb, but quick.
        allTiles = addTileAndRotations(context, allTiles, "CCGC1.jpg", ["castle"]);
        allTiles = addTileAndRotations(context, allTiles, "CCGG1.jpg", ["castle", "corn"]);
        allTiles = addTileAndRotations(context, allTiles, "CCRC1.jpg", ["castle", "road"]);
        // allTiles = addTileAndRotations(context, allTiles, "CCRC2.jpg", ["castle", "road"]);
        allTiles = addTileAndRotations(context, allTiles, "CGCG1.jpg", ["castle"]);
        // allTiles = addTileAndRotations(context, allTiles, "CGGC1.jpg", ["castle"]);
        // allTiles = addTileAndRotations(context, allTiles, "CGGC2.jpg", ["castle"]);
        // allTiles = addTileAndRotations(context, allTiles, "CGGC3.jpg", ["castle"]);
        allTiles = addTileAndRotations(context, allTiles, "CGGC4.jpg", ["castle", "corn"]);
        allTiles = addTileAndRotations(context, allTiles, "CGGG1.jpg", ["castle"]);
        allTiles = addTileAndRotations(context, allTiles, "CGGG2.jpg", ["castle", "shrine"]);
        allTiles = addTileAndRotations(context, allTiles, "CGRC1.jpg", ["castle", "road"]);
        allTiles = addTileAndRotations(context, allTiles, "CGRG1.jpg", ["castle", "shrine", "road"]);
        allTiles = addTileAndRotations(context, allTiles, "CGRR1.jpg", ["castle", "road"]);
        allTiles = addTileAndRotations(context, allTiles, "CGRR2.jpg", ["castle", "corn", "road"]);
        allTiles = addTileAndRotations(context, allTiles, "CLCL1.jpg", ["castle", "river"]);
        allTiles = addTileAndRotations(context, allTiles, "CLCL2.jpg", ["castle", "river"]);
        allTiles = addTileAndRotations(context, allTiles, "CLLC1.jpg", ["castle", "river"]);
        allTiles = addTileAndRotations(context, allTiles, "CLRL1.jpg", ["castle", "river", "road"]);
        allTiles = addTileAndRotations(context, allTiles, "CRCR1.jpg", ["castle", "road"]);
        allTiles = addTileAndRotations(context, allTiles, "CRGG1.jpg", ["castle", "corn", "road"]);
        allTiles = addTileAndRotations(context, allTiles, "CRGR1.jpg", ["castle", "road"]);
        allTiles = addTileAndRotations(context, allTiles, "CRGR2.jpg", ["castle", "shrine", "road"]);
        // allTiles = addTileAndRotations(context, allTiles, "CRRC1.jpg", ["castle", "road"]);
        allTiles = addTileAndRotations(context, allTiles, "CRRC2.jpg", ["castle", "road"]);
        allTiles = addTileAndRotations(context, allTiles, "CRRG1.jpg", ["castle", "road"]);
        allTiles = addTileAndRotations(context, allTiles, "CRRR1.jpg", ["castle", "road"]);
        // allTiles = addTileAndRotations(context, allTiles, "CRRR2.jpg", ["castle", "road"]);
        allTiles = addTileAndRotations(context, allTiles, "CRRR3.jpg", ["castle", "lake", "road"]);
        allTiles = addTileAndRotations(context, allTiles, "GCGC1.jpg", ["castle"]);
        allTiles = addTileAndRotations(context, allTiles, "GCRC1.jpg", ["castle", "road"]);
        allTiles = addTileAndRotations(context, allTiles, "GGGG1.jpg", ["church"]);
        allTiles = addTileAndRotations(context, allTiles, "GGGG2.jpg", ["grass"]);
        allTiles = addTileAndRotations(context, allTiles, "GGGG3.jpg", ["shrine"]);
        allTiles = addTileAndRotations(context, allTiles, "GGGL1.jpg", ["lake", "river"]);
        allTiles = addTileAndRotations(context, allTiles, "GGLL1.jpg", ["river"]);
        allTiles = addTileAndRotations(context, allTiles, "GGRG1.jpg", ["church", "road"]);
        allTiles = addTileAndRotations(context, allTiles, "GGRG2.jpg", ["shrine", "road"]);
        allTiles = addTileAndRotations(context, allTiles, "GGRR1.jpg", ["road"]);
        allTiles = addTileAndRotations(context, allTiles, "GGRR2.jpg", ["corn", "road"]);
        allTiles = addTileAndRotations(context, allTiles, "GLGG1.jpg", ["river"]);
        allTiles = addTileAndRotations(context, allTiles, "GLGL1.jpg", ["river"]);
        allTiles = addTileAndRotations(context, allTiles, "GLGR1.jpg", ["river", "road"]);
        allTiles = addTileAndRotations(context, allTiles, "GLRL1.jpg", ["church", "river", "road"]);
        allTiles = addTileAndRotations(context, allTiles, "GRGR1.jpg", ["road"]);
        allTiles = addTileAndRotations(context, allTiles, "GRRR1.jpg", ["road"]);
        allTiles = addTileAndRotations(context, allTiles, "GRRR2.jpg", ["lake", "road"]);
        allTiles = addTileAndRotations(context, allTiles, "LRLR1.jpg", ["river", "road"]);
        allTiles = addTileAndRotations(context, allTiles, "RCRC1.jpg", ["castle", "road"]);
        allTiles = addTileAndRotations(context, allTiles, "RGRG1.jpg", ["shrine", "road"]);
        allTiles = addTileAndRotations(context, allTiles, "RGRR1.jpg", ["corn", "road"]);
        allTiles = addTileAndRotations(context, allTiles, "RRLL1.jpg", ["river", "road"]);
        allTiles = addTileAndRotations(context, allTiles, "RRRR1.jpg", ["road"]);
        allTiles = addTileAndRotations(context, allTiles, "RRRR2.jpg", ["church", "road"]);

        return allTiles;
    };

    let _defaultTileset;
    const getDefaultTileset = function (context) {
        if(_defaultTileset === undefined) {
            _defaultTileset = loadDefaultTileset(context);
        }

        return _defaultTileset;
    };

    const tilesWithoutFeature = function(context, feature) {
        return getDefaultTileset(context).filter(function(tile) {
            return tile.features.indexOf(feature) === -1;
        });
    };

    const tilesWithFeature = function(context, feature) {
        return getDefaultTileset(context).filter(function(tile) {
            return tile.features.indexOf(feature) !== -1;
        });
    };

    const loadNoRiversTileset = function(context) {
        const noRiversTileset = tilesWithoutFeature(context, "river");

        return constructor(noRiversTileset);
    };

    const loadTileset = function(context) {
        const defaultTileset = getDefaultTileset(context);
        return constructor(defaultTileset);
    };

    const applyRestrictions = function (tiles, restrictions) {
        return restrictions.reduce(function (newTiles, restriction) {
            return restriction.restrict(newTiles);
        }, tiles);
    };

    return {
        new: constructor,


        applyRestrictions,

        loadTileset,
        loadNoRiversTileset,

        tilesWithFeature,
        tilesWithoutFeature
    };
});