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

        // TODO: These belong to Tileset.
        const edges = ['up', 'down', 'left', 'right'];
        const edgeTypes = ['R', 'C', 'G'];

        const constructor = function (context, teamEventBus, role, colour, map, workstation) {

            const This = {
                map,
                workstation,
                teamEventBus,
                eventBus: EventBus.new(),
                restrictions: map.allRestrictions(),
                minPairingTimer: 500,
                maxPairingTimer: 1000,
                pairingTimerUncertaintyBias: 500,
                pairingRandomness: 50
            };

            This.map.updateFromRestrictions(This.restrictions);
            teamEventBus.emitEvent("UPDATE_MAP");

            This.person = Person.new.apply(context, [This.eventBus, role, colour]);

            This.collaborate = function (collaborationEventBus, uncertainty, fn) {
                const timeout = This.minPairingTimer + (This.maxPairingTimer - This.minPairingTimer) * Math.random();
                This.collabTimer = setTimeout(function () {
                    collaborationEventBus.emitEvent("CLEAR_COLLAB_TIMER");
                    fn();
                }, timeout);
            };

            This.updateKnowledge = function (answers) {

                for (let i = 0; i < answers.length; i++) {
                    const answer = answers[i];
                    const overlaps = This.restrictions.some(function (restriction) {
                        return restriction.isEqual(answer);
                    });

                    if (!overlaps) {
                        This.restrictions.push(answer);
                    }
                }

                This.map.updateFromRestrictions(This.restrictions);
                teamEventBus.emitEvent("UPDATE_MAP");
            };

            This.askQuestion = function (collaborationEventBus) {
                const isForced = !!This.forceOffset;
                const offset = isForced ? This.forceOffset : This.map.findUnknownOffset();
                delete This.forceOffset;

                let potentialTiles = This.map.data[offset];

                if (potentialTiles.length === 0) {
                    potentialTiles = This.map.tileset.allTiles;
                }

                const tile = Random.select(potentialTiles);
                const isEdgeRestriction = Math.random() > 0.5;

                let question = {asker: This, offset};
                if (isEdgeRestriction) {
                    const edge = Random.select(edges);
                    const type = Random.select(edgeTypes);
                    question.restriction = EdgeRestriction.new(offset, edge, type);
                } else {
                    const feature = Random.select(tile.features);
                    question.restriction = FeatureRestriction.new(offset, feature);
                }

                This.person.showTileBubble(potentialTiles, offset, "QUESTION", function () {
                    collaborationEventBus.emitEvent("QUESTION", question);
                });
            };

            This.answerQuestion = function (question, offset, collaborationEventBus) {

                const answer = This.map.allRestrictionsFor(question.offset);

                const type = answer.length > 0 ? "ANSWER" : "UNKNOWN";

                This.person.showTileBubble(This.map.data[offset], offset, type, function () {
                    collaborationEventBus.emitEvent("ANSWER", {question, answer, src: This});
                });
            };

            This.clearCollabTimer = function () {
                if (This.collabTimer) {
                    clearTimeout(This.collabTimer);
                    delete This.collabTimer;
                }
            };

            This.eventBus.bindListener("BEGIN_COLLABORATION", function (data) {
                const {collaborationEventBus} = data;

                collaborationEventBus.bindListener("CLEAR_COLLAB_TIMER", This.clearCollabTimer);
                collaborationEventBus.bindListener("QUESTION", function (data) {
                    const {restriction, asker, offset} = data;

                    // if I'm not the asker and...
                    if (This !== asker) {
                        This.answerQuestion(restriction, offset, collaborationEventBus);
                    }
                });

                collaborationEventBus.bindListener("ANSWER", function (data) {
                    const {src, answer} = data;

                    // If I didn't give the answer...
                    if (This !== src) {
                        if (answer.length > 0) {
                            This.updateKnowledge(answer);
                        }
                    }
                    // regardless we all collaborate afterwards
                    This.collaborate(collaborationEventBus, This.map.uncertainty(), function () {
                        This.askQuestion(collaborationEventBus);
                    });
                });

                This.collaborate(collaborationEventBus, This.map.uncertainty(), function () {
                    This.askQuestion(collaborationEventBus);
                });
            });

            This.eventBus.bindListener("ARRIVED_AT_WORKSTATION", function (data) {
                const {workstation, canBeginWork} = data;

                workstation.turnOn();

                if (canBeginWork) {
                    const collaborationEventBus = EventBus.new();
                    workstation.users.map(function (user) {
                        user.eventBus.emitEvent("BEGIN_COLLABORATION", {collaborationEventBus});
                    });
                }
            });

            This.eventBus.bindListener("CLICKED_ON_PERSON", function () {
                This.teamEventBus.emitEvent("OVERRIDE_MAP", {map: This.map, text: This.person.name, owner: This});
            });

            This.eventBus.bindListener("ENTERED_ROOM", function (data) {
                const room = data.room;
                This.room = room;
                if (room.type === "DEVELOPMENT") {
                    room.findWorkstation(This.person);
                } else if (room.type === "MEETING") {
                    room.sitAtTable(This.person);
                } else if (room.type === "OFFICE") {
                    room.sitAtDesk(This.person);
                } else if (room.type === "ROOM_SET") {
                    room.travelTo(This.person, "DEVELOPMENT");
                }
            });

            This.eventBus.bindListener("FORCE_QUESTION", function (tile) {
                console.log("forcing Question", tile.index);
                This.forceOffset = tile.index;
            });

            return This;
        };

        return {
            new: constructor
        }
    });