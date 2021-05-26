/// <reference path="jquery-3.6.0.js" />
function showMoreInfo(infoObject) {
    //checking if we already created the div 
    if ($(`#${infoObject.id}-collapse`).children().length > 1) {
        return;
    }
    const paragraph = `
        <img class="crypt-icon" src=${infoObject.image}>
        <p>
        Current prices:<br>
        &#36;${infoObject.usd}<br>
        &#8364;${infoObject.eur}<br>
        &#8362;${infoObject.ils}
        </p>`;
    $(`#${infoObject.id}-collapse`).append(paragraph);
    //hiding the spinner when we finish
    $(`#${infoObject.id}-spinner`).hide();
}
async function showCurrency(id) {
    // to check if we already loaded the current currency
    if (inLocalStorage(id)) {
        if (!checkTimeStamps(id)) {
            const info = getFromLocalStorage(id);
            showMoreInfo(info);
            return;
        }
        else {
            deleteFromLocalStorage(id);
        }
    }
    try {
        // first get the currency info by it's id then we build an html element to show it 
        // after we finish we save it to local storage
        const data = await getCurrentPrice(id)
        const infoObject = {
            id: id,
            image: data.image.thumb,
            usd: data.market_data.current_price.usd,
            eur: data.market_data.current_price.eur,
            ils: data.market_data.current_price.ils
        }
        showMoreInfo(infoObject);
        saveToLocalStorage(infoObject);
    }
    catch (err) {
        console.log("An error has occurred:" + err);
    }
}

function createCard(crypto) {
    const card = `
    <div class="card" style="width: 16rem;">
        <div class="card-body">
            <div class ="c-header">
                <h5 class="card-title ${crypto.id.toLowerCase()}-title">${crypto.symbol.toUpperCase()}</h5>
                <div class="custom-control custom-switch">
                    <input type="checkbox" class="custom-control-input card-checkbox" id="${crypto.id}Switch">
                    <label class="custom-control-label" for="${crypto.id}Switch"></label>
                </div>
            </div>
            <p class="card-text">${crypto.name}</p>
            <div class="collapse" id="${crypto.id}-collapse">
            <div class="spinner-border card-spinner text-info" id="${crypto.id}-spinner" role="status">
            <span class="sr-only">Loading...</span>
            </div>
            </div>
            <a class="btn btn-info" data-toggle="collapse" href="#${crypto.id}-collapse" role="button">
            More info</a>
        </div>
    </div>`;
    return card;
}
function searchCards() {
    //showing loading icon

    const cardsTitles = $("h5.card-title");
    const cardsTexts = $("p.card-text");
    const filter = $('#search-input').val().toLowerCase();
    const showSpinner = () => {
        $(".fa-search").show();
        $("#search-spinner").hide();
    };
    if (!filter) {
        showSpinner();
        return;
    }

    const checkText = (text) => {
        const txtValue = text.toLowerCase();
        return txtValue === filter;
    };

    let contain = false;
    for (let i = 0; i < cardsTexts.length; i++) {
        const card = $($(cardsTexts[i]).parentsUntil("div.cards")); // parent card
        const title = $(cardsTitles[i]).text() // the innerHtml for title
        const currencyName = $(cardsTexts[i]).text()

        if (checkText(title) || checkText(currencyName)) {
            $(card[1]).show();//getting the whole card
            contain = true;
        }
        if (!contain) {
            $(card[1]).hide();
        }
        contain = false;
    }
    showSpinner();
}
function updateReports(reports, currencyID, isChecked) {
    for (const currency of reports) {
        if (currency.id === currencyID) {
            currency.isChecked = isChecked;
            deleteFromReports(currency.id);
            addForReports(currency.id, currency.isChecked);
            break;
        }
    }
}

function getCheckedCurrencies() {
    const reports = getFromLocalStorage("reports");
    const checkedCurrencies = [];
    for (const report of reports) {
        if (report.isChecked) {
            checkedCurrencies.push(report.id);
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
        chart.options.title.text =`Please choose up to 5 crypto currencies`;
        chart.options.data = [];
        chart.render();
        return;
    }
    // creating the title and taking the symbols of each currency
    let canvasTitle = "";
    const arrLength = checkedCurrencies.length;

    if (arrLength === 1) {
        let currencySymbol = $(`h5.${checkedCurrencies[0]}-title`).text();
        canvasTitle = currencySymbol;
        checkedCurrenciesNames.push(currencySymbol);
    } else {

        let currencySymbol = "";
        for (let i = 0; i < arrLength - 1; i++) {
            currencySymbol = $(`h5.${checkedCurrencies[i]}-title`).text()
            canvasTitle += currencySymbol + ",";
            checkedCurrenciesNames.push(currencySymbol);
        }
        currencySymbol = $(`h5.${checkedCurrencies[arrLength - 1]}-title`).text();
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
                        { x: (currentTime - startTime) / 1000, y: currenciesInUSD[currency].USD }
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
function showCanvas() {
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

function showModal(reports, id) {
    $("#checked-currencies").html("");
    reports.forEach((currency) => {
        if (currency.isChecked) {
            $("#checked-currencies").append(`
        <div class="row">
        <input type="checkbox" name="textEditor" id="${currency.id}-checkbox" checked>
        <label for="${currency.id}-checkbox">${currency.id.toUpperCase()}</label>
        </div>
        `);
        };
    });
    $("#checkModal").modal("show");
    $("#modalOk").on('click', function () {
        const inputs = $("#checked-currencies").find('input');
        let countChecked = 0;
        for (let i = 0; i < inputs.length; i++) {
            const isChecked = $(inputs[i]).is(":checked");
            const currencyID = $(inputs[i]).attr("id").replace("-checkbox", "");
            if (!isChecked) {
                // uncheck th elements in the HTML page
                updateReports(reports, currencyID, isChecked);
                $(`#${currencyID}Switch`).prop("checked", false);
            } else {
                countChecked++;
            }
        }
        if (countChecked === 5) {
            $(`#${id}Switch`).prop('checked', false);
        }
        else {
            updateReports(reports, id, true);
            $(`#${id}Switch`).prop('checked', true);
        }
        //removing the click events 
        $("#modalOk").off('click');
        $("#modalCancel").off('click');
    });
    $("#modalCancel").on('click', function () {
        $("#checkModal").modal("hide");
        $(`#${id}Switch`).prop('checked', false);

        $("#modalOk").off('click');
        $("#modalCancel").off('click');
    });

}
function addCheckedCurrency(inputElement) {
    // if the checked on the currency button is on or off then 
    // it's added to the reports file
    const isChecked = $(inputElement).is(":checked");
    // if (!isChecked) return; // if the element is not checked uncheck

    const currencyID = $(inputElement).attr('id').replace('Switch', '');
    const reports = getFromLocalStorage("reports");

    const checkFor5True = (r) => {
        let counter = 0
        for (const currency of r) {
            if (currency.isChecked) {
                counter++;
            }
        }
        return counter === 5;
    }
    if (checkFor5True(reports) && isChecked) {
        showModal(reports, currencyID)
        return;
    } else {
        updateReports(reports, currencyID, isChecked);
    }

}
async function displayTop100() {
    try {
        const data = await getTop100Data();
        removeExpired(data);
        if (getFromLocalStorage("reports")) {
            localStorage.removeItem("reports");
        }

        data.forEach((element) => {
            if (element) {
                addForReports(element.id, false); // initializing the reports
                $(".cards").append(createCard(element));
            }
        }
        );
    }
    catch (err) {
        console.log(err);
    }

}

// when document is finished loading we invoke this function 
$(function () {

    // first we display the top 100 relevant cryptocurrencies 
    displayTop100();

    // when a click event happens on an info button we use the wrapper
    //element in order to catch the event
    $("div.cards").on('click', 'a.btn-info', function () {
        // the prev of the btn-info is the card the hidden collapsed div
        showCurrency($(this).prev().attr('id').replace("-collapse", ""))
    })

    //for when a client clicks on the search button 
    $('#search-btn').on('click', function () {
        $(".fa-search").hide();
        $("#search-spinner").show();
        setTimeout(() => {
            searchCards()
        }, 600);
    });
    //when the little x button is clicked in the search bar in cards container 
    $('#search-input').on('search', function () {
        (() => {
            const cards = $("div.cards").children();
            for (const card of cards) {
                if (!($(card).is(":visible"))) {
                    $(card).show()
                }
            }
        })();
    });


    $("div.cards").on('click', 'input.card-checkbox', function () {

        addCheckedCurrency($(this));

    });


    //when scrolling we wan to change the offset of the navbar
    $(window).on('scroll', () => {
        let offset = window.pageYOffset;
        $(".nav-area").css("background-position-y", offset * 0.6 + "px");
    });


    showCanvas();
    const startTime = new Date().getTime();
    setInterval(() => {

        updateCanvas(startTime);
    }, 2000);

});