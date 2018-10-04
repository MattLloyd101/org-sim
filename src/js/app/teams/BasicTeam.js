define(["app/utils/Random",
        "app/utils/EventBus",
        "app/tiles/Map",
        "app/renderable/Person",
        "app/renderable/rooms/DevelopmentRoom",
        "app/renderable/rooms/MeetingRoom",
        "app/renderable/rooms/Office",
        "app/renderable/rooms/RoomSet",
        "app/renderable/rooms/MapRoom",
        "app/actors/BA",
        "app/actors/Dev",
        "app/actors/PO",
        "app/actors/TL"],
    function (Random,
              EventBus,
              Map,
              Person,
              DevelopmentRoom,
              MeetingRoom,
              Office,
              RoomSet,
              MapRoom,
              BA,
              Dev,
              PO,
              TL) {

        const constructor = function (context, root, tileset) {

            const This = {
                devs: [],
                bas: [],
                pos: [],
                tls: []
            };

            const teamColour = 0xFF * Math.random();
            const BACount = 0;
            const devCount = 4;
            const POCount = 0;
            const TLCount = 0;
            const peopleCount = POCount + devCount + BACount + TLCount;

            This.teamEventBus = EventBus.new();

            let map = This.map = Map.new(tileset, 7, 7);
            map.decideEdges();
            This.map = map = map.edgeOnlyPartial(1, true);

            const devRoom = DevelopmentRoom.new.apply(context, [Math.ceil(peopleCount / 2), true, "BOTTOM", teamColour]);
            const meetingRoom = MeetingRoom.new.apply(context, [peopleCount, "TOP", teamColour]);
            const mapRoom = MapRoom.new.apply(context, [This.teamEventBus, map, "BOTTOM", teamColour]);
            const roomSet = RoomSet.new.apply(context, [[devRoom, meetingRoom, mapRoom], teamColour]);

            for (let i = 0; i < devCount; i++) {
                const dev = Dev.new(context, This.teamEventBus, teamColour, map.edgeOnlyPartial(Math.random(), true));
                dev.person.enterRoom(roomSet.corridor);
                This.devs.push(dev);
            }

            for (let i = 0; i < BACount; i++) {
                const ba = BA.new(context, This.teamEventBus, teamColour, map.edgeOnlyPartial(Math.random()));
                ba.person.enterRoom(roomSet.corridor);
                This.bas.push(ba);
            }

            for (let i = 0; i < POCount; i++) {
                const featureTile = Random.select(tileset.featuredTiles());
                const po = PO.new(context, This.teamEventBus, teamColour, map.addKeyFeature(3, 3, featureTile, .25));
                po.person.enterRoom(roomSet.corridor);
                This.pos.push(po);
            }

            for (let i = 0; i < TLCount; i++) {
                const tl = TL.new(context, This.teamEventBus, teamColour, map.edgeOnlyPartial(1));
                tl.person.enterRoom(roomSet.corridor);
                This.tls.push(tl);
            }

            root.addChild(roomSet);

            return This;
        };

        return {
            new: constructor
        }
    });