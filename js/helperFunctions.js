function calculateIncrementalAverageGainsLosses(
    startingPosition,
    allGains,
    theDataArray,
    smoothingEffect
) {
    for (var i = startingPosition; i < allGains.length; i++) {
        theDataArray.push(
            (theDataArray[i - startingPosition] * smoothingEffect +
                allGains[i]) /
                movingAverageDays
        );
    }
    return theDataArray;
}
