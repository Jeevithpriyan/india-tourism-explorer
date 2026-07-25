/*==========================================================
        INCREDIBLE INDIA EXPLORER
                    app.js
==========================================================*/

"use strict";

/*==========================================================
                    SELECTORS
==========================================================*/

const header = document.querySelector("header");
const menu = document.querySelector(".menu");
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelectorAll(".menu a");
const revealElements = document.querySelectorAll(".reveal");

/*==========================================================
                STICKY NAVBAR
==========================================================*/

window.addEventListener("scroll", () => {

    if(window.scrollY > 80){

        header.classList.add("scrolled");

    }

    else{

        header.classList.remove("scrolled");

    }

});

/*==========================================================
                MOBILE MENU
==========================================================*/

if(menuToggle){

menuToggle.addEventListener("click",()=>{

menu.classList.toggle("active");

});

}

/*==========================================================
            CLOSE MENU WHEN LINK CLICKED
==========================================================*/

navLinks.forEach(link=>{

link.addEventListener("click",()=>{

menu.classList.remove("active");

});

});

/*==========================================================
                ACTIVE NAV LINK
==========================================================*/

navLinks.forEach(link=>{

link.addEventListener("click",()=>{

navLinks.forEach(item=>{

item.classList.remove("active");

});

link.classList.add("active");

});

});
/*==========================================================
                SMOOTH SCROLL
==========================================================*/

document.querySelectorAll('a[href^="#"]').forEach(anchor => {

    anchor.addEventListener("click", function(e){

        e.preventDefault();

        const target = document.querySelector(this.getAttribute("href"));

        if(target){

            target.scrollIntoView({

                behavior:"smooth",

                block:"start"

            });

        }

    });

});

/*==========================================================
                SCROLL REVEAL
==========================================================*/

function revealOnScroll(){

    const reveals = document.querySelectorAll(".reveal");

    reveals.forEach(item => {

        const windowHeight = window.innerHeight;

        const elementTop = item.getBoundingClientRect().top;

        const revealPoint = 120;

        if(elementTop < windowHeight - revealPoint){

            item.classList.add("active");

        }

    });

}

window.addEventListener("scroll", revealOnScroll);

window.addEventListener("load", revealOnScroll);

/*==========================================================
                BACK TO TOP BUTTON
==========================================================*/

const backToTop = document.createElement("button");

backToTop.innerHTML = "⬆";

backToTop.id = "backToTop";

document.body.appendChild(backToTop);

backToTop.style.cssText = `

position:fixed;
bottom:25px;
right:25px;
width:55px;
height:55px;
border:none;
border-radius:50%;
background:#2563EB;
color:white;
font-size:22px;
cursor:pointer;
display:none;
z-index:9999;
box-shadow:0 10px 25px rgba(0,0,0,.25);
transition:.3s;

`;

window.addEventListener("scroll",()=>{

if(window.scrollY>400){

backToTop.style.display="block";

}else{

backToTop.style.display="none";

}

});

backToTop.addEventListener("click",()=>{

window.scrollTo({

top:0,

behavior:"smooth"

});

});
/*==========================================================
                SCROLL PROGRESS BAR
==========================================================*/

const progressBar = document.createElement("div");

progressBar.id = "progressBar";

document.body.appendChild(progressBar);

progressBar.style.cssText = `
position:fixed;
top:0;
left:0;
width:0%;
height:4px;
background:linear-gradient(90deg,#2563EB,#10B981,#F97316);
z-index:10000;
transition:width .15s linear;
`;

window.addEventListener("scroll",()=>{

const scrollTop =
document.documentElement.scrollTop;

const scrollHeight =
document.documentElement.scrollHeight -
document.documentElement.clientHeight;

const progress =
(scrollTop/scrollHeight)*100;

progressBar.style.width =
progress + "%";

});

/*==========================================================
            ACTIVE NAVIGATION ON SCROLL
==========================================================*/

const sections =
document.querySelectorAll("section");

window.addEventListener("scroll",()=>{

let current = "";

sections.forEach(section=>{

const sectionTop =
section.offsetTop-150;

const sectionHeight =
section.clientHeight;

if(pageYOffset >= sectionTop){

current = section.getAttribute("id");

}

});

navLinks.forEach(link=>{

link.classList.remove("active");

const href = link.getAttribute("href");

if(href === "#" + current){

link.classList.add("active");

}

});

});

/*==========================================================
                NAVBAR AUTO HIDE
==========================================================*/

let lastScroll = 0;

window.addEventListener("scroll",()=>{

const currentScroll =
window.pageYOffset;

if(currentScroll <= 0){

header.style.transform =
"translateY(0)";

return;

}

if(currentScroll > lastScroll &&
currentScroll > 150){

header.style.transform =
"translateY(-100%)";

}else{

header.style.transform =
"translateY(0)";

}

lastScroll = currentScroll;

});

/*==========================================================
            PAGE LOADED ANIMATION
==========================================================*/

window.addEventListener("load",()=>{

document.body.style.opacity="0";

setTimeout(()=>{

document.body.style.transition=
"opacity .8s ease";

document.body.style.opacity="1";

},100);

});
/*==========================================================
                ANIMATED COUNTERS
==========================================================*/

const counters = document.querySelectorAll(".counter");

function animateCounters() {

    counters.forEach(counter => {

        const target = Number(counter.dataset.target);

        if (!target) return;

        let current = 0;

        const increment = Math.ceil(target / 100);

        const updateCounter = () => {

            current += increment;

            if (current >= target) {

                counter.textContent = target.toLocaleString();

                return;

            }

            counter.textContent = current.toLocaleString();

            requestAnimationFrame(updateCounter);

        };

        updateCounter();

    });

}

const counterSection = document.querySelector(".hero-stats");

if (counterSection) {

    const counterObserver = new IntersectionObserver(entries => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                animateCounters();

                counterObserver.disconnect();

            }

        });

    }, {

        threshold: 0.4

    });

    counterObserver.observe(counterSection);

}

/*==========================================================
                IMAGE LAZY LOADING
==========================================================*/

const images = document.querySelectorAll("img[data-src]");

const imageObserver = new IntersectionObserver(entries => {

    entries.forEach(entry => {

        if (!entry.isIntersecting) return;

        const img = entry.target;

        img.src = img.dataset.src;

        img.removeAttribute("data-src");

        imageObserver.unobserve(img);

    });

});

images.forEach(img => {

    imageObserver.observe(img);

});

/*==========================================================
                SIMPLE PARALLAX
==========================================================*/

const hero = document.querySelector(".hero");

window.addEventListener("scroll", () => {

    if (!hero) return;

    const offset = window.pageYOffset;

    hero.style.backgroundPositionY = `${offset * 0.4}px`;

});

/*==========================================================
                PAGE VISIBILITY
==========================================================*/

document.addEventListener("visibilitychange", () => {

    if (document.hidden) {

        document.title = "👋 Come back to Incredible India Explorer!";

    } else {

        document.title = "Incredible India Explorer";

    }

});

/*==========================================================
                PERFORMANCE
==========================================================*/

window.addEventListener("load", () => {

    console.log("🚀 Incredible India Explorer Loaded Successfully");

});
/*==========================================================
                NETWORK STATUS
==========================================================*/

function updateNetworkStatus() {

    const banner = document.getElementById("networkStatus");

    if (!banner) return;

    if (navigator.onLine) {

        banner.textContent = "🟢 You are online";

        banner.className = "online";

        setTimeout(() => {

            banner.style.display = "none";

        }, 3000);

    } else {

        banner.style.display = "block";

        banner.textContent = "🔴 You are offline";

        banner.className = "offline";

    }

}

window.addEventListener("online", updateNetworkStatus);
window.addEventListener("offline", updateNetworkStatus);
window.addEventListener("load", updateNetworkStatus);

/*==========================================================
                KEYBOARD SHORTCUTS
==========================================================*/

document.addEventListener("keydown", (event) => {

    // Press "/" to focus the search input
    if (event.key === "/" && !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) {

        event.preventDefault();

        const searchInput = document.querySelector(".search-container input");

        if (searchInput) {

            searchInput.focus();

        }

    }

    // Press Escape to close the mobile menu
    if (event.key === "Escape") {

        menu.classList.remove("active");

    }

});

/*==========================================================
                SIMPLE TOAST MESSAGE
==========================================================*/

function showToast(message) {

    const toast = document.createElement("div");

    toast.className = "toast";

    toast.textContent = message;

    document.body.appendChild(toast);

    Object.assign(toast.style, {

        position: "fixed",
        bottom: "30px",
        left: "50%",
        transform: "translateX(-50%)",
        background: "#2563EB",
        color: "#fff",
        padding: "14px 24px",
        borderRadius: "10px",
        boxShadow: "0 10px 25px rgba(0,0,0,.25)",
        zIndex: "10001",
        opacity: "0",
        transition: "opacity .3s ease"

    });

    requestAnimationFrame(() => {

        toast.style.opacity = "1";

    });

    setTimeout(() => {

        toast.style.opacity = "0";

        setTimeout(() => toast.remove(), 300);

    }, 2500);

}

/*==========================================================
                COPY TO CLIPBOARD
==========================================================*/

async function copyText(text) {

    try {

        await navigator.clipboard.writeText(text);

        showToast("Copied to clipboard!");

    } catch (error) {

        console.error("Copy failed:", error);

    }

}
/*==========================================================
                HELPER FUNCTIONS
==========================================================*/

function $(selector) {
    return document.querySelector(selector);
}

function $all(selector) {
    return document.querySelectorAll(selector);
}

/*==========================================================
                PRELOADER
==========================================================*/

window.addEventListener("load", () => {

    const loader = $("#loader");

    if (loader) {

        loader.style.opacity = "0";

        setTimeout(() => {

            loader.remove();

        }, 500);

    }

});

/*==========================================================
                RESIZE HANDLER
==========================================================*/

window.addEventListener("resize", () => {

    if (window.innerWidth > 768 && menu) {

        menu.classList.remove("active");

    }

});

/*==========================================================
                GLOBAL ERROR LOGGER
==========================================================*/

window.addEventListener("error", (event) => {

    console.error(
        "Application Error:",
        event.message
    );

});

/*==========================================================
                APPLICATION STARTUP
==========================================================*/

function initializeApp() {

    console.log("===================================");

    console.log("🇮🇳 Incredible India Explorer");

    console.log("Version : 3.0");

    console.log("Status  : Running");

    console.log("===================================");

    revealOnScroll();

    updateNetworkStatus();

}

document.addEventListener("DOMContentLoaded", initializeApp);

/*==========================================================
                END OF APP.JS
==========================================================*/
