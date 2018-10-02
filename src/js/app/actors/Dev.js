define(["app/utils/Random",
        "app/utils/EventBus",
        "app/renderable/Person"],
    function (Random,
              EventBus,
              Person) {

        const constructor = function (context, colour, map, workstation) {

            const role = "DEV";
            const person = Person.new.apply(context, [role, colour]);

            const This = {
                person,
                map,
                currentTask,
                workstation
            };

            const actions = [
                "TRAVELLING",
                "IDLING",
                "DEVELOPING",
                "MEETING",
                "BUSINESS_ANALYSIS"
            ];

            EventBus.bindListener("ENTERED_ROOM", function (src, data) {
                if (src === person) {
                    const room = data.room;
                    This.room = room;
                    if (room.type === "DEVELOPMENT") {
                        room.findWorkstation(person);
                    } else if (room.type === "MEETING") {
                        room.sitAtTable(person);
                    } else if (room.type === "OFFICE") {
                        room.sitAtDesk(person);
                    } else if (room.type === "ROOM_SET") {
                        room.travelTo(person, "DEVELOPMENT");
                    }
                }
            });

            return This;
        };

        return {
            new: constructor
        }
    });