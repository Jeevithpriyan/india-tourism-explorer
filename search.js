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
