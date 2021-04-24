/// <reference path="jquery-3.6.0.js" />

function createCard(crypto) {
    const card = $("<div></div>").attr({
        class: "card col-3",
        style: "width:16rem;"
    });
    const cardBody = $("<div></div>").attr('class', "card-body");
    const cardTitle = $("<h5></h5>").attr('class', "card-title")
    .text(`${crypto.symbol.toUpperCase()}`);
    const cardText = $("<p></p>").attr('class', "card-text")
    .text(`${crypto.name}`);

    const cardButton = $("<a></a>").attr({
        class:"btn btn-info",
        href:"#",
        role:"button"
    });
    cardButton.attr("data-toggle","collapse");
    cardButton.text("More info");
    cardBody.append(cardTitle);
    cardBody.append(cardText);
    cardBody.append(cardButton);
    card.append(cardBody);
    $(".cards").append(card);

}

function displayTop100() {
    getData("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc")
    .then((data) => {
       data.forEach(element=>createCard(element));
    })
    .catch((err) => alert(err));

}

// when document is finished loading we invoke this function 
$(function () {


    displayTop100()
});
