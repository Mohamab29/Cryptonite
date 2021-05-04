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
            const info = getObjectFromLocalStorage(id);
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
                <h5 class="card-title">${crypto.symbol.toUpperCase()}</h5>
                <div class="custom-control custom-switch">
                    <input type="checkbox" class="custom-control-input" id="${crypto.id}Switch">
                    <label class="custom-control-label" for="${crypto.id}Switch"></label>
                </div>
            </div>
            <p class="card-text">${crypto.name}</p>
            <div class="collapse" id="${crypto.id}-collapse">
            <div class="spinner-border text-info" id="${crypto.id}-spinner" role="status">
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
    // $($(cardsTexts[6]).parentsUntil("div.cards"));
    const checkText = (text) => {
        const txtValue = text.toLowerCase();
        return txtValue.includes(filter);
    };

    let contain = false;
    for (let i = 0; i < cardsTexts.length; i++) {
        const card = $($(cardsTexts[i]).parentsUntil("div.cards")); // parent card
        const title = $(cardsTitles[i]).text() // the innerHtml for title
        const currencyName = $(cardsTexts[i]).text()

        if (checkText(title) || checkText(currencyName)) {
            card.show();
            contain = true;
        }
        if (!contain) {
            card.hide();
        }
        contain = false;
    }
    $(".fa-search").show();
    $("#search-spinner").hide();
}

async function displayTop100() {
    try {
        const data = await getData("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc");
        removeExpired(data);
        data.forEach(element => $(".cards").append(createCard(element)));
    }
    catch (err) {
        console.log("An error has occurred:" + err);
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

});
