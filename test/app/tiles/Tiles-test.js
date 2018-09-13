const requirejs = require('requirejs');
const assert = require('chai').assert;

requirejs.config({nodeRequire: require, baseUrl: "src/js"});

describe('Tiles', function () {
    describe('#findTilesByRestrictions()', function () {
        it('should filter by restrictions', function (done) {
            requirejs(['app/tiles/Tileset', 'app/tiles/Tile'], function (Tiles, Tile) {
                const tileset = Tiles.new([
                    Tile.new("GGRG", "fakepath.jpg"),
                    Tile.new("GGGR", "fakepath.jpg", 1),
                    Tile.new("RGGG", "fakepath.jpg", 2),
                    Tile.new("GRGG", "fakepath.jpg", 3)]
                );

                const tiles = tileset.findTilesByRestrictions({ up: "R" });

                assert.lengthOf(tiles, 1);
                const tile = tiles[0];
                assert.equal(tile.up, "R");
                assert.equal(tile.rotation, 2);

                done();
            });
        });
        it('should filter by multiple restrictions', function (done) {
            requirejs(['app/tiles/Tileset', 'app/tiles/Tile'], function (Tiles, Tile) {
                const tileset = Tiles.new([
                    Tile.new("RGGG", "fakepath.jpg"),
                    Tile.new("LGGR", "fakepath.jpg"),
                    Tile.new("RLGG", "fakepath.jpg", 1),
                    Tile.new("GRLG", "fakepath.jpg", 2),
                    Tile.new("GGRL", "fakepath.jpg", 3)]
                );

                const tiles = tileset.findTilesByRestrictions({ up: "R", right: "L" });

                assert.lengthOf(tiles, 1);
                const tile = tiles[0];
                assert.equal(tile.up, "R");
                assert.equal(tile.right, "L");
                assert.equal(tile.rotation, 1);

                done();
            });
        });
    });
});
