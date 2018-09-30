define(["p5",
        "app/config/p5-config",
        "app/utils/Keyboard",
        "app/tiles/Tileset",
        "app/utils/RenderObject",
        "app/renderable/Person",
        "app/renderable/RootContext",
        "app/renderable/rooms/DevelopmentRoom",
        "app/renderable/rooms/MeetingRoom",
        "app/renderable/rooms/RoomSet",
        "app/renderable/items/TileGroup"],

    function (p5,
              config,
              Keyboard,
              Tileset,
              RenderObject,
              Person,
              RootContext,
              DevelopmentRoom,
              MeetingRoom,
              RoomSet,
              TileGroup) {

        const width = window.innerWidth;//config.width;
        const height = window.innerHeight;
        const timestep = 1;

        let root;
        let font;
        let tileset;

        const createScene = function (root, context) {
            const teamColour = 0xFF;
            const developerCount = 12;

            const devRoom = DevelopmentRoom.new.apply(context, [developerCount, false, "TOP", teamColour]);
            const meetingRoom = MeetingRoom.new.apply(context, [developerCount,"BOTTOM", teamColour]);
            const roomSet = RoomSet.new.apply(context, [[devRoom, meetingRoom], teamColour]);

            root.addChild(roomSet);

            const tiles = tileset.allTiles;
            const tileImg = TileGroup.new.apply(context, [tiles, 100, 100]);
            tileImg.x = width / 2;
            tileImg.y = height / 2;
            tileImg.rotationX = 0;
            tileImg.rotationY = 0;
            tileImg.rotationZ = 0;
            root.addChild(tileImg);
        };


        const preload = function (context) {
            font = context.loadFont('fonts/OpenSans-light.otf');
            tileset = Tileset.loadNoRiversTileset(context);
        };

        const setupContext = function (context) {
            const renderer = context.WEBGL; //context.P2D; //
            context.createCanvas(width, height, renderer);
            context.ortho(-width / 2, width / 2, -height / 2, height / 2, 0, 2000);
            context.smooth(4);
            context.colorMode(context.HSB, 0xFF);
            context.textFont(font);
        };

        const setup = function (context) {
            Keyboard.setup(context);
            setupContext(context);

            RenderObject.setRootContext(context);
            root = RootContext.new();

            root.rotationX = Math.PI / 4;
            root.rotationZ = Math.PI / 8;

            createScene(root, context);
        };

        let n = 0;
        const update = function () {
            root.updateAll(timestep);
            n++;
        };

        const render = function () {

            root.renderAll();
            root.cbRenderAll();
        };

        const rootContext = function (sketch) {

            sketch.preload = function () {
                preload(sketch);
            };

            sketch.setup = function () {
                setup(sketch);
            };

            sketch.draw = function () {
                sketch.background(0xFF);
                update();
                render();
            };

            sketch.keyPressed = function () {
                console.log(sketch.keyCode);
            };
        };

        const p5Instance = new p5(rootContext, document.getElementById("p5"));

        return {
            p5Instance
        }
    });