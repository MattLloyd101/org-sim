define(["app/utils/Random",
        "app/utils/EventBus",
        "app/actors/BaseActor"],
    function (Random,
              EventBus,
              BaseActor) {

        const constructor = function (context, teamEventBus, colour, map, workstation) {

            const This = Object.assign(BaseActor.new(context, teamEventBus, "DEV", colour, map, workstation), {

            });

            return This;
        };

        return {
            new: constructor
        }
    });