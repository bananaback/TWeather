// Cards moving logic
const cardStack = document.getElementById("card-stack");
const cards = Array.from(cardStack.getElementsByClassName("card"));
let canSlideCard = true;
const slideCardCooldown = 220;
const slideCard = function (event) {
    if (!canSlideCard) return;
    canSlideCard = false;
    setTimeout(() => { canSlideCard = true }, slideCardCooldown);
    const clickedCard = event.target.closest(".card");
    if (!clickedCard) return;
    if (clickedCard.dataset.pos == 0) {
        return;
    }

    if (clickedCard.dataset.pos == -1) {
        cards.forEach(card => {
            card.dataset.pos++;
            if (card.dataset.pos > 1) {
                card.dataset.pos = -1;
            }
        });
    } else {
        cards.forEach(card => {
            card.dataset.pos--;
            if (card.dataset.pos < -1) {
                card.dataset.pos = 1;
            }
        });
    }
}
cardStack.addEventListener("click", slideCard);

// Location display
const cityNameDiv = document.getElementById("city-name-label");
function updateLocationDisplay() {
    cityNameDiv.textContent = locationAddress;
}

// Calendar display
const calendar = document.querySelector('.calendar');
const days = Array.from(calendar.getElementsByClassName('day'));
// Remove/Add selected effect
function removeDaySelectedClass() {
    days.forEach(day => {
        day.classList.remove("selected");
    });
}
function addDaySelectedClass() {
    days[currentSelect].classList.add("selected");
}

// Calendar date moving logic
const leftButton = document.querySelector(".calendar-btn.left");
leftButton.addEventListener('click', function (event) {
    if (currentSelect <= minIndex) return;
    removeDaySelectedClass();
    currentSelect--;
    addDaySelectedClass(currentSelect);
    // Update position and style
    transformDayStack();
    updateStackElementOpacity();
    serveCardStack();
});

const rightButton = document.querySelector(".calendar-btn.right");
rightButton.addEventListener('click', function (event) {
    if (currentSelect >= maxIndex) return;
    removeDaySelectedClass();
    currentSelect++;
    addDaySelectedClass(currentSelect);
    // Update position and style
    transformDayStack();
    updateStackElementOpacity();
    serveCardStack();
});


let currentSelect = 7;
const minIndex = 0, maxIndex = 14;

// 0 1 2 3 4 5 6 7 8 9 10 11 12 13 14
// 7 6 5 4 3 2 1 0-1-2 -3 -4 -5 -6 -7

function transformDayStack() {
    for (let i = 0; i < days.length; i++) {
        const xPos = -840 + i * 120 + (7 - currentSelect) * 120;
        days[i].style.transform = `translateX(${xPos}%)`;
    }
}
function updateStackElementOpacity() {
    days[currentSelect].style.opacity = 1;
    let i = currentSelect - 1;
    let j = currentSelect + 1;
    while (i >= minIndex) {
        let op = 1 - 0.25 * Math.abs(i - currentSelect);
        days[i].style.opacity = '' + op;
        i--;
    }
    while (j <= maxIndex) {
        let op = 1 - 0.25 * Math.abs(j - currentSelect);
        days[j].style.opacity = '' + op;
        j++;
    }
}

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function serveCalendarDateMonth() {
    weatherObject.forEach(function (value, index) {
        let dayUI = days[index].querySelector(".date");
        let monthUI = days[index].querySelector(".month");
        const [, month, day] = value.datetime.split('-');
        const monthString = monthNames[parseInt(month, 10) - 1];
        monthUI.textContent = monthString;
        dayUI.textContent = day;
    });
}

const loaders = Array.from(document.getElementsByClassName("loader"));
function updateLoader() {
    loaders.forEach(loader => {
        loader.style.display = loading ? "flex" : "none";
    })
}

const daytimes = Array.from(document.getElementsByClassName("daytime"));
const hours = Array.from(document.getElementsByClassName("hours"));

function setLocationDisplay(location) {
    cityNameDiv.textContent = location;
}

function resetSearchbox() {
    search.value = '';
}

function resetTitle() {
    setLocationDisplay('Please wait');
    resetSearchbox();
}

function resetCardPos() {
    cards.forEach(card => {
        card.dataset.pos = 0;
    })
}

const svgDictionary = {
    morningSunny: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>weather-sunny</title><path d="M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,2L14.39,5.42C13.65,5.15 12.84,5 12,5C11.16,5 10.35,5.15 9.61,5.42L12,2M3.34,7L7.5,6.65C6.9,7.16 6.36,7.78 5.94,8.5C5.5,9.24 5.25,10 5.11,10.79L3.34,7M3.36,17L5.12,13.23C5.26,14 5.53,14.78 5.95,15.5C6.37,16.24 6.91,16.86 7.5,17.37L3.36,17M20.65,7L18.88,10.79C18.74,10 18.47,9.23 18.05,8.5C17.63,7.78 17.1,7.15 16.5,6.64L20.65,7M20.64,17L16.5,17.36C17.09,16.85 17.62,16.22 18.04,15.5C18.46,14.77 18.73,14 18.87,13.21L20.64,17M12,22L9.59,18.56C10.33,18.83 11.14,19 12,19C12.82,19 13.63,18.83 14.37,18.56L12,22Z" /></svg>`,
    morningCloudy: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>weather-cloudy</title><path d="M6,19A5,5 0 0,1 1,14A5,5 0 0,1 6,9C7,6.65 9.3,5 12,5C15.43,5 18.24,7.66 18.5,11.03L19,11A4,4 0 0,1 23,15A4,4 0 0,1 19,19H6M19,13H17V12A5,5 0 0,0 12,7C9.5,7 7.45,8.82 7.06,11.19C6.73,11.07 6.37,11 6,11A3,3 0 0,0 3,14A3,3 0 0,0 6,17H19A2,2 0 0,0 21,15A2,2 0 0,0 19,13Z" /></svg>`,
    morningRainy: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>weather-pouring</title><path d="M9,12C9.53,12.14 9.85,12.69 9.71,13.22L8.41,18.05C8.27,18.59 7.72,18.9 7.19,18.76C6.65,18.62 6.34,18.07 6.5,17.54L7.78,12.71C7.92,12.17 8.47,11.86 9,12M13,12C13.53,12.14 13.85,12.69 13.71,13.22L11.64,20.95C11.5,21.5 10.95,21.8 10.41,21.66C9.88,21.5 9.56,20.97 9.7,20.43L11.78,12.71C11.92,12.17 12.47,11.86 13,12M17,12C17.53,12.14 17.85,12.69 17.71,13.22L16.41,18.05C16.27,18.59 15.72,18.9 15.19,18.76C14.65,18.62 14.34,18.07 14.5,17.54L15.78,12.71C15.92,12.17 16.47,11.86 17,12M17,10V9A5,5 0 0,0 12,4C9.5,4 7.45,5.82 7.06,8.19C6.73,8.07 6.37,8 6,8A3,3 0 0,0 3,11C3,12.11 3.6,13.08 4.5,13.6V13.59C5,13.87 5.14,14.5 4.87,14.96C4.59,15.43 4,15.6 3.5,15.32V15.33C2,14.47 1,12.85 1,11A5,5 0 0,1 6,6C7,3.65 9.3,2 12,2C15.43,2 18.24,4.66 18.5,8.03L19,8A4,4 0 0,1 23,12C23,13.5 22.2,14.77 21,15.46V15.46C20.5,15.73 19.91,15.57 19.63,15.09C19.36,14.61 19.5,14 20,13.72V13.73C20.6,13.39 21,12.74 21,12A2,2 0 0,0 19,10H17Z" /></svg>`,
    eveningClear: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>weather-night</title><path d="M17.75,4.09L15.22,6.03L16.13,9.09L13.5,7.28L10.87,9.09L11.78,6.03L9.25,4.09L12.44,4L13.5,1L14.56,4L17.75,4.09M21.25,11L19.61,12.25L20.2,14.23L18.5,13.06L16.8,14.23L17.39,12.25L15.75,11L17.81,10.95L18.5,9L19.19,10.95L21.25,11M18.97,15.95C19.8,15.87 20.69,17.05 20.16,17.8C19.84,18.25 19.5,18.67 19.08,19.07C15.17,23 8.84,23 4.94,19.07C1.03,15.17 1.03,8.83 4.94,4.93C5.34,4.53 5.76,4.17 6.21,3.85C6.96,3.32 8.14,4.21 8.06,5.04C7.79,7.9 8.75,10.87 10.95,13.06C13.14,15.26 16.1,16.22 18.97,15.95M17.33,17.97C14.5,17.81 11.7,16.64 9.53,14.5C7.36,12.31 6.2,9.5 6.04,6.68C3.23,9.82 3.34,14.64 6.35,17.66C9.37,20.67 14.19,20.78 17.33,17.97Z" /></svg>`,
    eveningCloudy: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>weather-night-partly-cloudy</title><path d="M22,10.28C21.74,10.3 21.5,10.31 21.26,10.31C19.32,10.31 17.39,9.57 15.91,8.09C14.25,6.44 13.5,4.19 13.72,2C13.77,1.53 13.22,1 12.71,1C12.57,1 12.44,1.04 12.32,1.12C12,1.36 11.66,1.64 11.36,1.94C9.05,4.24 8.55,7.66 9.84,10.46C8.31,11.11 7.13,12.43 6.69,14.06L6,14A4,4 0 0,0 2,18A4,4 0 0,0 6,22H19A3,3 0 0,0 22,19A3,3 0 0,0 19,16C18.42,16 17.88,16.16 17.42,16.45L17.5,15.5C17.5,15.28 17.5,15.05 17.46,14.83C19.14,14.67 20.77,13.94 22.06,12.64C22.38,12.34 22.64,12 22.88,11.68C23.27,11.13 22.65,10.28 22.04,10.28M19,18A1,1 0 0,1 20,19A1,1 0 0,1 19,20H6A2,2 0 0,1 4,18A2,2 0 0,1 6,16H8.5V15.5C8.5,13.94 9.53,12.64 10.94,12.18C11.1,12.13 11.26,12.09 11.43,12.06C11.61,12.03 11.8,12 12,12C12.23,12 12.45,12.03 12.66,12.07C12.73,12.08 12.8,12.1 12.87,12.13C13,12.16 13.15,12.2 13.28,12.25C13.36,12.28 13.44,12.32 13.5,12.36C13.63,12.41 13.74,12.47 13.84,12.54C13.92,12.59 14,12.64 14.07,12.7C14.17,12.77 14.25,12.84 14.34,12.92C14.41,13 14.5,13.05 14.55,13.12C14.63,13.2 14.69,13.29 14.76,13.37C14.82,13.45 14.89,13.53 14.94,13.62C15,13.71 15.04,13.8 15.09,13.9C15.14,14 15.2,14.08 15.24,14.18C15.41,14.59 15.5,15.03 15.5,15.5V18M16.83,12.86C15.9,11.16 14.08,10 12,10H11.87C11.41,9.19 11.14,8.26 11.14,7.29C11.14,6.31 11.39,5.37 11.86,4.55C12.21,6.41 13.12,8.14 14.5,9.5C15.86,10.88 17.58,11.79 19.45,12.14C18.66,12.6 17.76,12.84 16.83,12.86Z" /></svg>`,
    eveningOvercast: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>weather-rainy</title><path d="M6,14.03A1,1 0 0,1 7,15.03C7,15.58 6.55,16.03 6,16.03C3.24,16.03 1,13.79 1,11.03C1,8.27 3.24,6.03 6,6.03C7,3.68 9.3,2.03 12,2.03C15.43,2.03 18.24,4.69 18.5,8.06L19,8.03A4,4 0 0,1 23,12.03C23,14.23 21.21,16.03 19,16.03H18C17.45,16.03 17,15.58 17,15.03C17,14.47 17.45,14.03 18,14.03H19A2,2 0 0,0 21,12.03A2,2 0 0,0 19,10.03H17V9.03C17,6.27 14.76,4.03 12,4.03C9.5,4.03 7.45,5.84 7.06,8.21C6.73,8.09 6.37,8.03 6,8.03A3,3 0 0,0 3,11.03A3,3 0 0,0 6,14.03M12,14.15C12.18,14.39 12.37,14.66 12.56,14.94C13,15.56 14,17.03 14,18C14,19.11 13.1,20 12,20A2,2 0 0,1 10,18C10,17.03 11,15.56 11.44,14.94C11.63,14.66 11.82,14.4 12,14.15M12,11.03L11.5,11.59C11.5,11.59 10.65,12.55 9.79,13.81C8.93,15.06 8,16.56 8,18A4,4 0 0,0 12,22A4,4 0 0,0 16,18C16,16.56 15.07,15.06 14.21,13.81C13.35,12.55 12.5,11.59 12.5,11.59" /></svg>`
}

// Function to find the closest match key from the svgDictionary based on weather condition
function findClosestMatch(weatherCondition) {
    const keys = Object.keys(svgDictionary);

    let closestMatch = keys[0];
    let closestMatchScore = Number.MAX_SAFE_INTEGER;

    for (const key of keys) {
        const currentScore = levenshteinDistance(weatherCondition.toLowerCase(), key.toLowerCase());
        if (currentScore < closestMatchScore) {
            closestMatch = key;
            closestMatchScore = currentScore;
        }
    }

    return closestMatch;
}

// Function to calculate Levenshtein distance (string similarity)
function levenshteinDistance(a, b) {
    const dp = Array.from({ length: a.length + 1 }, (_, i) => Array(b.length + 1).fill(0));

    for (let i = 0; i <= a.length; i++) {
        dp[i][0] = i;
    }

    for (let j = 0; j <= b.length; j++) {
        dp[0][j] = j;
    }

    for (let i = 1; i <= a.length; i++) {
        for (let j = 1; j <= b.length; j++) {
            const cost = a[i - 1] === b[j - 1] ? 0 : 1;
            dp[i][j] = Math.min(
                dp[i - 1][j] + 1,
                dp[i][j - 1] + 1,
                dp[i - 1][j - 1] + cost
            );
        }
    }

    return dp[a.length][b.length];
}

function setCardContent(card, temp = '', daytime = '', hours = '', conditions = '', weatherIcon = '') {
    card.querySelector(".temperature").textContent = temp + (temp ? "°C" : "");
    card.querySelector(".daytime").textContent = daytime;
    card.querySelector(".hours").textContent = hours;
    card.querySelector(".conditions").textContent = conditions;
    card.querySelector(".weather-icon").innerHTML = svgDictionary[findClosestMatch(daytime + weatherIcon)];
}

function resetCardsContent() {
    cards.forEach(card => {
        setCardContent(card);
    })
}

function resetCardStack() {
    resetCardPos();
    resetCardsContent();
}

function resetDateMonth() {
    days.forEach(day => {
        day.querySelector(".date").textContent = '';
        day.querySelector(".month").textContent = '';
    })
}

function resetCalendar() {
    resetDateMonth();
    currentSelect = 0;
}

function resetUI() {
    resetTitle();
    resetCardStack();
    resetCalendar();
    updateLoader();
}

function serveTitle() {
    setLocationDisplay(locationAddress);
}

function serveCard() {
    cards.find(card => card.id == "morning").dataset.pos = -1;
    cards.find(card => card.id == "afternoon").dataset.pos = 0;
    cards.find(card => card.id == "evening").dataset.pos = 1;
}

function serveCardStack() {
    let {
        forecasts: {
            morning,
            afternoon,
            evening
        }
    } = weatherObject[currentSelect];
    setCardContent(cards.find(card => card.id == "morning"), morning.morningForecast, "Morning", "6:00", morning.c1, morning.i1);
    setCardContent(cards.find(card => card.id == "afternoon"), afternoon.afternoonForecast, "Afternoon", "14:00", afternoon.c2, afternoon.i2);
    setCardContent(cards.find(card => card.id == "evening"), evening.eveningForecast, "Evening", "22:00", evening.c3, evening.i3);
    serveCard();
}

function serveCalendar() {
    // Update position and style
    transformDayStack();
    updateStackElementOpacity();
    // Update content
    serveCalendarDateMonth();
    addDaySelectedClass();
}

function serveUI() {
    serveTitle();
    serveCardStack();
    serveCalendar();
}



const search = document.getElementById("search");
search.addEventListener("keyup", async (event) => {
    if (!loading && event.code === "Enter") {
        loading = true;
        const value = event.target.value;
        resetUI();
        await updateData(value);
        serveUI();
    }
})


const MY_API_KEY = 'JDX9AMV4P6DXUVBM7RRPXEC9A';
let weatherObject = [];
let locationAddress = "";

async function getWeather(location) {
    const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=metric&key=${MY_API_KEY}&contentType=json`, { mode: 'cors' });
    if (!response.ok) {
        throw new Error(response.status + ' ' + response.statusText)
    } else {
        const data = await response.json();
        return data;
    }
}

let loading = false;

async function updateData(locationAddr) {
    try {
        const data = await getWeather(locationAddr);
        const { resolvedAddress, days } = data;
        locationAddress = resolvedAddress;
        const formattedDays = days.map(({ datetime, hours }) => {
            const {
                [6]: { temp: morningForecast, conditions: c1, icon: i1 },
                [14]: { temp: afternoonForecast, conditions: c2, icon: i2 },
                [22]: { temp: eveningForecast, conditions: c3, icon: i3 } } = hours;
            return {
                datetime,
                forecasts: {
                    morning: {
                        morningForecast,
                        c1,
                        i1
                    },
                    afternoon: {
                        afternoonForecast,
                        c2,
                        i2
                    },
                    evening: {
                        eveningForecast,
                        c3,
                        i3
                    }
                }
            };
        })
        weatherObject = formattedDays.slice();
    } catch (error) {
        console.log(error);
        alert(error);
    } finally {
        loading = false;
        updateLoader();
    }
}

function initialize() {
    cityNameDiv.textContent = "Select a location";
}

initialize();