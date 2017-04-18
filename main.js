var products = [];
var seasonalSales = [];
const discountSelect = document.getElementById("discountSelect");
const productDisplayDiv = document.getElementById("productDisplayDiv");
productDisplayDiv.innerHTML += `<div class="col-md-4"><div class="panel panel-primary"><div class="panel-heading"><h2 class="panel-title">Apparel</h2></div><div class="panel-body" id="apparel"></div></div></div>`;
productDisplayDiv.innerHTML += `<div class="col-md-4"><div class="panel panel-primary"><div class="panel-heading"><h2 class="panel-title">Furniture</h2></div><div class="panel-body" id="furniture"></div></div></div>`;
productDisplayDiv.innerHTML += `<div class="col-md-4"><div class="panel panel-primary"><div class="panel-heading"><h2 class="panel-title">Household</h2></div><div class="panel-body" id="household"></div></div></div>`;
const apparelDiv = document.getElementById("apparel");
const furnitureDiv = document.getElementById("furniture");
const householdDiv = document.getElementById("household");
var discountApplied = { //flags to determine whether discounts have already been triggered or not
    "Autumn": false,
    "Winter": false,
    "Spring": false
};

discountSelect.addEventListener("change", discountPrices);

function discountPrices(e) {
    let selectedSeason = (e.target.value);
    if (discountApplied[selectedSeason] === false) { //only discounts each price one time
        let selectedDiscount = getDiscount(selectedSeason);
        let selectedCategory = getCategory(selectedSeason);
        let selectedDiv = document.getElementById(`${selectedCategory}`);
        let prices = selectedDiv.getElementsByClassName("priceNum");
        for (let i = 0; i < prices.length; i++) {
            let currPrice = prices[i].innerHTML;
            prices[i].innerHTML = (currPrice * (1 - selectedDiscount)).toFixed(2);
        };
        discountApplied[selectedSeason] = true;
    }
};

function getDiscount(season) { //assists DiscountPrices
    let discount;
    seasonalSales.forEach(function(obj) {
        if (obj.season_discount === season) {
            discount = obj.discount;
        }
    });
    return discount;
}

function getCategory(season) { //assists DiscountPrices
    let category;
    seasonalSales.forEach(function(obj) {
        if (obj.season_discount === season) {
            category = obj.name;
        }
    });
    return category;
}

function getProducts() { //parses JSON to JS
    let json = JSON.parse(this.responseText);
    products = json.products;
    printProducts(); //triggers printing to DOM
}

function getSeasonalSales() { //parses JSON to JS
    let json = JSON.parse(this.responseText);
    seasonalSales = json.categories;
}

function printProducts() { //prints to the DOM
    let apparelString = "";
    let furnitureString = "";
    let householdString = "";
    for (let i = 0; i < products.length; i++) {
        let currProduct = products[i];
        if (currProduct.category_id === 1) {
            apparelString += buildString(currProduct);
        } else if (currProduct.category_id === 2) {
            furnitureString += buildString(currProduct);
        } else {
            householdString += buildString(currProduct);
        }
    }
    apparelDiv.innerHTML = apparelString;
    furnitureDiv.innerHTML = furnitureString;
    householdDiv.innerHTML = householdString;
};

function buildString(currProduct) { //assists printProducts
    let domStr = "";
    domStr += `<div class="productName">`;
    domStr += `${currProduct.name}`;
    domStr += `</div>`;
    domStr += `<div class="productPrice">`;
    domStr += `$<span class="priceNum">${currProduct.price}</span>`;
    domStr += `</div>`;
    return domStr;
}

var pullProducts = new XMLHttpRequest();
pullProducts.addEventListener("load", getProducts);
pullProducts.addEventListener("error", function() {
    alert("JSON error - Products")
});
pullProducts.open("GET", "products.json");
pullProducts.send();

var pullSeasonalSales = new XMLHttpRequest();
pullSeasonalSales.addEventListener("load", getSeasonalSales);
pullSeasonalSales.addEventListener("error", function() {
    alert("JSON error - Seasonal Sales")
});
pullSeasonalSales.open("GET", "seasonalSales.json");
pullSeasonalSales.send();