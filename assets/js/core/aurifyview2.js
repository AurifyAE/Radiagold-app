// import { readSpreadValues } from '../core/spotrateDB.js';
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-firestore.js";
import { app } from '../../../config/db.js';

const script = document.createElement('script');
script.src = 'https://cdnjs.cloudflare.com/ajax/libs/socket.io/4.2.0/socket.io.js';
document.head.appendChild(script);

const socket = io('https://capital-server-9ebj.onrender.com/', {
    query: { secret: 'aurify@123' }, // Pass secret key as query parameter
});

const firestore = getFirestore(app)

socket.on("connect", () => {
    console.log("Connected to WebSocket server");
    requestMarketData(["GOLD"]);
});

// Request market data based on symbols
function requestMarketData(symbols) {
    socket.emit("request-data", symbols);
}

setInterval(fetchData1, 500);

setInterval(() => {
    fetchData()
}, 1000)

// fetchData()
showTable();



let askSpread, bidSpread, goldAskingPrice, goldBiddingPrice, silverBidSpread, silverAskSpread, goldBuy, goldSell, silverBuy, silverSell, silverValue, goldValueUSD, goldHigh, goldLow;

let goldData = {}

// async function fetchData() {
//     socket.on('goldValue', (goldValues) => {
//         // console.log('Received gold value:', goldValue);
//         const value = goldValues.bid;
//         goldHigh = goldValues.high;
//         goldLow = goldValues.low;
//         goldBuy = (value + bidSpread).toFixed(2);
//         goldSell = (value + askSpread + parseFloat(0.5)).toFixed(2);

//         var GoldUSDResult = (value / 31.1035).toFixed(4);
//         goldValue = (GoldUSDResult * 3.67).toFixed(4);
//         // You can do something with the received gold value here, like updating UI
//     });
// }


async function fetchData() {
    socket.on('market-data', (data) => {
        // console.log('Received gold value:', data);

        if (data && data.symbol) {
            if (data.symbol === "Gold") {
                goldData = data;
                // updateGoldUI();
            }
        } else {
            console.warn("Received malformed market data:", data);
        }


        const value = goldData.bid;
        goldHigh = goldData.high;
        goldLow = goldData.low;
        goldBuy = (value + bidSpread).toFixed(2);
        goldSell = (value + bidSpread + askSpread + parseFloat(0.5)).toFixed(2);


    });

    var goldBuyUSD = (goldBuy / 31.103).toFixed(4);
    goldBiddingPrice = (goldBuyUSD * 3.674).toFixed(4);

    var goldSellUSD = (goldSell / 31.103).toFixed(4);
    goldAskingPrice = (goldSellUSD * 3.674).toFixed(4);
}


// Gold API KEY
const API_KEY = 'goldapi-fbqpmirloto20zi-io'

// Function to Fetch Gold API Data
async function fetchData1() {
    var myHeaders = new Headers();
    myHeaders.append("x-access-token", API_KEY);
    myHeaders.append("Content-Type", "application/json");

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    try {
        const responseGold = await fetch("https://www.goldapi.io/api/XAU/USD", requestOptions);
        const responseSilver = await fetch("https://www.goldapi.io/api/XAG/USD", requestOptions);

        if (!responseGold.ok && !responseSilver.ok) {
            throw new Error('One or more network responses were not OK');
        }

        // const resultGold = await responseGold.json();
        const resultSilver = await responseSilver.json();

        // Adjust based on the actual API response structure
        // var goldValueUSD = parseFloat(resultGold.price);
        var silverValueUSD = parseFloat(resultSilver.price)

        // document.getElementById('goldRate').textContent = '$' + goldValueUSD.toFixed(2);
        // document.getElementById('silverRate').textContent = '$' + silverValueUSD.toFixed(3)

        // var GoldUSDResult = (goldValueUSD / 31.1035).toFixed(4);
        // goldValue = (GoldUSDResult * 3.67).toFixed(4);

        var silverUSDResult = (silverValueUSD / 31.1035).toFixed(4)
        silverValue = parseFloat(silverUSDResult * 3.67).toFixed(4)

        // var goldLowValue = parseFloat(resultGold.low_price);
        // var goldHighValue = parseFloat(resultGold.high_price);
        var silverLowValue = parseFloat(resultSilver.low_price);
        var silverHighValue = parseFloat(resultSilver.high_price);


        // goldBuy = (goldValueUSD + bidSpread).toFixed(2);
        // goldSell = (goldValueUSD + askSpread + parseFloat(0.5)).toFixed(2);
        silverBuy = (silverValueUSD + silverBidSpread).toFixed(3);
        silverSell = (silverValueUSD + silverAskSpread + parseFloat(0.05)).toFixed(3);


        var currentGoldBuy = goldBuy;
        var currentGoldSell = goldSell;
        var currentSilverBuy = silverBuy;
        var currentSilverSell = silverSell;


        function updatePrice() {
            var newGoldBuy = goldBuy;
            var newGoldSell = goldSell;
            var newSilverBuy = silverBuy;
            var newSilverSell = silverSell;

            var element1 = document.getElementById("goldInputLow");
            var element2 = document.getElementById("goldInputHigh");
            var element3 = document.getElementById("silverInputLow");
            var element4 = document.getElementById("silverInputHigh");

            element1.innerHTML = newGoldBuy;
            element2.innerHTML = newGoldSell;
            element3.innerHTML = newSilverBuy;
            element4.innerHTML = newSilverSell;

            // Determine color for each element
            var color1;
            var fontColor1;
            if (newGoldBuy > currentGoldBuy) {
                color1 = "green";
                fontColor1 = "white"
            } else if (newGoldBuy < currentGoldBuy) {
                color1 = "red";
                fontColor1 = "white"
            } else {
                color1 = "white"; // Set to white if no change
                fontColor1 = "black"
            }

            var color2;
            var fontColor2;
            if (newGoldSell > currentGoldSell) {
                color2 = "green";
                fontColor2 = "white"
            } else if (newGoldSell < currentGoldSell) {
                color2 = "red";
                fontColor2 = "white"
            } else {
                color2 = "white"; // Set to white if no change
                fontColor2 = "black"
            }

            var color3;
            var fontColor3;
            if (newSilverBuy > currentSilverBuy) {
                color3 = "green";
                fontColor3 = "white"
            } else if (newSilverBuy < currentSilverBuy) {
                color3 = "red";
                fontColor3 = "white"
            } else {
                color3 = "white"; // Set to white if no change
                fontColor3 = "black"
            }

            var color4;
            var fontColor4;
            if (newSilverSell > currentSilverSell) {
                color4 = "green";
                fontColor4 = "white"
            } else if (newSilverSell < currentSilverSell) {
                color4 = "red";
                fontColor4 = "white"
            } else {
                color4 = "white"; // Set to white if no change
                fontColor4 = "black"
            }

            element1.style.backgroundColor = color1;
            element2.style.backgroundColor = color2;
            element3.style.backgroundColor = color3;
            element4.style.backgroundColor = color4;

            element1.style.color = fontColor1;
            element2.style.color = fontColor2;
            element3.style.color = fontColor3;
            element4.style.color = fontColor4;


            currentGoldBuy = newGoldBuy;
            currentGoldSell = newGoldSell;
            currentSilverBuy = newSilverBuy;
            currentSilverSell = newSilverSell;

            setTimeout(updatePrice, 300);
        }


        updatePrice();


        // document.getElementById("goldInputLow").innerHTML = goldBuy;
        // document.getElementById("goldInputHigh").innerHTML = goldSell;
        // document.getElementById("silverInputLow").innerHTML = silverBuy;
        // document.getElementById("silverInputHigh").innerHTML = silverSell;

        document.getElementById("lowLabelGold").innerHTML = goldLow;
        document.getElementById("highLabelGold").innerHTML = goldHigh;
        document.getElementById("lowLabelSilver").innerHTML = silverLowValue;
        document.getElementById("highLabelSilver").innerHTML = silverHighValue;

        // var element;

        // // LowLabelGold
        // element = document.getElementById("lowLabelGold");
        // element.style.backgroundColor = "red";

        // // HighLabelGold
        // element = document.getElementById("highLabelGold");
        // element.style.backgroundColor = "green";

        // // LowLabelSilver
        // element = document.getElementById("lowLabelSilver");
        // element.style.backgroundColor = "red";

        // // HighLabelSilver
        // element = document.getElementById("highLabelSilver");
        // element.style.backgroundColor = "green";
    } catch (error) {
        console.error('Error fetching gold and silver values:', error);
    }
}

// function setGoldValue(value) {
//     goldValueUSD = value;
// }



////////////////////////////////////////////
///// Function to show Alert  //////////////

// function rateAlert() {
//     const value = parseFloat(document.getElementById('goldRateValue').value);
//     const valueMin = parseFloat(document.getElementById('goldRateValue').value) - 50;
//     const valueMax = parseFloat(document.getElementById('goldRateValue').value) + 50;

//     // Initialize the round slider on the element
//     $("#slider").roundSlider({
//         radius: 120,
//         circleShape: "half-top",
//         sliderType: "min-range",
//         showTooltip: false,
//         value: value,
//         lineCap: "round",
//     });

//     var obj1 = $("#slider").data("roundSlider");
//     obj1.setValue(valueMin);  

//     // Set up a callback function for the value change event
//     $("#slider").on("drag", function (event) {
//         // Get the current value
//         var currentValue = $("#slider").roundSlider("option", "value");
//         console.log("Current Value:", currentValue);
//         document.getElementById('value').innerHTML = currentValue;
//     });
// }

// rateAlert()

async function readSpreadValues() {
    try {
        const uid = 'Tm9O3jd5jHMX4YGkIecSZcDMG5m1';
        if (!uid) {
            console.error('User not authenticated');
            throw new Error('User not authenticated');
        }

        const spreadCollection = collection(firestore, `users/${uid}/spread`);
        const querySnapshot = await getDocs(spreadCollection);

        const spreadDataArray = [];
        querySnapshot.forEach((doc) => {
            const spreadData = doc.data();
            const spreadDocId = doc.id;
            spreadDataArray.push({ id: spreadDocId, data: spreadData });
        });

        // console.log(spreadDataArray);

        return spreadDataArray;
    } catch (error) {
        console.error('Error reading data from Firestore: ', error);
        throw error;
    }
}

async function displaySpreadValues() {
    try {
        const spreadDataArray = await readSpreadValues();

        spreadDataArray.forEach((spreadData) => {
            askSpread = spreadData.data.editedAskSpreadValue || 0;
            bidSpread = spreadData.data.editedBidSpreadValue || 0;
            silverAskSpread = spreadData.data.editedAskSilverSpreadValue || 0;
            silverBidSpread = spreadData.data.editedBidSilverSpreadValue || 0;
        });
    } catch (error) {
        console.error('Error reading spread values: ', error);
        throw error;
    }
}

displaySpreadValues();

// Function to read data from the Firestore collection
async function readData() {
    // Get the UID of the authenticated user
    const uid = 'Tm9O3jd5jHMX4YGkIecSZcDMG5m1';

    if (!uid) {
        console.error('User not authenticated');
        return Promise.reject('User not authenticated');
    }

    const querySnapshot = await getDocs(collection(firestore, `users/${uid}/commodities`));
    const result = [];
    querySnapshot.forEach((doc) => {
        result.push({
            id: doc.id,
            data: doc.data()
        });
    });
    return result;
}


async function showTable() {
    try {
        const tableData = await readData();
        const tableBody = document.getElementById('tableBodyTV');

        // Loop through the tableData
        for (let i = 0; i < tableData.length; i++) {
            const data = tableData[i].data;
            const metalInput = data.metal;
            const purityInput = data.purity;
            const unitInput = data.unit;
            const weightInput = data.weight;
            const sellAEDInput = data.sellAED || 0;
            const buyAEDInput = data.buyAED || 0;
            const sellPremiumInputAED = data.sellPremiumAED || 0;
            const buyPremiumInputAED = data.buyPremiumAED || 0;


            // Adjust metalInput based on weightInput
            let metal, purity;

            if (weightInput === "KG") {
                metal = "Kilobar";
                purity = purityInput;
            } else if (metalInput === "Gold TEN TOLA") {
                metal = "TEN TOLA";
                purity = '';
            } else {
                metal = metalInput;
                purity = purityInput;
            }

            // Create a new table row
            const newRow = document.createElement("tr");
            newRow.innerHTML = `
                <td colspan="2" style="text-align: center;">${metal}<span style="font-size:10px; font-weight: 600;">${purity}</span></td>
                <td style="text-align: center;">${unitInput} ${weightInput}</td>
                <td id="sellAED_${i}" style="text-align: center;">0</td>
            `;

            // Append the new row to the table body
            tableBody.appendChild(newRow);

            // Create an empty row for spacing
            const emptyRow = document.createElement("tr");
            emptyRow.innerHTML = `<td colspan="5" style="height: 4px; border: none;"></td>`;
            tableBody.appendChild(emptyRow);

            displaySpreadValues();

            // Function to update values in the table
            const updateValues = async () => {
                let weight = weightInput;
                let unitMultiplier = 1;

                // Adjust unit multiplier based on the selected unit
                if (weight === "GM") {
                    unitMultiplier = 1;
                } else if (weight === "KG") {
                    unitMultiplier = 1000;
                } else if (weight === "TTB") {
                    unitMultiplier = 116.6400;
                } else if (weight === "TOLA") {
                    unitMultiplier = 11.664;
                } else if (weight === "OZ") {
                    unitMultiplier = 31.1034768;
                }

                let sellPremium = parseFloat(sellPremiumInputAED);
                let buyPremium = parseFloat(buyPremiumInputAED);
                let askSpreadValue = parseFloat(askSpread);
                let bidSpreadValue = parseFloat(bidSpread);

                if (weight === 'GM') {
                    // Update the sellAED and buyAED values for the current row
                    const sellAEDValue = (goldAskingPrice * unitInput * unitMultiplier * (purityInput / Math.pow(10, purityInput.length)) + sellPremium).toFixed(2);
                    const buyAEDValue = (goldBiddingPrice * unitInput * unitMultiplier * (purityInput / Math.pow(10, purityInput.length)) + buyPremium).toFixed(2);

                    // Set the values in the table
                    document.getElementById(`sellAED_${i}`).innerText = sellAEDValue;
                    // document.getElementById(`buyAED_${i}`).innerText = buyAEDValue;
                } else {
                    // Update the sellAED and buyAED values for the current row
                    const sellAEDValue = (goldAskingPrice * unitInput * unitMultiplier * (purityInput / Math.pow(10, purityInput.length)) + sellPremium).toFixed(0);
                    const buyAEDValue = (goldBiddingPrice * unitInput * unitMultiplier * (purityInput / Math.pow(10, purityInput.length)) + buyPremium).toFixed(0);

                    // Set the values in the table
                    document.getElementById(`sellAED_${i}`).innerText = sellAEDValue;
                    // document.getElementById(`buyAED_${i}`).innerText = buyAEDValue;
                }
            };

            // Call updateValues initially
            updateValues();

            // Update values every 500 milliseconds
            setInterval(updateValues, 500);
        }
    } catch (error) {
        console.error('Error reading data:', error);
    }
}
