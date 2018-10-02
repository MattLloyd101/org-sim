define(["app/utils/Random",
        "app/utils/EventBus",
        "app/renderable/Person",
        "app/tiles/restrictions/EdgeRestriction",
        "app/tiles/restrictions/FeatureRestriction"],
    function (Random,
              EventBus,
              Person,
              EdgeRestriction,
              FeatureRestriction) {

        const edges = ['up', 'down', 'left', 'right'];
        const edgeTypes = ['R', 'C', 'G'];

        const constructor = function (context, colour, map, workstation) {

            const role = "DEV";
            const person = Person.new.apply(context, [role, colour]);

            const This = {
                person,
                map,
                workstation,
                restrictions: [],
                currentFocus: null
            };

            This.askQuestion = function () {
                const potentialTiles = map.data[This.currentFocus];

                const tile = Random.select(potentialTiles);
                const isEdgeRestriction = Math.random() > 0.5;

                let question;
                if (isEdgeRestriction) {
                    const edge = Random.select(edges);
                    const type = Random.select(edgeTypes);
                    question = EdgeRestriction.new(This.currentFocus, edge, type);
                } else {
                    const feature = Random.select(tile.features);
                    question = FeatureRestriction.new(This.currentFocus, feature);
                }

                EventBus.emitEvent("QUESTION", This, question);
            };

            This.answerQuestion = function (question) {
                const relevantKnowledge = This.restrictions.filter(function (restriction) {
                    return restriction.off === question.off &&
                        restriction.restrictionType === question.restrictionType;
                });

                let answer = null;
                if (question.restrictionType === "FEATURE") {
                    answer = relevantKnowledge.find(function (restriction) {
                        return restriction.feature === question.feature;
                    });
                } else if (question.restrictionType === "EDGE") {
                    answer = relevantKnowledge.find(function (restriction) {
                        return restriction.edge === question.edge &&
                            restriction.type === question.type;
                    });
                }

                if (answer != null) {
                    EventBus.emitEvent("ANSWER", This, {question, answer});
                }
            };

            return This;
        };

        return {
            new: constructor
        }
    });