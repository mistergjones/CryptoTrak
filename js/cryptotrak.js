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
            "https://api.coincap.io/v2/assets/ethereum/history?interval=d1"
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

        var movingAverageDataPoints = calculateMovingAverage(dataPoints);

        // draw the actual chart
        ethereumChart(dataLabels, dataPoints, movingAverageDataPoints);

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

function ethereumChart(dataLabels, dataPoints, movingAverageDataPoints) {
    // chartjs seesm to ahve the data in an Object Format

    const data = {
        labels: dataLabels,
        datasets: [
            {
                label: "Ethereum Chart",
                backgroundColor: "rgb(255, 99, 132)",
                borderColor: "rgb(255, 99, 132)",
                // data: [7, 19, 15, 7, 11, 15, 2, 17, 13, 8, 12, 20, 30, 23],
                data: dataPoints,
            },
            {
                label: "5 day Moving Average",
                backgroundColor: "rgb(155, 99, 132)",
                borderColor: "black",

                // data: [7, 19, 15, 7, 11, 15, 2, 17, 13, 8, 12, 20, 30, 23],
                data: movingAverageDataPoints,
            },
        ],
    };

    // set the type of graph
    const config = {
        type: "line",
        data,
        options: {
            fill: { value: 0 },
        },
    };

    // put the chart in the CSS ID element
    var myChart = new Chart(document.getElementById("myChart2"), config);
}

function calculateMovingAverage(dataPoints) {
    const tempArray = [10, 20, 10, 20, 10, 20, 10, 20, 10, 20, 10, 20, 10];

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
