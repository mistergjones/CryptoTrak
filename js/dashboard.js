let searchBox = document.getElementById("search-box");
let searchBtn = document.getElementById("search-button");
let searchResult = document.getElementById("search-result");
let searchTable = document.getElementById("search-result-table");
let marketCapital = document.getElementById("market-capital");
let totalSupply = document.getElementById("total-supply");
let clearButton = document.getElementById("clear-button");
let chart6 = document.getElementById("chart1");
let chart7 = document.getElementById("chart2");

var data;
clearButton.addEventListener("click", () => {
    searchBox.value = "";
});
searchBtn.addEventListener("click", async () => {
    let searchValue = searchBox.value;
    if (searchValue != "") {
        let url = "https://api.coincap.io/v2/assets";
        await axios
            .get(url)
            .then((response) => {
                data = response.data.data;

                let tableData = `<tr>
                        <th>Crypto Name</th>
                        <th>Symbol</th>
                        <th>Price (USD)</th>
                        <th>Explorer</th>
                        <th>
                        Price History
                        </th>
                    </tr>`;
                tableData += data
                    .map((res) => {
                        if (
                            res.name
                                .toLowerCase()
                                .includes(searchBox.value.toLowerCase())
                        ) {
                            return `<tr>
                        <td>${res.name}</td>
                        <td>${res.symbol}</td>
                        <td>${twoDigitAfterDecimal(res.priceUsd)}</td>
                        <td><a href=${
                            res.explorer
                        }>View Project's Website</a></td>
                        <td>
                        <button value=${
                            res.id
                        } class=history-price-button>View Price</button>
                        </td>
                    </tr>`;
                        }
                    })
                    .join("");
                searchTable.innerHTML = tableData;
            })
            .catch((error) => {
                console.log(error);
            });
    } else {
        alert("Enter name of crypto");
    }
    var historicalPriceBtn = document.querySelectorAll(".history-price-button");
    for (var i = 0; i < historicalPriceBtn.length; i++) {
        historicalPriceBtn[i].addEventListener("click", async (e) => {
            let url = `https://api.coincap.io/v2/assets/${e.target.value}/history?interval=d1`;
            let url2 = `https://api.coincap.io/v2/candles?exchange=poloniex&interval=h8&baseId=${
                e.target.value
            }&quoteId=tether&start=${
                new Date().getTime() - 86400000 * 7
            }&end=${new Date().getTime()}`;

            axios
                .all([await axios.get(url), await axios.get(url2)])
                .then(
                    axios.spread((response1, response2) => {
                        console.log(response1)
                        var { dataPoints, dataLabels } = massageData(
                            response1.data.data
                        );
                        createChart(dataLabels, dataPoints, e.target.value);
                        let supply = "";
                        let capital = "";
                        for (var i = 0; i < data.length; i++) {
                            if (data[i].id === e.target.value) {
                                supply = twoDigitAfterDecimal(data[i].supply);
                                capital = twoDigitAfterDecimal(
                                    data[i].marketCapUsd
                                );
                                break;
                            }
                        }
                        var h1 = document.createElement("H1"); // Create a <h1> element
                        var t1 = document.createTextNode(
                            "Total Market Capital (USD):"
                        ); // Create a text node               // Create a <h1> element
                        marketCapital.innerHTML = "";
                        chart6.classList.remove("hide");
                        // marketCapital.style.display = "block";
                        h1.appendChild(t1);
                        var t2 = document.createTextNode(capital); // Create a text node
                        var para1 = document.createElement("p");
                        para1.appendChild(t2);
                        marketCapital.appendChild(h1);
                        marketCapital.appendChild(para1);
                        var h2 = document.createElement("H1"); // Create a <h1> element
                        var t3 = document.createTextNode(
                            "Total Current Supply (USD):"
                        ); // Create a text node               // Create a <h1> element
                        totalSupply.innerHTML = "";
                        chart7.classList.remove("hide");
                        // totalSupply.style.display = "block";
                        h2.appendChild(t3);
                        var t4 = document.createTextNode(supply); // Create a text node
                        var para2 = document.createElement("p");
                        para2.appendChild(t4);
                        totalSupply.appendChild(h2);
                        totalSupply.appendChild(para2);
                        // chartContainer .style.display = "flex";
                        let response2Arr = [];
                        response2.data.data.forEach((datum) => {
                            let tempArr = [];
                            tempArr.push(new Date(datum.period));
                            tempArr.push(Number(datum.low));
                            tempArr.push(Number(datum.open));
                            tempArr.push(Number(datum.close));
                            tempArr.push(Number(datum.high));
                            response2Arr.push(tempArr);
                        });
                        console.log(response2Arr);
                        //sample google chart
                        google.charts.load("current", {
                            packages: ["corechart"],
                        });
                        google.charts.setOnLoadCallback(drawChart);
                        function drawChart() {
                            var data = google.visualization.arrayToDataTable(
                                response2Arr,
                                true
                            );
                            var options = {
                                legend: "none",
                                backgroundColor: "black",
                                candlestick: {
                                    fallingColor: { fill: "#FF0000" },
                                },
                                candlestick: {
                                    risingColor: { fill: "#40BF40" },
                                },
                            };
                            var chartDiv = document.getElementById("chart_div");
                            chartDiv.innerHTML = "";
                            var chart = new google.visualization.CandlestickChart(
                                chartDiv
                            );
                            chart.draw(data, options);
                        }
                    })
                )
                .catch((error) => {
                    console.log(error);
                });
        });
    }
});
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
function createChart(dataLabels, dataPoints, title) {
    // chartjs seesm to ahve the data in an Object Format
    const data = {
        labels: dataLabels,
        datasets: [
            {
                label:
                    title[0].toUpperCase() +
                    title.slice(1).toLowerCase() +
                    " Chart",
                backgroundColor: "rgb(0, 0, 0)",
                borderColor: "blue",
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
            pointradius: 0,
            scales: {
                y: {
                    ticks: {
                        // Include a dollar sign in the ticks
                        callback: function (value, index, values) {
                            return value + " US $";
                        },
                    },
                    text: "Price in USD",
                },
            },
        },
    };
    // put the chart in the CSS ID element
    let chartReport = document.getElementById("chart-report");
    chartReport.innerHTML = '<canvas id="myChart"></canvas>';
    var myChart = new Chart(document.getElementById("myChart"), config);
}
function twoDigitAfterDecimal(numberInString) {
    return Number(Number(numberInString).toFixed(2)).toLocaleString();
}
async function getDataFromAPI(url) {
    let data = "";
    await axios.get(url).then((response) => {
        data = response;
    });
    return data;
}
