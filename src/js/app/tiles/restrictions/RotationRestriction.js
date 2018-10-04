define([], function () {

    const constructor = function (off, rotation, isRequirement) {

        const This = {
            restrictionType: "ROTATION",
            offset: off,
            rotation,
            isRequirement
        };

        This.shouldKeepTile = function (tile) {
            const matches = tile.rotation === rotation;

            return isRequirement ? matches : !matches;
        };

        This.restrict = function (tiles) {
            return tiles.filter(This.shouldKeepTile);
        };

        This.isEqual = function (other) {
            return This.restrictionType === other.restrictionType &&
                This.offset === other.offset &&
                This.rotation === other.rotation &&
                This.isRequirement === other.isRequirement;
        };
        return This;
    };

    return {
        new: constructor
    }
});