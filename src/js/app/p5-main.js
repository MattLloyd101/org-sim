define(["p5",
        "app/config/p5-config",
        "app/utils/Keyboard",
        "app/tiles/Tileset",
        "app/utils/RenderObject",
        "app/renderable/Person",
        "app/renderable/RootContext",
        "app/teams/BasicTeam",
        "app/tiles/Map"
    ],

    function (p5,
              config,
              Keyboard,
              Tileset,
              RenderObject,
              Person,
              RootContext,
              BasicTeam,
              Map) {

        const width = window.innerWidth;
        const height = window.innerHeight * 0.85;
        const timestep = 1;

        let root;
        let clickBuffer;
        let font;
        let tileset;

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

            BasicTeam.new(context, root, tileset);
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
            const id = pixel[0] << 8 | pixel[1];

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