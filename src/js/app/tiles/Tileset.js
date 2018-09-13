define(['app/tiles/Tile'], function(Tile) {

    const constructor = function(tileset) {

        const This = {
            allTiles: tileset
        };

        This.findTilesByRestrictions = function(restrictions) {
            if(Object.keys(restrictions).length == 0) return tileset;

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

    const addTileAndRotations = function(tileset, path) {
        const ident = path.substr(0, 4);
        const probability = ident.indexOf("C") === -1 ? 1 : 0.1;
        const rot0 = Tile.new(ident, basePath + path, 0, probability);
        const rot1 = rot0.rotate(1);
        const rot2 = rot0.rotate(2);
        const rot3 = rot0.rotate(3);

        return tileset.concat([rot0, rot1, rot2, rot3]);
    };

    const loadNoRiversTileset = function() {
        let allTiles = [];

        // This is dumb, but quick.
        allTiles = addTileAndRotations(allTiles, "CCGC1.jpg");
        allTiles = addTileAndRotations(allTiles, "CCGG1.jpg");
        allTiles = addTileAndRotations(allTiles, "CCRC1.jpg");
        allTiles = addTileAndRotations(allTiles, "CCRC2.jpg");
        allTiles = addTileAndRotations(allTiles, "CGCG1.jpg");
        allTiles = addTileAndRotations(allTiles, "CGGC1.jpg");
        allTiles = addTileAndRotations(allTiles, "CGGC2.jpg");
        allTiles = addTileAndRotations(allTiles, "CGGC3.jpg");
        allTiles = addTileAndRotations(allTiles, "CGGC4.jpg");
        allTiles = addTileAndRotations(allTiles, "CGGG1.jpg");
        allTiles = addTileAndRotations(allTiles, "CGGG2.jpg");
        allTiles = addTileAndRotations(allTiles, "CGRC1.jpg");
        allTiles = addTileAndRotations(allTiles, "CGRG1.jpg");
        allTiles = addTileAndRotations(allTiles, "CGRR1.jpg");
        allTiles = addTileAndRotations(allTiles, "CGRR2.jpg");
        allTiles = addTileAndRotations(allTiles, "CRCR1.jpg");
        allTiles = addTileAndRotations(allTiles, "CRGG1.jpg");
        allTiles = addTileAndRotations(allTiles, "CRGR1.jpg");
        allTiles = addTileAndRotations(allTiles, "CRGR2.jpg");
        allTiles = addTileAndRotations(allTiles, "CRRC1.jpg");
        allTiles = addTileAndRotations(allTiles, "CRRC2.jpg");
        allTiles = addTileAndRotations(allTiles, "CRRG1.jpg");
        allTiles = addTileAndRotations(allTiles, "CRRR1.jpg");
        allTiles = addTileAndRotations(allTiles, "CRRR2.jpg");
        allTiles = addTileAndRotations(allTiles, "CRRR3.jpg");
        allTiles = addTileAndRotations(allTiles, "GCGC1.jpg");
        allTiles = addTileAndRotations(allTiles, "GCRC1.jpg");
        allTiles = addTileAndRotations(allTiles, "GGGG1.jpg");
        allTiles = addTileAndRotations(allTiles, "GGGG2.jpg");
        allTiles = addTileAndRotations(allTiles, "GGGG3.jpg");
        allTiles = addTileAndRotations(allTiles, "GGRG1.jpg");
        allTiles = addTileAndRotations(allTiles, "GGRG2.jpg");
        allTiles = addTileAndRotations(allTiles, "GGRR1.jpg");
        allTiles = addTileAndRotations(allTiles, "GGRR2.jpg");
        allTiles = addTileAndRotations(allTiles, "GRGR1.jpg");
        allTiles = addTileAndRotations(allTiles, "GRRR1.jpg");
        allTiles = addTileAndRotations(allTiles, "GRRR2.jpg");

        allTiles = addTileAndRotations(allTiles, "RCRC1.jpg");
        allTiles = addTileAndRotations(allTiles, "RGRG1.jpg");
        allTiles = addTileAndRotations(allTiles, "RGRR1.jpg");

        allTiles = addTileAndRotations(allTiles, "RRRR1.jpg");
        allTiles = addTileAndRotations(allTiles, "RRRR2.jpg");

        return constructor(allTiles);
    };

    const loadDefaultTileset = function() {
        let allTiles = [];

        // This is dumb, but quick.
        allTiles = addTileAndRotations(allTiles, "CCGC1.jpg");
        allTiles = addTileAndRotations(allTiles, "CCGG1.jpg");
        allTiles = addTileAndRotations(allTiles, "CCRC1.jpg");
        allTiles = addTileAndRotations(allTiles, "CCRC2.jpg");
        allTiles = addTileAndRotations(allTiles, "CGCG1.jpg");
        allTiles = addTileAndRotations(allTiles, "CGGC1.jpg");
        allTiles = addTileAndRotations(allTiles, "CGGC2.jpg");
        allTiles = addTileAndRotations(allTiles, "CGGC3.jpg");
        allTiles = addTileAndRotations(allTiles, "CGGC4.jpg");
        allTiles = addTileAndRotations(allTiles, "CGGG1.jpg");
        allTiles = addTileAndRotations(allTiles, "CGGG2.jpg");
        allTiles = addTileAndRotations(allTiles, "CGRC1.jpg");
        allTiles = addTileAndRotations(allTiles, "CGRG1.jpg");
        allTiles = addTileAndRotations(allTiles, "CGRR1.jpg");
        allTiles = addTileAndRotations(allTiles, "CGRR2.jpg");
        allTiles = addTileAndRotations(allTiles, "CLCL1.jpg");
        allTiles = addTileAndRotations(allTiles, "CLCL2.jpg");
        allTiles = addTileAndRotations(allTiles, "CLLC1.jpg");
        allTiles = addTileAndRotations(allTiles, "CLRL1.jpg");
        allTiles = addTileAndRotations(allTiles, "CRCR1.jpg");
        allTiles = addTileAndRotations(allTiles, "CRGG1.jpg");
        allTiles = addTileAndRotations(allTiles, "CRGR1.jpg");
        allTiles = addTileAndRotations(allTiles, "CRGR2.jpg");
        allTiles = addTileAndRotations(allTiles, "CRRC1.jpg");
        allTiles = addTileAndRotations(allTiles, "CRRC2.jpg");
        allTiles = addTileAndRotations(allTiles, "CRRG1.jpg");
        allTiles = addTileAndRotations(allTiles, "CRRR1.jpg");
        allTiles = addTileAndRotations(allTiles, "CRRR2.jpg");
        allTiles = addTileAndRotations(allTiles, "CRRR3.jpg");
        allTiles = addTileAndRotations(allTiles, "GCGC1.jpg");
        allTiles = addTileAndRotations(allTiles, "GCRC1.jpg");
        allTiles = addTileAndRotations(allTiles, "GGGG1.jpg");
        allTiles = addTileAndRotations(allTiles, "GGGG2.jpg");
        allTiles = addTileAndRotations(allTiles, "GGGG3.jpg");
        allTiles = addTileAndRotations(allTiles, "GGGL1.jpg");
        allTiles = addTileAndRotations(allTiles, "GGLL1.jpg");
        allTiles = addTileAndRotations(allTiles, "GGRG1.jpg");
        allTiles = addTileAndRotations(allTiles, "GGRG2.jpg");
        allTiles = addTileAndRotations(allTiles, "GGRR1.jpg");
        allTiles = addTileAndRotations(allTiles, "GGRR2.jpg");
        allTiles = addTileAndRotations(allTiles, "GLGG1.jpg");
        allTiles = addTileAndRotations(allTiles, "GLGL1.jpg");
        allTiles = addTileAndRotations(allTiles, "GLGR1.jpg");
        allTiles = addTileAndRotations(allTiles, "GLRL1.jpg");
        allTiles = addTileAndRotations(allTiles, "GRGR1.jpg");
        allTiles = addTileAndRotations(allTiles, "GRRR1.jpg");
        allTiles = addTileAndRotations(allTiles, "GRRR2.jpg");
        allTiles = addTileAndRotations(allTiles, "LRLR1.jpg");
        allTiles = addTileAndRotations(allTiles, "RCRC1.jpg");
        allTiles = addTileAndRotations(allTiles, "RGRG1.jpg");
        allTiles = addTileAndRotations(allTiles, "RGRR1.jpg");
        allTiles = addTileAndRotations(allTiles, "RRLL1.jpg");
        allTiles = addTileAndRotations(allTiles, "RRRR1.jpg");
        allTiles = addTileAndRotations(allTiles, "RRRR2.jpg");

        return constructor(allTiles);
    };

    return {
        new: constructor,
        addTileAndRotations,
        loadDefaultTileset,
        loadNoRiversTileset
    };
});