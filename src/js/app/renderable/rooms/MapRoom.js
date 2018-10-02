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

        const constructor = function (map, doorDirection, colour) {

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
                map,
                width,
                height,
                tiles: [],
                shiftPressed: false
            });

            This.pathMap.addObstacle(leftMargin,
                topMargin,
                mapWidth,
                mapHeight);

            const xOff = -mapWidth / 2 + tileSize / 2;
            const yOff = -mapHeight / 2 + tileSize / 2;
            for (let i = 0; i < map.width * map.height; i++) {
                const tile = This.tiles[i] = TileGroup.new.apply(this, [map.data[i], i, tileSize, tileSize]);
                tile.x = xOff + (i % map.width) * tileSize;
                tile.y = yOff + Math.floor(i / map.width) * tileSize;
                This.addChild(tile);
            }

            const fontColour = this.color(colour, 0x88, 0x22);
            This.text = Text.new.apply(this, ["Product", fontColour, 32]);
            This.text.x = xOff + This.text.width / 2 - 18;
            This.text.y = yOff - tileSize / 2 - This.text.height / 2 - 5;
            This.addChild(This.text);

            const context = this;

            EventBus.bindListener("MAP_CLICKED", function (mapPart) {
                if (This.shiftPressed) {
                    const potentialTiles = map.get(mapPart.index);
                    const pickedTile = Random.select(potentialTiles);
                    map.fixPosition(mapPart.index, pickedTile);
                    map.restrict();
                    This.tiles.map(function (tile) {
                        tile.redrawImg.apply(context, [This.map.data[tile.index]]);
                    });
                }
            });

            K.addEventListener(function (keys) {
                This.shiftPressed = K.keyMapping["SHIFT"] in keys;
            });

            return This;
        };

        return {
            new: constructor
        }
    });