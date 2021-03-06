define([], function () {

    const constructor = function (off, feature, isRequirement) {

        const This = {
            type: "FEATURE",
            offset: off,
            feature,
            isRequirement
        };

        This.shouldKeepTile = function (tile) {
            const containsFeature = tile.features.indexOf(feature) !== -1;
            // if it's a requirement then we must keep this feature
            // otherwise it's a restriction so we must get rid of it
            return isRequirement ? containsFeature : !containsFeature;
        };

        This.restrict = function (tiles) {
            return tiles.filter(This.shouldKeepTile);
        };

        This.isEqual = function (other) {
            return This.restrictionType === other.restrictionType &&
                This.offset === other.offset &&
                This.feature === other.feature &&
                This.isRequirement === other.isRequirement;
        };

        return This;
    };

    return {
        new: constructor
    }
});