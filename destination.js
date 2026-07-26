/*==========================================================
        DESTINATION PAGE
==========================================================*/

"use strict";

let destinationData = null;

/*==========================================================
                URL PARAMETER
==========================================================*/

function getPlaceName(){

    const params = new URLSearchParams(

        window.location.search

    );

    return params.get("place");

}

/*==========================================================
            LOAD DESTINATIONS
==========================================================*/

async function loadDestination(){

    try{

        const response = await fetch(

            "data/places.json"

        );

        const places = await response.json();

        const placeName = getPlaceName();

        destinationData = places.find(

            place =>

            place.name.toLowerCase()

            ===

            placeName.toLowerCase()

        );

        if(!destinationData){

            showNotFound();

            return;

        }

        renderDestination();

    }

    catch(error){

        console.error(error);

    }

}

/*==========================================================
                NOT FOUND
==========================================================*/

function showNotFound(){

    document.body.innerHTML=`

    <div style="padding:80px;text-align:center">

    <h1>Destination Not Found 😔</h1>

    <a href="index.html">

    Go Back

    </a>

    </div>

    `;

}

window.addEventListener(

"DOMContentLoaded",

loadDestination

);
