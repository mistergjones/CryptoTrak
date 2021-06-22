const BASE_URL = 'https://api.coincap.io/v2/assets/${}}/history?interval=d1';

const btnOneDay = document.querySelector(".one-day");
const btnSevenDays = document.querySelector(".seven-days");
const btnOneMonth = document.querySelector(".one-month");
const btnThreeMonths = document.querySelector(".three-months");
const btnSixMonths = document.querySelector(".six-months");
const btnNineMonths = document.querySelector(".nine-months");
const btnOneYear = document.querySelector(".one-year");

const resetChart = () => {
    let chartContainer = document.querySelector(".chart__display");
    chartContainer.innerHTML = "";
    chartContainer.innerHTML = `<canvas class="chart--area" id="detailChart"></canvas>`
}
btnOneDay.addEventListener("click", () => {
    console.log("1day clicked");
    resetChart();
    displayChart(0.25, "h6");
});
btnSevenDays.addEventListener("click", () => {
    console.log("7 days clicked");
    resetChart();
    displayChart(7, "d1");
});
btnOneMonth.addEventListener("click", () => {
    console.log("1 month clicked");
    resetChart();
    displayChart(30, "d1");
});
btnThreeMonths.addEventListener("click", () => {
    console.log("3 months clicked");
    resetChart();
    displayChart(90, "d1");
});
btnSixMonths.addEventListener("click", () => {
    console.log("6 months clicked");
    resetChart();
    displayChart(180, "d1");
});
btnNineMonths.addEventListener("click", () => {
    console.log("9 months clicked");
    resetChart();
    displayChart(270, "d1");
});
btnOneYear.addEventListener("click", () => {
    console.log("1 year clicked");
    resetChart();
    displayChart(365, "d1");
});
const getCoinHistory = async (days, interval, asset) => {
    try {

        const now = new Date().getTime();
        let start = new Date().getTime() - ((days + 1) * 86400000);
        console.log(now);
        console.log(start);
        const response = await axios.get(`https://api.coincap.io/v2/assets/${asset}/history?interval=${interval}&start=${start}&end=${now}`);

        const coinHistory = response.data.data;

        return coinHistory;

    } catch (errors) {
        console.error(errors);
    }
};

const displayChart = async (days, interval) => {
    const params = new URLSearchParams(window.location.search)
    let asset = params.get("coin");
    const coinHistory = await getCoinHistory(days, interval, asset);

    let dataLabels = [];
    let dataPoints = []
    for (let i = 0; i < coinHistory.length; i++) {
        dataPoints.push(coinHistory[i].priceUsd);
        if (interval === "h6") {
            dataLabels.push(`  ${new Date(coinHistory[i].time).getHours()}:00`)
        } else {
            dataLabels.push(`${new Date(coinHistory[i].time).getDate()}/${new Date(coinHistory[i].time).getMonth() == "0" ? 12 : new Date(coinHistory[i].time).getMonth()} `)
        }
        // ${ new Date(coinHistory[i].time).getHours() } ${ new Date(coinHistory[i].time).getMinutes() }
        // ${new Date(coinHistory[i].time).getHours()} ${new Date(coinHistory[i].time).getMinutes()}`)
    }
    console.log(dataLabels);
    console.log(dataPoints);
    const data = {
        labels: dataLabels,
        datasets: [
            {
                label: `${asset.split("-").join(" ").toUpperCase()}`,
                // backgroundColor: "rgb(0, 0, 0)",
                borderColor: "rgb(255, 99, 132)",
                data: dataPoints,
                fill: 'origin',

            },
        ],
    };

    // set the type of graph
    const config = {
        type: "line",
        data,
        options: {
            pointBackgroundColor: "rgb(255,99,132)",
            pointBorderWidth: 2,
            pointRadius: 0
        },
    };

    // put the chart in the CSS ID element
    var myChart = new Chart(document.getElementById("detailChart"), config);
}

displayChart(0.25, "h6");