/*==========================================================
        INCREDIBLE INDIA EXPLORER
                theme.js
==========================================================*/

"use strict";

/*==========================================================
                SELECT ELEMENTS
==========================================================*/

const themeToggle = document.getElementById("themeToggle");

const body = document.body;

/*==========================================================
                APPLY THEME
==========================================================*/

function applyTheme(theme){

    if(theme === "dark"){

        body.classList.add("dark");

        if(themeToggle){

            themeToggle.innerHTML = "☀️";

            themeToggle.title = "Switch to Light Mode";

        }

    }else{

        body.classList.remove("dark");

        if(themeToggle){

            themeToggle.innerHTML = "🌙";

            themeToggle.title = "Switch to Dark Mode";

        }

    }

}

/*==========================================================
                SAVE THEME
==========================================================*/

function saveTheme(theme){

    localStorage.setItem("theme",theme);

}

/*==========================================================
                LOAD SAVED THEME
==========================================================*/

function loadTheme(){

    const savedTheme = localStorage.getItem("theme");

    if(savedTheme){

        applyTheme(savedTheme);

        return;

    }

    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    applyTheme(prefersDark ? "dark" : "light");

}
/*==========================================================
                TOGGLE THEME
==========================================================*/

function toggleTheme(){

    const isDark = body.classList.contains("dark");

    const newTheme = isDark ? "light" : "dark";

    applyTheme(newTheme);

    saveTheme(newTheme);

    showThemeToast(newTheme);

}

/*==========================================================
                THEME BUTTON
==========================================================*/

if(themeToggle){

    themeToggle.addEventListener("click",toggleTheme);

}

/*==========================================================
            SYSTEM THEME CHANGES
==========================================================*/

const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

mediaQuery.addEventListener("change",(event)=>{

    const savedTheme = localStorage.getItem("theme");

    if(savedTheme){

        return;

    }

    applyTheme(event.matches ? "dark" : "light");

});

/*==========================================================
                THEME TOAST
==========================================================*/

function showThemeToast(theme){

    const toast = document.createElement("div");

    toast.className = "theme-toast";

    toast.textContent =

    theme === "dark"

    ? "🌙 Dark Mode Enabled"

    : "☀️ Light Mode Enabled";

    Object.assign(toast.style,{

        position:"fixed",

        top:"20px",

        right:"20px",

        padding:"14px 22px",

        background:"#2563EB",

        color:"#fff",

        borderRadius:"12px",

        boxShadow:"0 10px 30px rgba(0,0,0,.25)",

        zIndex:"10000",

        opacity:"0",

        transition:"all .35s ease"

    });

    document.body.appendChild(toast);

    requestAnimationFrame(()=>{

        toast.style.opacity="1";

    });

    setTimeout(()=>{

        toast.style.opacity="0";

        setTimeout(()=>{

            toast.remove();

        },350);

    },2200);

}
/*==========================================================
                INITIALIZE THEME
==========================================================*/

document.addEventListener("DOMContentLoaded", () => {

    loadTheme();

});

/*==========================================================
            KEYBOARD ACCESSIBILITY
==========================================================*/

if(themeToggle){

    themeToggle.setAttribute("role","button");

    themeToggle.setAttribute("tabindex","0");

    themeToggle.setAttribute("aria-label","Toggle Dark Mode");

    themeToggle.addEventListener("keydown",(event)=>{

        if(event.key==="Enter" || event.key===" "){

            event.preventDefault();

            toggleTheme();

        }

    });

}

/*==========================================================
            SYNC BETWEEN BROWSER TABS
==========================================================*/

window.addEventListener("storage",(event)=>{

    if(event.key==="theme"){

        applyTheme(event.newValue || "light");

    }

});

/*==========================================================
            FALLBACK SUPPORT
==========================================================*/

try{

    loadTheme();

}catch(error){

    console.error("Theme initialization failed:",error);

    applyTheme("light");

}

/*==========================================================
            SMOOTH THEME TRANSITION
==========================================================*/

window.addEventListener("load",()=>{

    document.body.style.transition=

    "background .35s ease,color .35s ease";

});

/*==========================================================
                END OF THEME.JS
==========================================================*/
