define(["p5",
        "app/config/p5-config",
        "app/utils/RenderObject",
        "app/renderable/Person",
        "app/renderable/rooms/DevelopmentRoom",
        "app/utils/EventBus"],

    function (p5,
              config,
              RenderObject,
              Person,
              DevelopmentRoom,
              EventBus) {

        const width = config.width;
        const height = config.height;
        const timestep = 1;

        let root;

        const createScene = function (root, context) {
            const teamColour = 0xFF;

            const room = DevelopmentRoom.new.apply(context, [2, teamColour]);

            room.x = room.y = 350;

            root.addChild(room);

            const person = Person.new.apply(context, ["DEV", teamColour]);

            person.x = person.y = 100;

            setTimeout(function () {
                person.enterRoom(room);
            }, 0);
        };

        let font;
        const preload = function (context) {
            font = context.loadFont('fonts/OpenSans-light.otf');
        };

        const setup = function (context) {
            const renderer = context.WEBGL; //context.P2D; //
            context.createCanvas(width, height, renderer);
            context.ortho(-width / 2, width / 2, -height / 2, height / 2, 0, 2000);
            context.smooth(4);
            context.colorMode(context.HSB, 0xFF);
            context.textFont(font);
            context.ambientLight(100);
            context.pointLight(250, 250, 250, 100, 100, 0);
            context.ambientMaterial(250);

            RenderObject.setRootContext(context);
            root = RenderObject.new();

            if (renderer === context.WEBGL) {
                root.x = -config.width / 2;
                root.y = -config.height / 2;
                // root.z = 500;
            }

            root.rotationX = Math.PI / 4;
            root.rotationZ = Math.PI / 8;

            createScene(root, context);
        };

        const update = function () {
            root.updateAll(timestep);
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
        };

        const p5Instance = new p5(rootContext, document.getElementById("p5"));

        return {
            p5Instance
        }
    });