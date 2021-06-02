"use strict";
// The script includes functions for building the live reports section, 
// functions for handling and managing the data and divs.

function getCheckedCurrencies() {
    const reports = getFromLocalStorage("reports");
    const checkedCurrencies = [];
    for (const report of reports) {
        if (report.isChecked) {
            checkedCurrencies.push(report.symbol);
        }
    }
    return checkedCurrencies;
}
function updateChartData(chartData, checkedCurrenciesNames) {
    //removing from chart if not checked at the time of updating
    //first we take what is inside the charts
    const currenciesInData = []
    for (const dataObj of chartData) {
        currenciesInData.push(dataObj.name)
    }
    const uncheckedNames = currenciesInData.filter(val => !checkedCurrenciesNames.includes(val));
    for (const name of uncheckedNames) {
        chartData = $.grep(chartData, (obj) => {
            return obj.name !== name;
        });
    }

    return chartData;
}

async function updateCanvas(startTime) {

    const chart = $("#chartContainer").CanvasJSChart(); // canvas object
    let chartData = chart.options.data;
    const checkedCurrencies = getCheckedCurrencies();
    const checkedCurrenciesNames = [];
    if (checkedCurrencies.length === 0) {
        if (chartData.length) {
            chart.options.title.text = `Please choose up to 5 crypto currencies`;
            chart.options.data = [];
            chart.render();
        }
        return;
    }
    // creating the title and taking the symbols of each currency
    let canvasTitle = "";
    const arrLength = checkedCurrencies.length;

    if (arrLength === 1) {
        let currencySymbol = checkedCurrencies[0];
        canvasTitle = currencySymbol;
        checkedCurrenciesNames.push(currencySymbol);
    } else {
        let currencySymbol = "";
        for (let i = 0; i < arrLength - 1; i++) {
            currencySymbol = checkedCurrencies[i]
            canvasTitle += currencySymbol + ",";
            checkedCurrenciesNames.push(currencySymbol);
        }
        currencySymbol = checkedCurrencies[arrLength - 1]
        canvasTitle += currencySymbol;
        checkedCurrenciesNames.push(currencySymbol);

    }
    chart.options.title.text = canvasTitle + " to USD\\$";
    try {
        const currenciesInUSD = await getCurrencies(canvasTitle);

        if (chartData.length) {
            chartData = updateChartData(chartData, checkedCurrenciesNames);
        }
        const currentTime = new Date().getTime();


        for (const currency in currenciesInUSD) {
            let currencyInData = chartData.find((obj) => {
                return obj.name === currency;
            });

            if (!currencyInData || currencyInData.length === 0) {
                const newCurrencyData = {
                    type: "spline",
                    name: currency,
                    showInLegend: true,
                    dataPoints: [
                        { x: 0, y: currenciesInUSD[currency].USD }
                    ]
                }
                chartData.push(newCurrencyData);
            } else {
                currencyInData.dataPoints.push(
                    { x: (currentTime - startTime) / 1000, y: currenciesInUSD[currency].USD }
                );
                chartData = $.grep(chartData, (data) => {
                    return data.name !== currencyInData.name;
                });
                chartData.push(currencyInData);
            }
        }
        chart.options.data = chartData;
        chart.render();
    }
    catch (err) {
        console.log(err);
    }

}

function createCanvas() {
    const options = {
        exportEnabled: true,
        animationEnabled: true,
        title: {
            text: `Please choose up to 5 crypto currencies`
        },

        axisX: {
            title: "Seconds (updated every 2 secs)",
            titleFontColor: "#4F81BC",
            lineColor: "#4F81BC",
            labelFontColor: "#4F81BC",
            tickColor: "#4F81BC"
        },
        axisY: {
            title: "Price in US dollars",
            titleFontColor: "#4F81BC",
            lineColor: "#4F81BC",
            labelFontColor: "#4F81BC",
            tickColor: "#4F81BC"
        },

        toolTip: {
            shared: true
        },
        legend: {
            cursor: "pointer",
            itemclick: toggleDataSeries
        },
        data: [
        ]
    };
    $("#chartContainer").CanvasJSChart(options);
}
function toggleDataSeries(e) {
    // when a legend is clicked then this shows his chart
    if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
        e.dataSeries.visible = false;
    } else {
        e.dataSeries.visible = true;
    }
    e.chart.render();
}

function buildLiveReportsSection() {
    // first we clear the sections div
    $(".sections").empty();
    //changing the links color in nav area
    $("#liveReportsLink").addClass("nav-link-active");
    $("#currenciesLink").removeClass("nav-link-active");
    // we create the div that contains the canvas and then the canvas div
    const liveReportsComponent = `
        <div id="liveReportsComponent">
            <div id="chartContainer" style="height: 500px; width: 1125px;"></div>
        </div>
    `;

    // we append the component to sections div
    $(".sections").append(liveReportsComponent);
}