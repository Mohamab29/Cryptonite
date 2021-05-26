/// <reference path="jquery-3.6.0.js" />

function getTop100Data() {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc",
            success: data => resolve(data),
            error: err => reject(err)
        });
    });
}
function getCurrentPrice(id){
    return new Promise((resolve, reject) => {
        $.ajax({
            url: `https://api.coingecko.com/api/v3/coins/${id}`,
            success: data => resolve(data),
            error: err => reject(err)
        });
    });
}

function getCurrencies(currencies){
    return new Promise((resolve, reject) => {
        $.ajax({
            url: `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${currencies}&tsyms=USD&api_key={8811c233b7434d817aa5e4ca605cdea029b7db3b9ba10aef765556f3dc6bc8f1}`,
            success: data => resolve(data),
            error: err => reject(err)
        });
    });
}