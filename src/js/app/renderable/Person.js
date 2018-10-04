define(["app/utils/RenderObject",
        "app/renderable/Text",
        "app/utils/Random",
        "app/utils/EventBus",
        "app/utils/AStar",
        "app/renderable/items/TileGroup",
        "app/renderable/items/SpeechBubble"],
    function (RenderObject,
              Text,
              Random,
              EventBus,
              AStar,
              TileGroup,
              SpeechBubble) {

        const roleIdMap = {};

        const constructor = function (eventBus, role, colour, _speed) {

            const context = this;
            // may need some concept of team so we don't go to double digits for roles.
            const personId = roleIdMap[role] = roleIdMap[role] + 1 || 1;

            const personColour = this.color(colour, 0x50 + (personId * 3), 0xFF);
            const fontColour = this.color(colour, 0x88, 0x22);
            const radius = 20 + (Math.random() * 7);
            const width = radius * 2;
            //noinspection JSSuspiciousNameCombination
            const height = width;
            const depth = 100 + Math.random() * 25 + (Math.random() < 0.05 ? Math.random() * 25 : 0);

            const speed = _speed || Random.between(5, 7);
            const name = role + personId;

            const This = Object.assign(RenderObject.new(), {
                // We want to share the event bus with the controller so we override the inherited.
                eventBus,
                personId,
                name,
                role,
                width,
                height
            });

            const text = Text.new.apply(this, [name, fontColour, 16]);
            text.z = 1;
            text.y = (depth / 2) - 1;
            This.addChild(text);

            This.render = function () {
                this.noStroke();
                this.fill(personColour);
                this.rotateX(Math.PI / 2);
                this.translate(0, depth / 2, 0);
                this.cylinder(radius, depth);
            };

            This.moveUpdate = function (dt) {
                const dX = This.tX - This.x;
                const dY = This.tY - This.y;
                const dist = Math.sqrt(dX * dX + dY * dY);
                const angle = Math.atan2(dY, dX);
                // This is done regardless
                This.rotationZ = angle + (Math.PI / 2);

                if (dist < speed) {
                    This.x = This.tX;
                    This.y = This.tY;

                    delete This.isMoving;
                    delete This.tX;
                    delete This.tY;
                    This.eventBus.emitEvent("MOVE_COMPLETE");
                }

                const mX = speed * Math.cos(angle) * dt;
                const mY = speed * Math.sin(angle) * dt;
                This.x += mX;
                This.y += mY;
            };

            This.update = function (dt) {
                if (This.isMoving) {
                    This.moveUpdate(dt);
                }
            };

            This.walkPath = function (path, finalRotations, callback) {
                const {x, y} = path[0];

                This.eventBus.bindListener("MOVE_COMPLETE", function () {

                    This.eventBus.removeListener("MOVE_COMPLETE", arguments.callee);
                    if (path.length === 1) {
                        if (finalRotations) {
                            This.rotationX = finalRotations.rotationX;
                            This.rotationY = finalRotations.rotationY;
                            This.rotationZ = finalRotations.rotationZ;
                        }
                        This.eventBus.emitEvent("PATH_WALK_COMPLETE");
                        if (callback) callback();
                    } else {
                        This.walkPath(path.slice(1, path.length), finalRotations, callback);
                    }

                });

                This.moveTowards(x, y);
            };

            This.moveTowards = function (tX, tY) {
                This.tX = tX;
                This.tY = tY;
                This.isMoving = true;
            };

            This.enterRoom = function (room) {
                if (This.parent) This.parent.removeChild(This);
                room.addChild(This);
                This.x = room.entranceX;
                This.y = room.entranceY;

                // Total hack:
                const targetRoom = room.type === "CORRIDOR" ? room.parent : room;
                This.eventBus.emitEvent("ENTERED_ROOM", {room: targetRoom});
            };

            This.registerClickHandler(function () {
                This.eventBus.emitEvent("CLICKED_ON_PERSON");
            });

            This.showTileBubble = function (tiles, off, type, callback) {
                const questionTileFront = TileGroup.new.apply(context, [tiles, off, 50, 50]);
                const questionTileBack = TileGroup.new.apply(context, [tiles, off, 50, 50]);
                const bubble = SpeechBubble.new.apply(context, [50, 50, colour, type]);

                questionTileFront.z = 1;
                questionTileBack.z = -1;
                questionTileBack.rotationX = Math.PI;
                bubble.z = depth*1.5;
                bubble.addChild(questionTileFront);
                bubble.addChild(questionTileBack);

                This.addChild(bubble);

                setTimeout(function() {
                    This.removeChild(bubble);
                    callback();
                }, 500);
            };

            return This;
        };

        return {
            new: constructor
        }
    });