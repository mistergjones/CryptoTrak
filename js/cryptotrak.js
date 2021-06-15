console.log("Welcome to CryptoTrak");

// obtain basic bitcoin data
async function getBitcoin() {
    // obtain 1 months data of bitcoin
    try {
        const historicalBitcoinData = await axios.get(
            "https://api.coincap.io/v2/assets/bitcoin/history?interval=d1&start=1577797200000&end=1580475600000"
        );

        // extract the data out in a format data array format chart.js requires. Destructure the returned dataObject
        var { dataPoints, dataLabels } = massageData(
            historicalBitcoinData.data.data
        );

        // draw the actual chart
        bitcoinChart(dataLabels, dataPoints, "myChart1");

        // now plot the actual chart
    } catch (error) {
        console.log("The errors is: ", error);
    }
}

async function getBollingerEthereum() {
    // obtain data of ethereum
    //
    try {
        const historicalEthereumData = await axios.get(
            "https://api.coincap.io/v2/assets/ethereum/history?interval=d1&start=1618247554000&end=1623517954000"
        );

        // extract the data out in a format data array format chart.js requires. Destructure the returned dataObject
        var { dataPoints, dataLabels } = massageData(
            historicalEthereumData.data.data
        );

        // extract the data out in a format data array format chart.js requires. Destructure the returned dataObject
        var { dataPoints, dataLabels } = massageData(
            historicalEthereumData.data.data
        );

        // with the dataPoints, need to calculate a rolling 5 day average
        //var movingAverageDataPoints = calculateMovingAverage(dataPoints);

        // var movingAverageDataPoints = ma(dataPoints);
        var {
            theMeanOfEach5DayBlock,
            upper_bollinger_band,
            lower_bollinger_band,
        } = calculateMovingAverage(dataPoints);

        // draw the actual chart
        ethereumChart(
            dataLabels,
            dataPoints,
            theMeanOfEach5DayBlock,
            upper_bollinger_band,
            lower_bollinger_band
        );

        // now plot the actual chart
    } catch (error) {
        console.log("The errors is: ", error);
    }
}

// this function obtins the label points and returns an object with 2 arrays. (dates and prices)
function massageData(cryptoDataObject) {
    // declare two arrays
    var dataLabels = [];
    var dataPoints = [];

    // loop through the data object and obtain the required information
    for (i = 0; i < cryptoDataObject.length; i++) {
        dataPoints.push(cryptoDataObject[i].priceUsd);
        dataLabels.push(cryptoDataObject[i].date.substring(0, 10));
    }

    // now return the 2 arrays in a single object
    return {
        dataPoints: dataPoints,
        dataLabels: dataLabels,
    };
}

function bitcoinChart(dataLabels, dataPoints, myChart) {
    // chartjs seesm to ahve the data in an Object Format
    const data = {
        labels: dataLabels,
        datasets: [
            {
                label: "Bitcoin Chart",
                backgroundColor: "rgb(255, 99, 132)",
                borderColor: "rgb(255, 99, 132)",
                // data: [7, 19, 15, 7, 11, 15, 2, 17, 13, 8, 12, 20, 30, 23],
                data: dataPoints,
            },
        ],
    };

    // set the type of graph
    const config = {
        type: "line",
        data,
        options: {},
    };

    // put the chart in the CSS ID element
    // var myChart = new Chart(document.getElementById("myChart1"), config);
    var myChart = new Chart(document.getElementById(myChart), config);
}

function ethereumChart(
    dataLabels,
    dataPoints,
    movingAverageDataPoints,
    upper_bollinger_band,
    lower_bollinger_band
) {
    // chartjs seesm to ahve the data in an Object Format

    const data = {
        labels: dataLabels,
        datasets: [
            {
                label: "Ethereum Daily Prices",
                backgroundColor: "black",
                borderColor: "black",
                // data: [7, 19, 15, 7, 11, 15, 2, 17, 13, 8, 12, 20, 30, 23],
                data: dataPoints,
                // borderWidth: 5,
            },
            {
                label: "5 day Moving Average",
                backgroundColor: "darkgray",
                borderColor: "darkgray",

                // data: [7, 19, 15, 7, 11, 15, 2, 17, 13, 8, 12, 20, 30, 23],
                data: movingAverageDataPoints,
                borderWidth: 1,
                borderDash: [10, 5],
            },
            {
                label: "Upper Bollinger",
                backgroundColor: "blue",
                borderColor: "blue",

                // data: [7, 19, 15, 7, 11, 15, 2, 17, 13, 8, 12, 20, 30, 23],
                data: upper_bollinger_band,
                borderDash: [10, 5],
            },
            {
                label: "Lower Bollinger",
                backgroundColor: "brown",
                borderColor: "brown",

                // data: [7, 19, 15, 7, 11, 15, 2, 17, 13, 8, 12, 20, 30, 23],
                data: lower_bollinger_band,
                borderDash: [10, 5],
            },
        ],
    };

    // set the type of graph
    const config = {
        type: "line",
        data,
        options: {
            // fill: { value: 0 },
            pointRadius: 0,
            tension: 0.5,
            lineThickness: 5,
            responsive: true,
            maintainAspectRatio: true,
        },
    };

    // put the chart in the CSS ID element
    var myChart = new Chart(document.getElementById("myChart2"), config);
}

function calculateMovingAverage(dataPoints) {
    // convert the string elements of the dataPoints to floats
    dataPoints = dataPoints.map(Number);

    // declare variables
    var numberOfMovingAverageDays = 5;
    var theMeanOfEach5DayBlock = [];

    var loopIterator = 0;
    // 1.0 calcule the mean of each 5 day block and append it to an array
    // while condition determines how many blocks of days in the array to calculate from
    while (loopIterator <= dataPoints.length - numberOfMovingAverageDays) {
        // reset the running total to zero after each j loop
        var running_total = 0;
        for (j = loopIterator; j < 5 + loopIterator; j++) {
            running_total = running_total + dataPoints[j];
        }
        // push the calculated moving average into the array
        theMeanOfEach5DayBlock.push(running_total / numberOfMovingAverageDays);
        // var running_total = 0;
        loopIterator++;
    }

    // 2.0 Subtract the mean from each block's numbers and square the result
    // Calculate the Standard Deviation
    var dataObjects = calculateStandardDeviation(
        theMeanOfEach5DayBlock,
        dataPoints,
        numberOfMovingAverageDays
    );

    return dataObjects;
}

function calculateStandardDeviation(
    theMeanOfEach5DayBlock,
    dataPoints,
    numberOfMovingAverageDays
) {
    var gj = [];
    i = 0;
    var bollinger_band = [];

    while (i < theMeanOfEach5DayBlock.length) {
        // console.log(dataPoints[i]);
        var difference = 0;
        var running_squared_total = 0;
        for (j = i; j < 5 + i; j++) {
            // calculate the difference from the mean in each block
            difference = dataPoints[j] - theMeanOfEach5DayBlock[i];
            // square the difference
            var gj = difference ** 2;
            // aggregate the total of squard difference
            running_squared_total = running_squared_total + gj;
        }
        // console.log(
        //     `The SD on each group of 5 is: `,
        //     Math.sqrt(running_squared_total / numberOfMovingAverageDays)
        // );
        // now need to return 2 * SDs for the Upper and Lower Bollinger Bands
        bollinger_band.push(
            Math.sqrt(running_squared_total / numberOfMovingAverageDays) * 2
        );
        i++;
    }

    // insert the number of nulls at the start to cater for the moving average days. You need to have NULLS
    bollinger_band = insertMovingAverageNulls(
        bollinger_band,
        numberOfMovingAverageDays
    );
    theMeanOfEach5DayBlock = insertMovingAverageNulls(
        theMeanOfEach5DayBlock,
        numberOfMovingAverageDays
    );

    var upper_bollinger_band = [];
    var lower_bollinger_band = [];
    // now need to claculate the upper and lower bollinger bands based on "Bollinger band Standard Deviation" on the Moving Average
    // from the end most element in the first 5 day block....
    for (
        var loopIterator = numberOfMovingAverageDays - 1;
        loopIterator < theMeanOfEach5DayBlock.length;
        loopIterator++
    ) {
        upper_bollinger_band.push(
            theMeanOfEach5DayBlock[loopIterator] + bollinger_band[loopIterator]
        );
        lower_bollinger_band.push(
            theMeanOfEach5DayBlock[loopIterator] - bollinger_band[loopIterator]
        );
    }

    // insert the number of nulls at the start to cater for the moving average days. You need to have NULLS
    upper_bollinger_band = insertMovingAverageNulls(
        upper_bollinger_band,
        numberOfMovingAverageDays
    );
    lower_bollinger_band = insertMovingAverageNulls(
        lower_bollinger_band,
        numberOfMovingAverageDays
    );

    return {
        theMeanOfEach5DayBlock: theMeanOfEach5DayBlock,
        upper_bollinger_band: upper_bollinger_band,
        lower_bollinger_band: lower_bollinger_band,
    };
}

// this function inserts nulls at the start of the array to cater for the 5 day moving average
// it is also done to ensure chartjs DOES NOT plot NULLs
function insertMovingAverageNulls(dataPoints, numberOfMovingAverageDays) {
    for (i = 1; i < numberOfMovingAverageDays; i++) {
        dataPoints.unshift(null);
    }

    return dataPoints;
}

/* Calculate the RSI for Bitcoin */
async function getBitcoinRSI() {
    try {
        const historicalBitcoinData = await axios.get(
            "https://api.coincap.io/v2/assets/bitcoin/history?interval=d1&start=1577797200000&end=1580475600000"
        );

        // extract the data out in a format data array format chart.js requires. Destructure the returned dataObject
        var { dataPoints, dataLabels } = massageData(
            historicalBitcoinData.data.data
        );

        // now do the RSI component
        var rsiData = RSI();

        // draw the actual chart. Also need to supply the RSI data
        // bitcoinChart(dataLabels, dataPoints, "myChart3");
        bitcoinChart(dataLabels, rsiData, "myChart3");

        // now plot the actual chart
    } catch (error) {
        console.log("The errors is: ", error);
    }
}

function RSI() {
    var tempData = [
        44.3389,
        44.0902,
        44.1497,
        43.6124,
        44.3278,
        44.8264,
        45.0955,
        45.4245,
        45.8433,
        46.0826,
        45.8931,
        46.0328,
        45.614,
        46.282,
        46.282,
        46.0028,
        46.0328,
        46.4116,
        46.2222,
        45.6439,
        46.2122,
        46.2521,
        45.7137,
        46.4515,
        45.7835,
        45.3548,
        44.0288,
        44.1783,
        44.2181,
        44.5672,
        43.4205,
        42.6628,
        43.1314,
    ];

    var movingAverageDays = 14;
    // calculate the allDailyChanges on each day.

    var allDailyChanges = [];
    // the below is required to establish 0 on the first day
    allDailyChanges.push(0);

    // Start from position 1 as as we
    for (var i = 1; i < tempData.length; i++) {
        // console.log(tempData[i] - tempData[i - 1]);
        allDailyChanges.push(tempData[i] - tempData[i - 1]);
    }
    // console.log("The chage array is:", allDailyChanges);

    // calculate the allGains & allLosses for each day
    var allGains = [];
    var allLosses = [];
    // allGains FIRST
    for (i = 0; i < tempData.length; i++) {
        if (allDailyChanges[i] > 0) {
            allGains.push(allDailyChanges[i]);
        } else {
            allGains.push(0);
        }
    }
    // allLosses SECOND
    for (i = 0; i < tempData.length; i++) {
        if (allDailyChanges[i] < 0) {
            allLosses.push(allDailyChanges[i]);
        } else {
            allLosses.push(0);
        }
    }

    // console.log("allGains are: ", allGains);
    // console.log("allLosses are: ", allLosses);

    // 1.0 aggregate the only first 14 day aggregate of allGains & allLosses.
    // This becomes the first number in the 15th position to base the rest of our calculations on.
    var runningTotal = 0;

    var eachDaysAverageGain = [];
    var eachDaysAverageLoss = [];

    for (i = 0; i < movingAverageDays; i++) {
        runningTotal = runningTotal + allGains[i];
    }
    eachDaysAverageGain.push(runningTotal / movingAverageDays);
    runningTotal = 0;

    for (i = 0; i < movingAverageDays; i++) {
        runningTotal = runningTotal + allLosses[i];
    }
    eachDaysAverageLoss.push(runningTotal / movingAverageDays);
    runningTotal = 0;

    console.log(allGains);
    console.log(allLosses);

    // Given that we are doing a 14 day moving average, we take now to calculate the 15th index position (16th row position) and onwards RSI....
    // 2. Take the previous days AVG gain and multiply that by 13. Then ADD today's GAIN and diving by the moving average (i.e 14)

    var startingPositionInAllGains = 15;
    var startingPositionInAllLosses = 15;
    var smoothingEffect = movingAverageDays - 1; // This is the 13
    for (var i = startingPositionInAllGains; i < allGains.length; i++) {
        eachDaysAverageGain.push(
            (eachDaysAverageGain[i - startingPositionInAllGains] *
                smoothingEffect +
                allGains[i]) /
                movingAverageDays
        );
    }

    for (var i = startingPositionInAllLosses; i < allLosses.length; i++) {
        eachDaysAverageLoss.push(
            (eachDaysAverageLoss[i - startingPositionInAllLosses] *
                smoothingEffect +
                allLosses[i]) /
                movingAverageDays
        );
    }

    console.log("Each Days Average Gain", eachDaysAverageGain);
    console.log("Each Days Average Loss", eachDaysAverageLoss);

    // eachDaysAverageGain.push(
    //     (eachDaysAverageGain[0] * 13 + allGains[15]) / movingAverageDays
    // );
    // eachDaysAverageGain.push(
    //     (eachDaysAverageGain[1] * 13 + allGains[16]) / movingAverageDays
    // );
    // eachDaysAverageGain.push(
    //     (eachDaysAverageGain[2] * 13 + allGains[17]) / movingAverageDays
    // );
    // eachDaysAverageGain.push(
    //     (eachDaysAverageGain[3] * 13 + allGains[18]) / movingAverageDays
    // );
    // eachDaysAverageGain.push(
    //     (eachDaysAverageGain[4] * 13 + allGains[19]) / movingAverageDays
    // );
    // eachDaysAverageGain.push(
    //     (eachDaysAverageGain[5] * 13 + allGains[20]) / movingAverageDays
    // );
    // eachDaysAverageGain.push(
    //     (eachDaysAverageGain[6] * 13 + allGains[21]) / movingAverageDays
    // );
    // eachDaysAverageGain.push(
    //     (eachDaysAverageGain[7] * 13 + allGains[22]) / movingAverageDays
    // );
    // eachDaysAverageGain.push(
    //     (eachDaysAverageGain[8] * 13 + allGains[23]) / movingAverageDays
    // );
    // eachDaysAverageGain.push(
    //     (eachDaysAverageGain[9] * 13 + allGains[24]) / movingAverageDays
    // );
    // eachDaysAverageGain.push(
    //     (eachDaysAverageGain[10] * 13 + allGains[25]) / movingAverageDays
    // );
    // eachDaysAverageGain.push(
    //     (eachDaysAverageGain[11] * 13 + allGains[26]) / movingAverageDays
    // );
    // eachDaysAverageGain.push(
    //     (eachDaysAverageGain[12] * 13 + allGains[27]) / movingAverageDays
    // );
    // eachDaysAverageGain.push(
    //     (eachDaysAverageGain[13] * 13 + allGains[28]) / movingAverageDays
    // );
    // eachDaysAverageGain.push(
    //     (eachDaysAverageGain[14] * 13 + allGains[29]) / movingAverageDays
    // );
    // eachDaysAverageGain.push(
    //     (eachDaysAverageGain[15] * 13 + allGains[30]) / movingAverageDays
    // );
    // eachDaysAverageGain.push(
    //     (eachDaysAverageGain[16] * 13 + allGains[31]) / movingAverageDays
    // );
    // eachDaysAverageGain.push(
    //     (eachDaysAverageGain[17] * 13 + allGains[32]) / movingAverageDays
    // );

    // // 1. Take the previous days AVG Loss (the 14th position AVG Gain) and multiply that
    // eachDaysAverageLoss.push(
    //     (eachDaysAverageLoss[0] * 13 + allLosses[15]) / movingAverageDays
    // );

    // eachDaysAverageLoss.push(
    //     (eachDaysAverageLoss[1] * 13 + allLosses[16]) / movingAverageDays
    // );
    // eachDaysAverageLoss.push(
    //     (eachDaysAverageLoss[2] * 13 + allLosses[17]) / movingAverageDays
    // );
    // eachDaysAverageLoss.push(
    //     (eachDaysAverageLoss[3] * 13 + allLosses[18]) / movingAverageDays
    // );
    // eachDaysAverageLoss.push(
    //     (eachDaysAverageLoss[4] * 13 + allLosses[19]) / movingAverageDays
    // );
    // eachDaysAverageLoss.push(
    //     (eachDaysAverageLoss[5] * 13 + allLosses[20]) / movingAverageDays
    // );
    // eachDaysAverageLoss.push(
    //     (eachDaysAverageLoss[6] * 13 + allLosses[21]) / movingAverageDays
    // );
    // eachDaysAverageLoss.push(
    //     (eachDaysAverageLoss[7] * 13 + allLosses[22]) / movingAverageDays
    // );
    // eachDaysAverageLoss.push(
    //     (eachDaysAverageLoss[8] * 13 + allLosses[23]) / movingAverageDays
    // );
    // eachDaysAverageLoss.push(
    //     (eachDaysAverageLoss[9] * 13 + allLosses[24]) / movingAverageDays
    // );
    // eachDaysAverageLoss.push(
    //     (eachDaysAverageLoss[10] * 13 + allLosses[25]) / movingAverageDays
    // );
    // eachDaysAverageLoss.push(
    //     (eachDaysAverageLoss[11] * 13 + allLosses[26]) / movingAverageDays
    // );
    // eachDaysAverageLoss.push(
    //     (eachDaysAverageLoss[12] * 13 + allLosses[27]) / movingAverageDays
    // );
    // eachDaysAverageLoss.push(
    //     (eachDaysAverageLoss[13] * 13 + allLosses[28]) / movingAverageDays
    // );
    // eachDaysAverageLoss.push(
    //     (eachDaysAverageLoss[14] * 13 + allLosses[29]) / movingAverageDays
    // );
    // eachDaysAverageLoss.push(
    //     (eachDaysAverageLoss[15] * 13 + allLosses[30]) / movingAverageDays
    // );
    // eachDaysAverageLoss.push(
    //     (eachDaysAverageLoss[16] * 13 + allLosses[31]) / movingAverageDays
    // );
    // eachDaysAverageLoss.push(
    //     (eachDaysAverageLoss[17] * 13 + allLosses[32]) / movingAverageDays
    // );

    // console.log(eachDaysAverageGain, eachDaysAverageLoss);

    // now calculate the RS factors and ensure POSITIVE NUMBERS FOR THE LOSSES
    var rs = [];
    for (i = 0; i < eachDaysAverageGain.length; i++) {
        rs.push((eachDaysAverageGain[i] / eachDaysAverageLoss[i]) * -1);
    }
    // console.log("The rs is: ", rs);

    var rsi = [];
    // now calculate the RSI
    for (i = 0; i < eachDaysAverageLoss.length; i++) {
        if (eachDaysAverageLoss[i] == 0) {
            rsi.push(100);
        } else {
            rsi.push(100 - 100 / (1 + rs[i]));
        }
    }

    // console.log("The rsi is:", rsi);

    // NEED TO PRE-FILL THE FINALISED ARRAY WITH NULLS SO THE ALIGNMENT WITH THE DATA WORKS
    for (var i = 0; i < movingAverageDays; i++) {
        rsi.unshift(null);
    }

    return rsi;
}
