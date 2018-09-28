define(["app/utils/RenderObject",
        "app/renderable/Text",
        "app/utils/Random",
        "app/utils/EventBus",
        "app/utils/AStar"],
    function (RenderObject,
              Text,
              Random,
              EventBus,
              AStar) {

        const roleIdMap = {};

        const constructor = function (role, colour, _speed) {

            // may need some concept of team so we don't go to double digits for roles.
            const personId = roleIdMap[role] = roleIdMap[role] + 1 || 1;

            const personColour = this.color(colour, 0x88, 0xFF);
            const fontColour = this.color(colour, 0x88, 0x22);
            const radius = 25;
            const width = radius * 2;
            //noinspection JSSuspiciousNameCombination
            const height = width;
            const depth = 80;

            const speed = _speed || Random.between(3, 5);

            const This = Object.assign(RenderObject.new(), {
                personId,
                role,
                width,
                height
            });

            const text = Text.new.apply(this, [role + personId, fontColour, 16]);
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

                if (dist < speed) {
                    This.x = This.tX;
                    This.y = This.tY;
                    delete This.isMoving;
                    delete This.tX;
                    delete This.tY;
                    EventBus.emitEvent("MOVE_COMPLETE", This);
                }

                const angle = Math.atan2(dY, dX);

                This.x += speed * Math.cos(angle) * dt;
                This.y += speed * Math.sin(angle) * dt;
                This.rotationZ = angle + (Math.PI / 2);
            };

            This.update = function (dt) {
                if (This.isMoving) {
                    This.moveUpdate(dt);
                }
            };

            This.walkPath = function(path) {
                const {x, y} = path[0];

                EventBus.bindListener("MOVE_COMPLETE", function (src) {
                    if (src === This) {
                        EventBus.removeListener("MOVE_COMPLETE", arguments.callee);
                        if(path.length === 1) {
                            EventBus.emitEvent("PATH_WALK_COMPLETE", This);
                        } else {
                            This.walkPath(path.slice(1, path.length));
                        }
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

                EventBus.emitEvent("ENTERED_ROOM", This, {room: room});
            };

            This.findWorkstation = function (room) {
                const map = room.pathMap.calculatedMap;
                const mapKeys = Object.keys(map);
                const randomKey = mapKeys[Math.floor(mapKeys.length * Math.random())];
                const randomSpot = map[randomKey];

                const path = AStar.pathBetween(map, room.pathMap.entrancePoint, randomSpot);

                const initial = {x: This.x, y: This.y};
                path.unshift(initial);
                
                room.pathMap.path = path;
                This.walkPath(path);
            };

            EventBus.bindListener("ENTERED_ROOM", function (src, data) {
                if (src === This) {
                    const room = data.room;
                    if (room.type === "DEVELOPMENT") {
                        This.findWorkstation(room);
                    }
                }
            });

            return This;
        };

        return {
            new: constructor
        }
    });