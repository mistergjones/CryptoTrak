const BASE_URL = 'https://api.coincap.io/v2/';
let offSet = 0;
const limit = 50;

let coinsDisplay = document.querySelector(".coins-data");

const collapsibles = document.querySelectorAll(".collapsible");
collapsibles.forEach((item) =>
  item.addEventListener("click", function () {
    this.classList.toggle("collapsible--expanded");
  })
);

const btnNext = document.querySelector(".next");
const btnPrevious = document.querySelector(".previous");
const btnReload = document.querySelector(".reload");

btnReload.addEventListener("click", () => {
  coinsDisplay.innerHTML = "";
  displayCoins();
});
btnNext.addEventListener("click", () => {
  coinsDisplay.innerHTML = "";
  offSet += limit;
  displayCoins();
});

btnPrevious.addEventListener("click", () => {
  console.log("previous clicked");
  if (offSet > 0) {
    coinsDisplay.innerHTML = "";
    offSet = offSet - limit;
    displayCoins();
  }
})

const getAllCoins = async () => {
  try {
    const response = await axios.get(`${BASE_URL}assets?limit=${limit}&offset=${offSet}`);

    const allCoins = response.data.data;

    // console.log(`GET: Here's the list of coins`, allCoins);

    return allCoins;
  } catch (errors) {
    console.error(errors);
  }
};


var formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',

  // These options are needed to round to whole numbers if that's what you want.
  //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
  //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});

const displayCoins = async () => {

  const coins = await getAllCoins();

  // console.log(coinsDisplay);
  coins.map((coin, index) => {
    let tr = document.createElement("tr");
    let tdRank = document.createElement("td");
    let tdIcon = document.createElement("td");
    let tdName = document.createElement("td");
    let tdPrice = document.createElement("td");
    let tdPercentageChange = document.createElement("td");


    tdRank.innerHTML = `<a data-aos="fade-left" href="detail.html?coin=${coin.symbol}"> ${coin.rank} </a>`;
    // tdIcon.innerHTML = `<a href="detail.html"><img class="icon-symbol" src="https://cryptoicon-api.vercel.app/api/icon/${coin.symbol.toLowerCase()}" /> </a>`;
    tdName.innerHTML =
      `<a data-aos="fade-left" href="detail.html?coin=${coin.id}">
        <div class="symbol">
        <div class="symbol-name-icon">
          <div>
              <img class="icon-symbol" src="https://cryptoicon-api.vercel.app/api/icon/${coin.symbol.toLowerCase()}" />
          </div>
          <div>
            ${coin.symbol}
          </div>

        </div>

        <div class="symbol-name">
          ${coin.name}
        </div>
      </div> 
    </a>`;
    tdPrice.innerHTML = `<a data-aos="fade-left" href="detail.html?coin=${coin.symbol}"><div class="coin-price"> ${formatter.format(coin.priceUsd)} </div></a> `;
    tdPercentageChange.innerHTML = coin.changePercent24Hr >= 0 ? `<a data-aos="fade-left" style="color: green;" href="detail.html?coin=${coin.symbol}"> &#9650;` + ` ${Number(coin.changePercent24Hr).toFixed(2).toLocaleString()} % </a>` : `<a data-aos="fade-left" style="color: red;" href="detail.html?coin=${coin.symbol}">&#9660;` + `${Number(coin.changePercent24Hr).toFixed(2).toLocaleString()} % </a>`;
    tdPercentageChange.style.color = coin.changePercent24Hr >= 0 ? "green" : "red";



    tr.appendChild(tdRank);
    // tr.appendChild(tdIcon);
    tr.appendChild(tdName);
    tr.appendChild(tdPrice);
    tr.appendChild(tdPercentageChange);
    coinsDisplay.appendChild(tr);
  })
}

displayCoins();

//
// coins.map((coin, index) => {

//   document.appendChild(coin.name);
// })