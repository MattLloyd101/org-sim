define(["app/utils/RenderObject",
        "app/utils/EventBus"],
    function (RenderObject,
              EventBus) {

        const constructor = function (colour) {


            const frameColour = this.color(colour, 0x88, 0xFF);
            const screenOffColour = this.color(colour, 0x33, 0x88);
            const screenOnColour = this.color(colour, 0x10, 0xFF);
            const standColour = this.color(colour, 0x33, 0x88);

            const frameWidth = 5;
            const screenWidth = 16 * frameWidth;
            const screenHeight = 9 * frameWidth;
            const standTopWidth = frameWidth * 2;
            const standBotWidth = frameWidth * 4;
            const standHeight = frameWidth * 2;
            const mid = frameWidth + screenWidth / 2;
            const screenAndFrameHeight = frameWidth * 2.5 + screenHeight;
            const width = frameWidth * 2 + screenWidth;
            const height = screenAndFrameHeight + standHeight;
            const on = false;

            const This = Object.assign(RenderObject.new(), {
                width,
                height,
                on
            });

            const renderScreen = function () {
                this.fill(frameColour);
                this.rect(0, 0, screenWidth + 2 * frameWidth, screenAndFrameHeight, frameWidth);
                this.fill(This.on ? screenOnColour : screenOffColour);
                this.translate(0, 0, 1);
                this.rect(frameWidth, frameWidth, screenWidth, screenHeight, frameWidth);
            };

            const renderStand = function () {
                this.fill(standColour);
                this.beginShape();
                this.vertex(mid - standTopWidth, screenAndFrameHeight);
                this.vertex(mid - standBotWidth, height);
                this.vertex(mid + standBotWidth, height);
                this.vertex(mid + standTopWidth, screenAndFrameHeight);
                this.endShape(this.CLOSE);
            };

            This.render = function () {
                this.rotateX(-Math.PI / 2);
                this.noStroke();
                renderScreen.apply(this);
                renderStand.apply(this);
            };

            EventBus.bindListener("TURN_ON_WORKSTATION", function(target, data) {
                if(data.workstation === This) {
                    this.on = true;
                }
            });

            EventBus.bindListener("TURN_OFF_WORKSTATION", function(target, data) {
                if(data.workstation === This) {
                    this.on = false;
                }
            });

            return This;
        };

        return {
            new: constructor
        }
    });