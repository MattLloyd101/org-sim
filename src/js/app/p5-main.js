define(["p5",
        "app/config/p5-config",
        "app/utils/Keyboard",
        "app/tiles/Tileset",
        "app/utils/RenderObject",
        "app/renderable/Person",
        "app/renderable/RootContext",
        "app/renderable/rooms/DevelopmentRoom",
        "app/renderable/rooms/MeetingRoom",
        "app/renderable/rooms/Office",
        "app/renderable/rooms/RoomSet",
        "app/renderable/rooms/MapRoom",
        "app/tiles/Map"
    ],

    function (p5,
              config,
              Keyboard,
              Tileset,
              RenderObject,
              Person,
              RootContext,
              DevelopmentRoom,
              MeetingRoom,
              Office,
              RoomSet,
              MapRoom,
              Map) {

        const width = window.innerWidth;
        const height = window.innerHeight;
        const timestep = 1;

        let root;
        let clickBuffer;
        let font;
        let tileset;

        const createScene = function (root, context) {
            const teamColour = 0xFF * Math.random();
            const developerCount = 12;

            const map = Map.new(tileset, 7, 7);
            map.decideEdges();

            const devRoom = DevelopmentRoom.new.apply(context, [developerCount, false, "BOTTOM", teamColour]);
            const meetingRoom = MeetingRoom.new.apply(context, [developerCount, "TOP", teamColour]);
            const office = Office.new.apply(context, ["TOP", teamColour]);
            const mapRoom = MapRoom.new.apply(context, [map, "TOP", teamColour]);
            const roomSet = RoomSet.new.apply(context, [[devRoom, meetingRoom, office, mapRoom], teamColour]);

            root.addChild(roomSet);

            // const tiles = tileset.allTiles;
            // const tileImg = TileGroup.new.apply(context, [tiles, 100, 100]);
            // root.addChild(tileImg);
            //
            // for (let i = 0; i < 25; i++) {
            //     const tileImg2 = TileGroup.new.apply(context, [tiles, 100, 100]);
            //     tileImg2.x = 100 * (i % 5);
            //     tileImg2.y = 100 * (1 + Math.floor(i / 5));
            //     root.addChild(tileImg2);
            // }

            for (let i = 0; i < developerCount; i++) {
                const p = Person.new.apply(context, ["DEV", teamColour]);
                p.enterRoom(roomSet.corridor);
            }

            const po = Person.new.apply(context, ["PO", teamColour]);
            office.setOwner(po);
            po.enterRoom(office);
        };

        const preload = function (context) {
            font = context.loadFont('fonts/OpenSans-light.otf');
            tileset = Tileset.loadNoRiversTileset(context);
        };

        const resetContext = function (context) {
            context.ortho(-width / 2, width / 2, -height / 2, height / 2, -2000, 2000);
            context.smooth(4);
            context.colorMode(context.HSB, 0xFF);
            context.textFont(font);
        };

        const setupContext = function (context) {
            const renderer = context.WEBGL;
            context.createCanvas(width, height, renderer);
            resetContext(context);
        };

        const setup = function (context) {

            Keyboard.setup(context);
            setupContext(context);

            RenderObject.setRootContext(context);
            root = RootContext.new();
            root.resetTransformation();

            createScene(root, context);
        };

        let n = 0;
        const update = function () {
            root.updateAll(timestep);
            n++;
        };

        const render = function (context) {

            // This seems a lil silly
            // probably should use an off screen buffer, but this works...
            context.push();
            const fill = context.fill;
            const texture = context.texture;
            context.__fill = fill;
            context.background(0);
            root.renderAll(context, true);
            clickBuffer = context.get();
            context.fill = fill;
            context.texture = texture;
            context.pop();

            context.background(0xFF);
            root.renderAll(context);
        };

        const click = function (mouseX, mouseY) {
            const pixel = clickBuffer.get(mouseX, mouseY);
            const id = pixel[0] << 4 | pixel[1];
            if (id > 0)
                root.performClick(id, mouseX, mouseY);
        };

        const rootContext = function (context) {

            context.preload = function () {
                preload(context);
            };

            context.setup = function () {
                setup(context);
            };

            context.draw = function () {

                update();
                context.push();
                render(context);
                context.pop();
            };

            context.mouseClicked = function () {
                click(context.mouseX, context.mouseY);
            };
        };

        const p5Instance = new p5(rootContext, document.getElementById("p5"));

        return {
            p5Instance
        }
    });