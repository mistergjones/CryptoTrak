console.log("Welcome to CryptoTrak");

var basicPrice = 4.95;
var monthlyPrice = 6.95;

function togglePlan() {
    // get the relevant elements by id
    // check to see if the chexbox is active
    //based on which one is active, update the prices. Reduce by 20% if yearly.
    var checkBox = document.getElementById("switcher");
    var planPrice = document.getElementsByClassName("price");

    if (checkBox.checked == true) {
        for (var i = 0; i < planPrice.length; i++) {
            // remove the $ sign and take everything else to the right of it
            tempNumber = Number(planPrice[i].innerText) * 0.8;
            // round it to 2 deciams
            var tempNumber = roundToTwo(tempNumber);
            planPrice[i].innerText = tempNumber;
        }
    } else {
        for (var i = 0; i < planPrice.length; i++) {
            planPrice[0].innerText = 4.95;
            planPrice[1].innerText = 6.95;
        }
    }
}

function roundToTwo(num) {
    return +(Math.round(num + "e+2") + "e-2");
}
// obtain basic bitcoin data
async function getBitcoin() {
    // obtain 1 months data of bitcoin
    try {
        const historicalBitcoinData = await axios.get(
            "https://api.coincap.io/v2/assets/bitcoin/history?interval=d1&start=1577797200000&end=1623527003000"
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
        options: {
            pointRadius: 0,
        },
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
            "https://api.coincap.io/v2/assets/bitcoin/history?interval=d1&start=1577797200000&end=1623527003000"
        );

        // extract the data out in a format data array format chart.js requires. Destructure the returned dataObject
        var { dataPoints, dataLabels } = massageData(
            historicalBitcoinData.data.data
        );

        // now do the RSI component
        var rsiData = RSI(dataPoints);

        // draw the actual chart. Also need to supply the RSI data
        // bitcoinChart(dataLabels, dataPoints, "myChart3");
        bitcoinChart(dataLabels, rsiData, "myChart3");

        // now plot the actual chart
    } catch (error) {
        console.log("The errors is: ", error);
    }
}

// the below function is called by getBitcoinRSI() to calculate the actual RSI information and return the data set
function RSI(tempData) {
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

    // 1.0 aggregate the only first 14 day aggregate of allGains & allLosses.
    // This becomes the first number in the 15th position to base the rest of our calculations on.
    var eachDaysAverageGain = [];
    var eachDaysAverageLoss = [];

    // obtain just the first 14 day average gains/losses as a starting point.
    eachDaysAverageGain = calculateFirst14DayAverage(
        movingAverageDays,
        allGains
    );
    eachDaysAverageLoss = calculateFirst14DayAverage(
        movingAverageDays,
        allLosses
    );

    // console.log(allGains);
    // console.log(allLosses);

    // Now calculat the remainder of all gains/losses.
    // Given that we are doing a 14 day moving average, we take now to calculate the 15th index position (16th row position) and onwards RSI....
    // 2. Take the previous days AVG gain and multiply that by 13. Then ADD today's GAIN and dividing by the moving average (i.e 14)
    var startingPosition = movingAverageDays + 1;
    var smoothingEffect = movingAverageDays - 1; // This is to ensure we apply a smooth effect

    eachDaysAverageGain = calculateIncrementalAverageGainsLosses(
        startingPosition,
        allGains,
        eachDaysAverageGain,
        smoothingEffect,
        movingAverageDays
    );

    eachDaysAverageLoss = calculateIncrementalAverageGainsLosses(
        startingPosition,
        allLosses,
        eachDaysAverageLoss,
        smoothingEffect,
        movingAverageDays
    );

    // console.log("Each Days Average Gain", eachDaysAverageGain);
    // console.log("Each Days Average Loss", eachDaysAverageLoss);

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

function calculateFirst14DayAverage(movingAverageDays, theDataArray) {
    var tempArray = [];
    var runningTotal = 0;
    for (i = 0; i < movingAverageDays; i++) {
        runningTotal = runningTotal + theDataArray[i];
    }

    tempArray.push(runningTotal / movingAverageDays);

    return tempArray;
}

function calculateIncrementalAverageGainsLosses(
    startingPosition,
    allGains,
    theDataArray,
    smoothingEffect,
    movingAverageDays
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

async function getEthereumCandle() {
    try {
        const rawCandleData = await axios.get(
            "https://api.coincap.io/v2/candles?exchange=poloniex&interval=h8&baseId=ethereum&quoteId=bitcoin\n"
        );

        var finalisedDataset = massageCandleData(rawCandleData);
    } catch (error) {
        console.log("The error is:", error);
    }
}

// anyChart.js seems to have the CANDLESTICK chart data as an "array of arrays"
function massageCandleData(rawCandleData) {
    // obtain the display:none CSS setting for this #container
    var makeChartShow = document.getElementById("anychartJS-container");
    // makeChartShow.style.visibility = "visible";
    makeChartShow.style.width = "100%";
    makeChartShow.style.height = "416px";

    // just get the data from the rawCandleData object.
    var tempData = rawCandleData.data.data;

    var candleData = [];

    // for each bit of data, need to obtain in the following order:
    // 1. Date, Open, High, Low Close
    var tempCandleArray = [];
    for (var i = 0; i < tempData.length; i++) {
        tempCandleArray = [];

        // need to convert each 'period' in milleseconds to a shortened date
        tempDate = tempData[i].period;
        var shortenedDate = new Date(tempDate);
        shortenedDate = shortenedDate
            .toISOString(shortenedDate)
            .substring(0, 10);

        // push all ruquired fields into an array
        tempCandleArray.push(shortenedDate);
        tempCandleArray.push(tempData[i].open);
        tempCandleArray.push(tempData[i].high);
        tempCandleArray.push(tempData[i].low);
        tempCandleArray.push(tempData[i].close);

        // push each array into the master array
        candleData.push(tempCandleArray);
    }

    // create a chart
    chart = anychart.candlestick();

    // create an OHLC series and set the data
    var series = chart.candlestick(candleData);

    chart.title("8 hr Ethereum/Bitcoin CandleStick");

    // set the container id
    chart.container("anychartJS-container");

    // initiate drawing the chart
    chart.draw();

    // // set the chart type
    // var chart = anychart.stock();
    // // set the series
    // var series = chart.plot(0).candlestick(mapping);
    // series.name("EUR USD Trade Data");
    // // set the chart title
    // chart.title("EUR USD Historical Trade Data");
    // // set the container id
    // chart.container("container");
    // // draw the chart
    // chart.draw();
    // // create am EMA plot
    // var plot = chart.plot(0);
    // // create an EMA indicator with period 20
    // var ema20 = plot.ema(mapping, 20).series();
    // // set the EMA color
    // ema20.stroke("#bf360c");
    // // create am EMA plot
    // var plot = chart.plot(0);
    // // create an EMA indicator with period 5
    // var ema5 = plot.ema(mapping, 5).series();
    // // set the EMA color
    // ema5.stroke("blue");
}
