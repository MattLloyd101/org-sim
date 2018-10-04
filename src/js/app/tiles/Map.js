define(["app/utils/Random",
        "app/tiles/restrictions/EdgeRestriction",
        "app/tiles/restrictions/FeatureRestriction",
        "app/tiles/restrictions/RotationRestriction",
        "app/utils/EventBus"],
    function (Random,
              EdgeRestriction,
              FeatureRestriction,
              RotationRestriction,
              EventBus) {

        const constructor = function (tileset, _width, _height, empty) {

            const width = _width || 10;
            const height = _height || 10;

            const This = {
                width,
                height,
                tileset,
                data: [],
                locked: {},
                eventBus: EventBus.new()
            };

            const dataSize = width * height;

            for (let i = 0; i < dataSize; i++) {
                This.data[i] = empty ? [] : tileset.allTiles;
            }

            This.get = function (offset) {
                return This.data[offset];
            };

            This.fixPosition = function (offset, tile) {
                This.data[offset] = [tile];
                This.locked[offset] = true;
            };

            This.findCommon = function (offset, dimension, debug) {
                const tiles = This.data[offset];
                //noinspection EqualityComparisonWithCoercionJS
                if (tiles == null || tiles.length === 0) return undefined;

                const dimensionTypes = tiles.map(function (tile) {
                    return tile ? tile[dimension] : undefined;
                });

                if (dimension === 'features') {
                    return dimensionTypes.reduce(function (last, features) {
                        return last.filter(function (feature) {
                            return features.indexOf(feature) !== -1;
                        });
                    });
                }

                return dimensionTypes.reduce(function (last, curr) {
                    return last === curr ? curr : undefined;
                });
            };

            This.findRestrictionsFor = function (i) {

            };

            This.findRestrictionsFromSurrounding = function (i) {
                const up = This.findCommon(i - width, 'down');
                const right = This.findCommon(i + 1, 'left');
                const down = This.findCommon(i + width, 'up');
                const left = This.findCommon(i - 1, 'right');

                const restrictions = {offset: i};
                if (up) restrictions.up = up;
                if (right) restrictions.right = right;
                if (down) restrictions.down = down;
                if (left) restrictions.left = left;

                return restrictions;
            };

            This.restrictOne = function (i) {
                const restrictions = This.findRestrictionsFromSurrounding(i);
                This.data[i] = tileset.findTilesByRestrictions(restrictions);
            };

            This.restrict = function () {
                for (let i = 0; i < dataSize; i++) {
                    if (This.locked[i]) continue;

                    This.restrictOne(i);
                }
                This.eventBus.emitEvent("UPDATED");
            };

            This.decideEdges = function () {

                for (let x = 0; x < width; x++) {
                    for (let y = 0; y < height; y++) {
                        if ((y < 1 || y === height - 1) || (x === 0 || x === width - 1)) {
                            const off = x + (y * width);
                            const tile = Random.weightedRandomSelection(This.data[off]);

                            This.fixPosition(off, tile);
                            This.restrict();
                        }
                    }
                }
                This.eventBus.emitEvent("UPDATED");
            };

            This.edgeOnlyPartial = function (knowledgePercent, empty) {
                const newMap = constructor(tileset, _width, _height, empty);
                for (let x = 0; x < width; x++) {
                    for (let y = 0; y < height; y++) {
                        if ((y < 1 || y === height - 1) || (x === 0 || x === width - 1)) {
                            if (Math.random() < knowledgePercent) {
                                const off = x + (y * width);
                                newMap.fixPosition(off, This.data[off][0]);
                                if (!empty) newMap.restrict();
                            }
                        }
                    }
                }
                return newMap;
            };

            This.addKeyFeature = function (tx, ty, featureTile, knowledgePercent) {
                const newMap = This.edgeOnlyPartial(knowledgePercent);

                const off = tx + (ty * width);
                newMap.fixPosition(off, featureTile);
                newMap.restrict();
                return newMap;
            };

            This.findUnknownOffset = function () {
                const entries = This.data.filter(function (entry) {
                    return entry.length !== 1;
                });

                return This.data.indexOf(Random.select(entries));
            };

            This.translateRestriction = function (entry) {
                const out = [];
                if (entry.up) out.push(EdgeRestriction.new(entry.offset, 'up', entry.up, true));
                if (entry.down) out.push(EdgeRestriction.new(entry.offset, 'down', entry.down, true));
                if (entry.left) out.push(EdgeRestriction.new(entry.offset, 'left', entry.left, true));
                if (entry.right) out.push(EdgeRestriction.new(entry.offset, 'right', entry.right, true));
                if (entry.rotation) out.push(RotationRestriction.new(entry.offset, entry.rotation, true));

                if (entry.features) {
                    for (let i = 0; i < entry.features.length; i++) {
                        const feature = entry.features[i];

                        out.push(FeatureRestriction.new(entry.offset, feature, true));
                    }
                }
                return out;
            };

            This.allRestrictionsFor = function (i) {
                const out = [];

                const up = This.findCommon(i, 'up');
                if (up) out.push(EdgeRestriction.new(i, 'up', up, true));

                const right = This.findCommon(i, 'right');
                if (right) out.push(EdgeRestriction.new(i, 'right', right, true));

                const down = This.findCommon(i, 'down');
                if (down) out.push(EdgeRestriction.new(i, 'down', down, true));

                const left = This.findCommon(i, 'left');
                if (left) out.push(EdgeRestriction.new(i, 'left', left, true));

                const oUp = This.findCommon(i - width, 'down');
                if (oUp) out.push(EdgeRestriction.new(i - width, 'down', oUp, true));

                const oRight = This.findCommon(i + 1, 'left');
                if (oRight) out.push(EdgeRestriction.new(i + 1, 'left', oRight, true));

                const oDown = This.findCommon(i + width, 'up');
                if (oDown) out.push(EdgeRestriction.new(i + width, 'up', oDown, true));

                const oLeft = This.findCommon(i - 1, 'right');
                if (oLeft) out.push(EdgeRestriction.new(i - 1, 'right', oLeft, true));

                const rotation = This.findCommon(i, 'rotation');
                if(rotation) out.push(RotationRestriction.new(i, rotation, true));

                const features = This.findCommon(i, 'features', true);

                if (features) {
                    for (let n = 0; n < features.length; n++) {
                        const feature = features[n];

                        out.push(FeatureRestriction.new(i, feature, true));
                    }
                }

                return out;
            };

            This.allRestrictions = function () {
                const out = [];
                for (let i = 0; i < dataSize; i++) {
                    out.concat(This.allRestrictionsFor(i));
                }
                return out;
            };

            This.updateFromRestrictions = function (restrictions) {
                for (let i = 0; i < restrictions.length; i++) {
                    const restriction = restrictions[i];
                    const offset = restriction.offset;

                    let currData = This.data[offset];
                    if (currData.length === 0) {
                        currData = tileset.allTiles;
                    }

                    This.data[offset] = restriction.restrict(currData);
                    if(This.data[offset].length === 1) {
                        This.locked[offset] = true;
                    }
                    This.eventBus.emitEvent("UPDATED");
                }
                This.restrict();
            };

            This.uncertainty = function () {
                const max = dataSize * tileset.allTiles.length;
                return This.data.reduce(function (count, tiles) {
                    const len = tiles.length === 0 ? tileset.allTiles.length : tiles.length;
                    return count + len;
                }, 0) / max;
            };

            return This;
        };

        return {
            new: constructor
        }
    });