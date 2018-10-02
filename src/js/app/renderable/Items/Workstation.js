define(["app/utils/RenderObject",
        "app/utils/EventBus"],
    function (RenderObject,
              EventBus) {

        const constructor = function (colour, isPairing) {

            const frameColour = this.color(colour, 0x88, 0xFF);
            const screenOffColour = this.color(colour, 0x33, 0x88);
            const screenOnColour = this.color(colour, 0x10, 0xFF);
            const standColour = this.color(colour, 0x33, 0x88);

            const frameWidth = 5;
            const userDistance = 80;
            const screenWidth = 16 * frameWidth;
            const screenHeight = 9 * frameWidth;
            const standTopWidth = frameWidth * 2;
            const standBotWidth = frameWidth * 4;
            const standHeight = frameWidth * 2;
            const mid = 0;// frameWidth + screenWidth / 2;
            const screenAndFrameHeight = frameWidth * 2.5 + screenHeight;
            const width = frameWidth * 2 + screenWidth;
            const height = screenAndFrameHeight + standHeight;
            const on = false;
            const users = [];
            const userPositions = [];

            const This = Object.assign(RenderObject.new(), {
                width,
                height,
                on,
                users, userPositions
            });

            if(isPairing) {
                userPositions.push({x: - userDistance/3, y: userDistance});
                userPositions.push({x: + userDistance/3, y: userDistance});
            } else {
                userPositions.push({x: 0, y: userDistance});
            }

            const renderScreen = function () {
                this.fill(frameColour);
                this.rect(-((screenWidth/2) + frameWidth), -standHeight, (screenWidth + frameWidth*2), -screenAndFrameHeight);
                this.fill(This.on ? screenOnColour : screenOffColour);
                this.translate(0, 0, 1);
                this.rect(-(screenWidth/2), -height+frameWidth, screenWidth, screenHeight);
            };

            const renderStand = function () {
                this.fill(standColour);
                this.beginShape();
                this.vertex(mid - standTopWidth, -standHeight);
                this.vertex(mid - standBotWidth, 0);
                this.vertex(mid + standBotWidth, 0);
                this.vertex(mid + standTopWidth, -standHeight);
                this.endShape(this.CLOSE);
            };

            let n = 0;
            This.update = function() {
                n+=Math.PI/60;
            };

            This.render = function () {
                this.push();
                this.rotateX(-Math.PI / 2);
                this.noStroke();
                renderScreen.apply(this);
                renderStand.apply(this);
                this.pop();
                //
                // this.fill(standColour);
                // for(let i = 0; i < This.userPositions.length; i++) {
                //     const {x, y} = This.userPositions[i];
                //     this.ellipse(x, y, 50, 50);
                // }
            };

            This.registerClickHandler(function () {
                if(This.on)
                    This.turnOff();
                else
                    This.turnOn();
            });

            This.takeSeat = function (person, seat) {
                seat.isTaken = true;
                This.users.push(person);
            };

            This.findFreeSeat = function () {
                return userPositions.find(function (seat) {
                    return !seat.isTaken;
                });
            };

            This.turnOn = function () {
                This.on = true;
            };

            This.turnOff = function () {
                This.on = false;
            };

            This.hasSpace = function () {
                return isPairing ? This.users.length < 2 : This.users.length === 0;
            };

            EventBus.bindListener("TURN_ON_WORKSTATION", function(target, data) {
                if(data.workstation === This) {
                    This.turnOn();
                }
            });

            EventBus.bindListener("TURN_OFF_WORKSTATION", function(target, data) {
                if(data.workstation === This) {
                    This.turnOff();
                }
            });

            return This;
        };

        return {
            new: constructor
        }
    });