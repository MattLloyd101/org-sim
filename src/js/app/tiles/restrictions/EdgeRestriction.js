define([], function () {

    const constructor = function (off, edge, type, isRequirement) {

        const This = {
            restrictionType: "EDGE",
            off,
            edge,
            type,
            isRequirement
        };

        This.shouldKeepTile = function (tile) {
            const edgeMatches = tile[edge] === type;
            // if it's a requirement then we must keep this tile
            // otherwise it's a restriction so we must get rid of it
            return isRequirement ? edgeMatches : !edgeMatches;
        };

        This.restrict = function (tiles) {
            return tiles.filter(This.shouldKeepTile);
        };

        return This;
    };

    return {
        new: constructor
    }
});