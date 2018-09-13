const requirejs = require('requirejs');
const assert = require('chai').assert;

requirejs.config({nodeRequire: require, baseUrl: "src/js"});

describe('Tile', function () {
    describe('#constructor()', function () {
        it('should return a Tile object', function (done) {
            requirejs(['app/tiles/Tile'], function (Tile) {
                assert.isFunction(Tile.new);

                const tile = Tile.new('URDL', 'fakepath.jpg');
                const tile2 = Tile.new('URDL', 'fakepath.jpg');

                assert.equal(tile.ident, 'URDL');
                assert.equal(tile.up, 'U');
                assert.equal(tile.right, 'R');
                assert.equal(tile.down, 'D');
                assert.equal(tile.left, 'L');
                assert.equal(tile.imgPath, 'fakepath.jpg');
                assert.equal(tile.rotation, 0);
                assert.equal(tile2.rotation, 0);

                done();
            });
        });
    });

    describe('#rotate()', function () {
        it('should rotate a Tile object', function (done) {
            requirejs(['app/tiles/Tile'], function (Tile) {
                assert.isFunction(Tile.new);

                const tile = Tile.new('URDL', 'fakepath.jpg');

                const rot1 = tile.rotate(1);
                assert.equal(rot1.ident, 'LURD');
                assert.equal(rot1.up, 'L');
                assert.equal(rot1.right, 'U');
                assert.equal(rot1.down, 'R');
                assert.equal(rot1.left, 'D');
                assert.equal(rot1.imgPath, 'fakepath.jpg');
                assert.equal(rot1.rotation, 1);

                assert.notEqual(rot1, tile);

                const rot3 = rot1.rotate(2);
                assert.equal(rot3.ident, 'RDLU');
                assert.equal(rot3.up, 'R');
                assert.equal(rot3.right, 'D');
                assert.equal(rot3.down, 'L');
                assert.equal(rot3.left, 'U');
                assert.equal(rot3.imgPath, 'fakepath.jpg');
                assert.equal(rot3.rotation, 3);

                const rot4 = rot3.rotate(1);
                assert.equal(rot4.ident, 'URDL');
                assert.equal(rot4.up, 'U');
                assert.equal(rot4.right, 'R');
                assert.equal(rot4.down, 'D');
                assert.equal(rot4.left, 'L');
                assert.equal(rot4.imgPath, 'fakepath.jpg');
                assert.equal(rot4.rotation, 0);

                done();
            });
        });
    });
});
