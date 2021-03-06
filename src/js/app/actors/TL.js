define(["app/utils/Random",
        "app/utils/EventBus",
        "app/actors/BaseActor",
        "app/tiles/restrictions/EdgeRestriction",
        "app/tiles/restrictions/FeatureRestriction"],
    function (Random,
              EventBus,
              BaseActor) {

        const constructor = function (context, teamEventBus, colour, map, workstation) {

            const This = Object.assign(BaseActor.new(context, teamEventBus, "TL", colour, map, workstation), {
                restrictions: [],
                currentFocus: null
            });

            return This;
        };

        return {
            new: constructor
        }
    });