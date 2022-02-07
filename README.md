# CryptoTrak - A simple & easy to use Crypto tracker website

## Table of contents

-   [Overview](#overview)
    -   [The challenge](#the-challenge)
    -   [Screenshot](#screenshot)
    -   [Links](#links)
-   [The process](#the-process)
    -   [Built with](#built-with)
    -   [What we learned](#what-we-learned)
    -   [Continued development](#continued-development)
    -   [Useful resources](#useful-resources)
-   [Authors](#authors)

## Overview

### The challenge

The challenge was to utilise a free / basic rate limited Crypto API to showcase prices.

Utilising the same API, it was prudent to also decomonstarte the use of charts with defined functions to calculate RSI / Bollinger bands.

### Screenshot

![](./screenshot.jpg)

### Links

-   Solution URL: [https://mistergjones.github.io/CryptoTrak/]
-   Solution Code: [https://github.com/mistergjones/CryptoTrak]

## The process

-   The process was to simply find a free Crpyto API with endpoints that could be used to source historical data so price and charts can be rendered to the screen.

### Built with

-   Semantic HTML5 markup
-   CSS Grid
-   chartjs
-   coincap.io API
-   anychartjs
-   lottie
-   custom functions for chart calculations

### What was learnt

1. Really enjoyed defining my own mathematical functions to calculte moving averages and RSI. The function below demonstrates the requirement to push a rolling 14 day average into an array for subsequent use.

```js
function calculateFirst14DayAverage(movingAverageDays, theDataArray) {
    var tempArray = [];
    var runningTotal = 0;
    for (i = 0; i < movingAverageDays; i++) {
        runningTotal = runningTotal + theDataArray[i];
    }

    tempArray.push(runningTotal / movingAverageDays);

    return tempArray;
}
```

### Continued development

Chartjs has no native CandleStick chart so the use of anychartjs was required. Perhaps forking chartjs and creating a candlestick card for them will be really useful.

## Authors

-   Glen Jones - [https://www.glenjones.com.au]
-   Shailesh Kharki
-   Peter Hristakos
