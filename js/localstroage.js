function saveToLocalStorage(data) {

    const timestamp = new Date().getTime();
    const info = {
        id: data.id,
        image: data.image,
        usd: data.usd,
        eur: data.eur,
        ils: data.ils,
        timestamp: timestamp,
    }
    localStorage.setItem(data.id, JSON.stringify(info));
}
function deleteFromLocalStorage(key) {
    const jsonObject = localStorage.getItem(key);
    if (!jsonObject) return;
    localStorage.removeItem(key);
}
function inLocalStorage(key) {
    const jsonObject = localStorage.getItem(key);
    return jsonObject === null ? false : true;
}
function getFromLocalStorage(key) {
    const jsonObject = localStorage.getItem(key);
    if (!jsonObject) return;
    return JSON.parse(jsonObject);
}
function checkTimeStamps(id) {
    // checking if two minutes have passed since we entered a currency into the local storage
    const jsonObject = localStorage.getItem(id);
    if (!jsonObject) throw new ("Json Object was not found");
    const info = JSON.parse(jsonObject);
    const timeNow = new Date().getTime();
    const timeRemainder = timeNow - info.timestamp;
    if (timeRemainder > 0) {
        return timeRemainder >= 1000 * 60 * 2;
    }
    return false;

}

function removeExpired(data) {
    for (const currency of data) {
        const id = currency.id;
        if (inLocalStorage(id)) {
            if (checkTimeStamps(id)) {
                deleteFromLocalStorage(id);
            }
        }
    }
}
function addForReports(id, isChecked, symbol) {
    // adding and array of objects in local storage the new currency or updating 
    // a currency for the live reports
    let updatedObject = [];
    const jsonArray = localStorage.getItem("reports");
    if (jsonArray) {
        updatedObject = JSON.parse(jsonArray);
    }

    updatedObject.push({
        id: id,
        isChecked: isChecked,
        symbol: symbol.toUpperCase()
    });
    localStorage.setItem("reports", JSON.stringify(updatedObject));
}
function deleteFromReports(id) {
    // deleting a currency from the reports array  
    const jsonArray = localStorage.getItem("reports")
    if (!jsonArray) throw new Error("The id wan not found.");

    const reports = JSON.parse(jsonArray);

    reports.forEach((currency, index) => {
        if (currency.id === id) {
            reports.splice(index, 1);
        };
    })
    localStorage.removeItem("reports");
    localStorage.setItem("reports", JSON.stringify(reports));

}
function inReports(id) {
    const reports = getFromLocalStorage("reports");
    let isIn = false;
    for (const currency of reports) {
        if (currency.id === id) {
            isIn = true;
        };
    }
    return isIn;
}