/*==========================================================
        INCREDIBLE INDIA EXPLORER
                search.js
==========================================================*/

"use strict";

/*==========================================================
                VARIABLES
==========================================================*/

let destinations = [];

let filteredDestinations = [];

const searchBox = document.getElementById("destinationSearch");

const suggestionBox = document.getElementById("suggestionBox");

const resultsContainer = document.getElementById("searchResults");

/*==========================================================
            LOAD DESTINATIONS
==========================================================*/

async function loadDestinations(){

    try{

        const response = await fetch("data/places.json");

        if(!response.ok){

            throw new Error("Unable to load destination data.");

        }

        destinations = await response.json();

        filteredDestinations = destinations;

        console.log(

            "Loaded",

            destinations.length,

            "destinations"

        );

    }

    catch(error){

        console.error(error);

    }

}

/*==========================================================
            INITIALIZATION
==========================================================*/

window.addEventListener("DOMContentLoaded",()=>{

    loadDestinations();

});
/*==========================================================
                LIVE SEARCH
==========================================================*/

function searchDestinations(query){

    query = query.trim().toLowerCase();

    if(query === ""){

        filteredDestinations = destinations;

        displaySuggestions([]);

        return;

    }

    filteredDestinations = destinations.filter(place=>{

        return (

            place.name.toLowerCase().includes(query) ||

            place.state.toLowerCase().includes(query) ||

            place.type.toLowerCase().includes(query)

        );

    });

    displaySuggestions(filteredDestinations);

}

/*==========================================================
                INPUT LISTENER
==========================================================*/

if(searchBox){

    searchBox.addEventListener("input",(event)=>{

        searchDestinations(event.target.value);

    });

}

/*==========================================================
                DISPLAY SUGGESTIONS
==========================================================*/

function displaySuggestions(list){

    if(!suggestionBox) return;

    suggestionBox.innerHTML="";

    if(list.length===0){

        suggestionBox.innerHTML=`

<div class="suggestion-item">

No destinations found

</div>

`;

        return;

    }

    list.slice(0,8).forEach(place=>{

        suggestionBox.innerHTML+=`

<div class="suggestion-item"

onclick="selectDestination('${place.name}')">

📍 <strong>${place.name}</strong>

<br>

<small>${place.state} • ${place.type}</small>

</div>

`;

    });

}

/*==========================================================
            SELECT DESTINATION
==========================================================*/

function selectDestination(city){

    if(searchBox){

        searchBox.value=city;

    }

    suggestionBox.innerHTML="";

    if(typeof fetchWeather==="function"){
            
        increaseSearchCount(city);

        saveSearch(city);
            
        fetchWeather(city);

    }

}

/*==========================================================
                VOICE SEARCH
==========================================================*/

const SpeechRecognition =
window.SpeechRecognition ||
window.webkitSpeechRecognition;

if(SpeechRecognition){

    const recognition = new SpeechRecognition();

    recognition.lang = "en-IN";

    recognition.continuous = false;

    recognition.interimResults = false;

    const voiceButton =
    document.getElementById("voiceSearch");

    if(voiceButton){

        voiceButton.addEventListener("click",()=>{

            recognition.start();

        });

    }

    recognition.onresult=(event)=>{

        const text =
        event.results[0][0].transcript;

        searchBox.value=text;

        searchDestinations(text);

    };

}

/*==========================================================
                RECENT SEARCHES
==========================================================*/

function saveSearch(city){

    let history = JSON.parse(

        localStorage.getItem("recentSearches")

    ) || [];

    history = history.filter(

        item => item !== city

    );

    history.unshift(city);

    history = history.slice(0,10);

    localStorage.setItem(

        "recentSearches",

        JSON.stringify(history)

    );

}

function getRecentSearches(){

    return JSON.parse(

        localStorage.getItem("recentSearches")

    ) || [];

}

/*==========================================================
                FUZZY SEARCH
==========================================================*/

function fuzzyMatch(query,text){

    query=query.toLowerCase();

    text=text.toLowerCase();

    let i=0;

    for(let char of text){

        if(char===query[i]){

            i++;

        }

    }

    return i===query.length;

}

/*==========================================================
                IMPROVED SEARCH
==========================================================*/

function advancedSearch(query){

    query=query.trim().toLowerCase();

    filteredDestinations=

    destinations.filter(place=>{

        return(

            place.name.toLowerCase().includes(query)||

            place.state.toLowerCase().includes(query)||

            place.type.toLowerCase().includes(query)||

            fuzzyMatch(query,place.name)

        );

    });

    displaySuggestions(filteredDestinations);

}
/*==========================================================
                FAVORITE DESTINATIONS
==========================================================*/

let favoritePlaces = JSON.parse(

localStorage.getItem("favoritePlaces")

) || [];

function addFavoritePlace(place){

    if(!favoritePlaces.includes(place)){

        favoritePlaces.push(place);

        localStorage.setItem(

            "favoritePlaces",

            JSON.stringify(favoritePlaces)

        );

    }

}

function removeFavoritePlace(place){

    favoritePlaces =

    favoritePlaces.filter(item=>item!==place);

    localStorage.setItem(

        "favoritePlaces",

        JSON.stringify(favoritePlaces)

    );

}

/*==========================================================
                TRENDING DESTINATIONS
==========================================================*/

const trendingPlaces=[

"Goa",
"Ooty",
"Manali",
"Jaipur",
"Leh",
"Udaipur",
"Kodaikanal",
"Munnar",
"Darjeeling",
"Andaman"

];

/*==========================================================
            KEYBOARD NAVIGATION
==========================================================*/

let currentIndex=-1;

if(searchBox){

searchBox.addEventListener("keydown",(e)=>{

const items=

document.querySelectorAll(".suggestion-item");

if(!items.length) return;

if(e.key==="ArrowDown"){

e.preventDefault();

currentIndex++;

if(currentIndex>=items.length)

currentIndex=0;

updateSelection(items);

}

else if(e.key==="ArrowUp"){

e.preventDefault();

currentIndex--;

if(currentIndex<0)

currentIndex=items.length-1;

updateSelection(items);

}

else if(e.key==="Enter"){

if(currentIndex>=0){

items[currentIndex].click();

}

}

});

}

/*==========================================================
            UPDATE SELECTION
==========================================================*/

function updateSelection(items){

items.forEach(item=>

item.classList.remove("selected")

);

items[currentIndex]

.classList.add("selected");

items[currentIndex]

.scrollIntoView({

block:"nearest"

});

}

/*==========================================================
            POPULAR SEARCHES
==========================================================*/

function showTrending(){

displaySuggestions(

trendingPlaces.map(name=>{

return{

name:name,

state:"Popular",

type:"Trending"

};

})

);

}
/*==========================================================
                FILTER BY STATE
==========================================================*/

function filterByState(state){

    filteredDestinations = destinations.filter(place =>

        place.state.toLowerCase() === state.toLowerCase()

    );

    displaySuggestions(filteredDestinations);

}

/*==========================================================
                FILTER BY CATEGORY
==========================================================*/

function filterByCategory(category){

    filteredDestinations = destinations.filter(place =>

        place.type.toLowerCase() === category.toLowerCase()

    );

    displaySuggestions(filteredDestinations);

}

/*==========================================================
                SORT BY RATING
==========================================================*/

function sortByRating(){

    filteredDestinations.sort(

        (a,b)=>b.rating-a.rating

    );

    displaySuggestions(filteredDestinations);

}

/*==========================================================
            RANDOM DESTINATION
==========================================================*/

function randomDestination(){

    const random = destinations[

        Math.floor(

            Math.random() * destinations.length

        )

    ];

    if(searchBox){

        searchBox.value = random.name;

    }

    selectDestination(random.name);

}

/*==========================================================
            DISTANCE CALCULATION
==========================================================*/

function calculateDistance(

lat1,

lon1,

lat2,

lon2

){

const R = 6371;

const dLat =

(lat2-lat1)*Math.PI/180;

const dLon =

(lon2-lon1)*Math.PI/180;

const a =

Math.sin(dLat/2)**2+

Math.cos(lat1*Math.PI/180)*

Math.cos(lat2*Math.PI/180)*

Math.sin(dLon/2)**2;

const c =

2*Math.atan2(

Math.sqrt(a),

Math.sqrt(1-a)

);

return R*c;

}

/*==========================================================
            FIND NEARBY PLACES
==========================================================*/

function findNearbyPlaces(

latitude,

longitude,

radius=100

){

const nearby =

destinations.filter(place=>{

const distance =

calculateDistance(

latitude,

longitude,

place.latitude,

place.longitude

);

return distance<=radius;

});

displaySuggestions(nearby);

}
/*==========================================================
                DEBOUNCE SEARCH
==========================================================*/

let searchTimer;

function debounceSearch(query){

    clearTimeout(searchTimer);

    searchTimer = setTimeout(()=>{

        advancedSearch(query);

    },300);

}

/*==========================================================
                UPDATE INPUT LISTENER
==========================================================*/

if(searchBox){

    searchBox.removeEventListener("input",()=>{});

    searchBox.addEventListener("input",(event)=>{

        debounceSearch(event.target.value);

    });

}

/*==========================================================
                SEARCH SCORE
==========================================================*/

function calculateSearchScore(place,query){

    query = query.toLowerCase();

    let score = 0;

    if(place.name.toLowerCase()===query)
        score +=100;

    if(place.name.toLowerCase().startsWith(query))
        score +=60;

    if(place.name.toLowerCase().includes(query))
        score +=40;

    if(place.state.toLowerCase().includes(query))
        score +=20;

    if(place.type.toLowerCase().includes(query))
        score +=15;

    score += place.rating * 5;

    return score;

}

/*==========================================================
                SORT SEARCH RESULTS
==========================================================*/

function rankResults(query){

    filteredDestinations.sort((a,b)=>{

        return calculateSearchScore(b,query)

        -

        calculateSearchScore(a,query);

    });

}

/*==========================================================
                SEARCH ANALYTICS
==========================================================*/

function increaseSearchCount(city){

    let analytics = JSON.parse(

        localStorage.getItem("searchAnalytics")

    ) || {};

    analytics[city] =

    (analytics[city] || 0) + 1;

    localStorage.setItem(

        "searchAnalytics",

        JSON.stringify(analytics)

    );

}

/*==========================================================
                TOP SEARCHES
==========================================================*/

function getTopSearches(){

    const analytics = JSON.parse(

        localStorage.getItem("searchAnalytics")

    ) || {};

    return Object.entries(analytics)

    .sort((a,b)=>b[1]-a[1])

    .slice(0,5)

    .map(item=>item[0]);

}

/*==========================================================
                SEARCH HISTORY PANEL
==========================================================*/

function loadRecentHistory(){

    const history =

    getRecentSearches();

    if(history.length===0)

    return;

    console.log(

        "Recent Searches:",

        history

    );

}
