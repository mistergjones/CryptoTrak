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
        bitcoinChart(dataLabels, dataPoints);

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
            "https://api.coincap.io/v2/assets/ethereum/history?interval=d1&start=1577797200000&end=1580475600000"
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
        var { theMeanOf5Days, upper_bollinger_band, lower_bollinger_band } = ma(
            dataPoints
        );

        // draw the actual chart
        ethereumChart(
            dataLabels,
            dataPoints,
            theMeanOf5Days,
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

function bitcoinChart(dataLabels, dataPoints) {
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
    var myChart = new Chart(document.getElementById("myChart1"), config);
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
        },
    };

    // put the chart in the CSS ID element
    var myChart = new Chart(document.getElementById("myChart2"), config);
}

function calculateMovingAverage(dataPoints) {
    const tempArray = [10, 13, 12, 11, 10, 14, 7, 11, 12, 9, 11, 8, 10];

    // conver the string elements of the dataPoints to floats
    dataPoints = dataPoints.map(Number);

    var movingAverage = 5;
    var arrOf5DayAverages = [];

    var i = 0;
    // while condition determines how many blocks of days in the array to calculate from
    while (i <= dataPoints.length - movingAverage) {
        // console.log(dataPoints[i]);
        var running_total = 0;
        for (j = i; j < 5 + i; j++) {
            running_total = running_total + dataPoints[j];
        }
        console.log(i, running_total, running_total / movingAverage);

        arrOf5DayAverages.push(running_total / movingAverage);
        var running_total = 0;
        i++;
    }
    console.log("ASDADSFA");
    console.log(arrOf5DayAverages);
    return arrOf5DayAverages;
}

function ma(dataPoints2) {
    const tempArray = [10, 13, 12, 11, 10, 14, 7, 11, 12, 9, 11, 8, 10];

    // conver the string elements of the dataPoints to floats
    dataPoints2 = dataPoints2.map(Number);

    var numberOfMovingAverageDays = 5;
    var theMeanOf5Days = [];

    var i = 0;
    // 1.0 calcule the mean of each 5 day block
    // while condition determines how many blocks of days in the array to calculate from
    while (i <= dataPoints2.length - numberOfMovingAverageDays) {
        // console.log(dataPoints2[i]);
        var running_total = 0;
        for (j = i; j < 5 + i; j++) {
            running_total = running_total + dataPoints2[j];
        }
        //console.log(i, running_total, running_total / numberOfMovingAverageDays);

        theMeanOf5Days.push(running_total / numberOfMovingAverageDays);
        var running_total = 0;
        i++;
    }
    //console.log("ASDADSFA");
    console.log(theMeanOf5Days);

    // 2.0 Subtract the mean from each block's numbers and square the result

    var gj = [];
    i = 0;
    var bollinger_band = [];

    while (i < theMeanOf5Days.length) {
        // console.log(dataPoints2[i]);
        var difference = 0;
        var running_squared_total = 0;
        for (j = i; j < 5 + i; j++) {
            // calculate the difference from the mean in each block
            difference = dataPoints2[j] - theMeanOf5Days[i];
            // square the difference
            var gj = difference ** 2;
            // aggregate the total of squard difference
            running_squared_total = running_squared_total + gj;
            // console.log(running_squared_total);
            // console.log(
            //     j,
            //     dataPoints2[j],
            //     theMeanOf5Days[i],
            //     difference,
            //     difference ** 2,
            //     running_squared_total,
            //     running_squared_total / numberOfMovingAverageDays,
            //     Math.sqrt(running_squared_total / numberOfMovingAverageDays)
            // );
        }
        console.log(
            `The SD on each group of 5 is: `,
            Math.sqrt(running_squared_total / numberOfMovingAverageDays)
        );
        // now need to return 2 * SDs for the Upper and Lower Bollinger Bands
        bollinger_band.push(
            Math.sqrt(running_squared_total / numberOfMovingAverageDays) * 2
        );
        i++;
    }

    // insert the number of zeroes at teh start to cater for the moving average days. You need to have zeros
    for (i = 1; i < numberOfMovingAverageDays; i++) {
        bollinger_band.unshift(null);
        theMeanOf5Days.unshift(null);
    }

    // now need to add the bollinger band SD to above and below the Moving Average
    var upper_bollinger_band = [];
    var lower_bollinger_band = [];
    for (i = numberOfMovingAverageDays - 1; i < theMeanOf5Days.length; i++) {
        upper_bollinger_band.push(theMeanOf5Days[i] + bollinger_band[i]);
        lower_bollinger_band.push(theMeanOf5Days[i] - bollinger_band[i]);
        // console.log(
        //     theMeanOf5Days[i],
        //     bollinger_band[i],
        //     theMeanOf5Days[i] + bollinger_band[i],
        //     theMeanOf5Days[i] - bollinger_band[i]
        // );
    }

    // insert the number of zeroes at teh start to cater for the moving average days. You need to have zeros
    for (i = 1; i < numberOfMovingAverageDays; i++) {
        upper_bollinger_band.unshift(null);
        lower_bollinger_band.unshift(null);
    }

    console.log(upper_bollinger_band, lower_bollinger_band);

    return {
        theMeanOf5Days: theMeanOf5Days,
        upper_bollinger_band: upper_bollinger_band,
        lower_bollinger_band: lower_bollinger_band,
    };
}
