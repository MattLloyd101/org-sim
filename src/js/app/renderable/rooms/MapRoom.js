define(["app/utils/RenderObject",
        "app/utils/math3d/Vector3",
        "app/utils/math3d/Quaternion",
        "app/utils/AStar",
        "app/renderable/rooms/Room",
        "app/renderable/items/TileGroup",
        "app/renderable/Text",
        "app/utils/EventBus",
        "app/utils/Random",
        "app/utils/Keyboard",],
    function (RenderObject,
              Vector3,
              Quaternion,
              AStar,
              Room,
              TileGroup,
              Text,
              EventBus,
              Random,
              K) {

        const constructor = function (teamEventBus, map, doorDirection, colour) {

            const context = this;
            const tileSize = 100;
            const leftMargin = 100;
            const rightMargin = 100;
            const topMargin = 100;
            const bottomMargin = 100;

            const mapWidth = map.width * tileSize;
            const mapHeight = map.height * tileSize;
            const width = leftMargin + mapWidth + rightMargin;
            const height = topMargin + mapHeight + bottomMargin;

            const room = Room.new.apply(this, [width, height, doorDirection, colour, "MAP"]);

            const This = Object.assign(room, {
                defaultMap: map,
                map,
                width,
                height,
                tiles: [],
                shiftPressed: false,
                defaultText: "Product"
            });

            This.pathMap.addObstacle(leftMargin,
                topMargin,
                mapWidth,
                mapHeight);

            This.clearMap = function () {
                This.removeChild(This.text);
                This.tiles.map(This.removeChild);
            };

            This.updateMap = function () {
                This.tiles.map(function (tile) {
                    tile.redrawImg.apply(context, [This.map.data[tile.index]]);
                });
            };

            This.redrawMap = function (text, map) {
                This.clearMap();

                This.map = map;
                const xOff = -mapWidth / 2 + tileSize / 2;
                const yOff = -mapHeight / 2 + tileSize / 2;
                for (let i = 0; i < map.width * map.height; i++) {
                    const tile = This.tiles[i] = TileGroup.new.apply(this, [map.data[i], i, tileSize, tileSize]);
                    tile.x = xOff + (i % map.width) * tileSize;
                    tile.y = yOff + Math.floor(i / map.width) * tileSize;
                    This.addChild(tile);

                    tile.eventBus.bindListener("MAP_CLICKED", function (mapPart) {
                        if (This.shiftPressed) {
                            const potentialTiles = map.get(mapPart.index);
                            console.log(potentialTiles);
                        } else if (This.optionPressed) {
                            console.log(mapPart);
                            console.log(map.allRestrictionsFor(mapPart.index));
                        } else if (This.cmdPressed) {
                            if(This.mapOwner) {
                                This.mapOwner.eventBus.emitEvent("FORCE_QUESTION", mapPart);
                            }
                        } else {
                            delete This.mapOwner;
                            This.redrawMap.apply(context, [This.defaultText, This.defaultMap]);
                        }
                    });
                }

                const fontColour = this.color(colour, 0x88, 0x22);
                This.text = Text.new.apply(this, [text, fontColour, 32]);
                This.text.x = xOff + This.text.width / 2 - 18;
                This.text.y = yOff - tileSize / 2 - This.text.height / 2 - 5;
                This.addChild(This.text);
            };

            This.redrawMap.apply(context, [This.defaultText, This.defaultMap]);

            teamEventBus.bindListener("OVERRIDE_MAP", function (data) {
                const {text, map, owner} = data;
                This.mapOwner = owner;
                This.redrawMap.apply(context, [text, map]);
            });

            teamEventBus.bindListener("UPDATE_MAP", This.updateMap);

            K.addEventListener(function (keys) {
                This.shiftPressed = K.keyMapping["SHIFT"] in keys;
                This.optionPressed = K.keyMapping["OPTION"] in keys;
                This.cmdPressed = K.keyMapping["CMD"] in keys;
            });

            return This;
        };

        return {
            new: constructor
        }
    });