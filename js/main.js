/// <reference path="jquery-3.6.0.js" />
async function showCurrency(id) {
    // to check if we already loaded the current currency
    if ($(`#${id}-collapse`).children().length > 1) {
        return;
    }
    try {
        const data = await getCurrentPrice(id)
        const paragraph = `
            <img class="crypt-icon" src=${data.image.thumb}>
            <p>
            Current prices:<br>
            &#36;${data.market_data.current_price.usd}<br>
            &#8364;${data.market_data.current_price.eur}<br>
            &#8362;${data.market_data.current_price.ils}
            </p>`;
        $(`#${id}-collapse`).append(paragraph);
        //hiding the spinner when we finish
        $(`#${id}-spinner`).hide();
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

async function displayTop100() {
    try {
        const data = await getData("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc");
        data.forEach(element => $(".cards").append(createCard(element)));
    }
    catch (err) {
        console.log("An error has occurred:" + err);
    }

}

// when document is finished loading we invoke this function 
$(function () {


    displayTop100();
    $("div.cards").on('click', 'a.btn-info', function () {
        showCurrency($(this).prev().attr('id').replace("-collapse", ""))
    })
});
