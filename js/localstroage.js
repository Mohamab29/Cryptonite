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
function deleteFromLocalStorage(id) {
    const jsonObject = localStorage.getItem(id);
    if (!jsonObject) return;
    localStorage.removeItem(id);
}
function inLocalStorage(id) {
    const jsonObject = localStorage.getItem(id);
    return jsonObject === null ? false : true;
}
function getObjectFromLocalStorage(id) {
    const jsonObject = localStorage.getItem(id);
    if (!jsonObject) throw new ("Json Object was not found");
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