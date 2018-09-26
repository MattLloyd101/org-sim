define(["app/utils/Random"], function (Random) {

    const constructor = function (tileset) {

        const width = 10;
        const height = 10;

        const This = {
            width,
            height,
            data: [],
            locked: {}
        };

        const dataSize = width * height;
        for (let i = 0; i < dataSize; i++) {
            This.data[i] = tileset.allTiles;
        }

        This.get = function (offset) {
            return This.data[offset];
        };

        This.fixPosition = function (offset, tile) {
            This.data[offset] = [tile];
            This.locked[offset] = true;
        };

        This.renderTile = function (tileset, index) {
            const maxOverlapping = 3;
            if (tileset.length > maxOverlapping) {
                tileset = Random.shuffle(tileset).slice(0, maxOverlapping);
            }
            let tileContents = tileset.reduce(function (out, tile) {
                return out + tile.render();
            }, "");

            return "<div class=\"tile\" data-index=\"" + index + "\">" + tileContents + "</div>"
        };

        This.render = function (target) {
            target.innerHTML = "";
            for (let i = 0; i < dataSize; i++) {

                target.innerHTML += This.renderTile(This.data[i], i);
            }
        };

        This.findCommon = function (tiles, direction) {
            //noinspection EqualityComparisonWithCoercionJS
            if (tiles == null || tiles.length === 0) return undefined;

            const edgeTypes = tiles.map(function (tile) {
                return tile[direction]
            });

            return edgeTypes.reduce(function (last, curr) {
                return last === curr ? curr : undefined;
            });
        };

        This.findRestrictionsFor = function (i) {
            const up = This.findCommon(This.data[i - width], 'down');
            const right = This.findCommon(This.data[i + 1], 'left');
            const down =  This.findCommon(This.data[i + width], 'up');
            const left = This.findCommon(This.data[i - 1], 'right');

            const restrictions = {};
            if (up) restrictions.up = up;
            if (right) restrictions.right = right;
            if (down) restrictions.down = down;
            if (left) restrictions.left = left;

            return restrictions;
        };

        This.restrict = function () {
            for (let i = 0; i < dataSize; i++) {
                if(This.locked[i]) continue;

                const restrictions = This.findRestrictionsFor(i);
                This.data[i] = tileset.findTilesByRestrictions(restrictions);
            }
        };

        return This;
    };

    return {
        new: constructor
    }
});