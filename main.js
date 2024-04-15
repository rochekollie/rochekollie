"use strict";

import {render} from "./modules/render.js";
import {getDate, getRandomColor, getContrastYIQ} from "./modules/utilities.js";

/**
 * Saves given data to the local storage.
 * @param key  - the key to save the data to.
 * @param data - the data to save.
 */
const saveDailyData = (key, data) => {
    localStorage.setItem(key, data);
};

/**
 * Retrieves data from the local storage.
 * @param key - the key to retrieve the data from.
 * @returns {object} - the data retrieved from the local storage.
 */
const getDailyData = (key) => {
    return localStorage.getItem(key);
};

/**
 * Runs a given function at the interval of a given time in milliseconds.
 * @param interval - The interval in to run the given callback function.
 * @param callback - The callback function to run at every interval.
 */
const setTimeInterval = (callback, interval) => {
    setInterval(() => {
        callback();
    }, interval);
};

// get the user location and set the language to the user location
const clientLocationLanguage = navigator.language || "en-US";


const date = document.getElementById("date");
// const time = document.getElementById("time"); / TURN OFF TEMPORARILY

//set initial date and time
date.textContent = getDate(clientLocationLanguage).shortDateText;
// time.textContent = getDate(clientLocationLanguage).shortTimeText; / TURN OFF TEMPORARILY

//update date and time every second
setTimeInterval(() => {
    try {
        date.textContent = getDate(clientLocationLanguage).shortDateText;
        // time.textContent = getDate(clientLocationLanguage).shortTimeText;   / TURN OFF TEMPORARILY
    } catch (error) {
        console.log(error);
    }
}, 1000);

/**
 * Gets a random quote from the API and returns the data in a JSON format.
 * @returns {Promise<Response>} - the data in a JSON format.
 */
const getDailyQuote = async () => {
    const characterLimit = 50;
    const promise = fetch(`https://api.quotable.io/random?maxLength=${characterLimit}`);
    const response = await promise;
    return await response.json();
};

/**
 * Checks if the current date is the same as the date saved in the local storage.
 * @returns {boolean} - true if the current date is the same as the date saved in the local storage.
 */
const isToday = () => {
    const currentDate = getDate("en-US").dateNumber;
    return currentDate === parseInt(getDailyData("dateNumber"), 10);
};

const imageElement = document.getElementById("page-background");
const quoteElement = document.getElementById("quote");
const quoteAuthor = document.getElementById("author");

//if the date changes, update the page
if (!isToday()) {
    const TOTAL_IMAGES = 100;
    const randomNumber = Math.floor(Math.random() * TOTAL_IMAGES + 1);
    const backgroundImage = `assets/images/backgrounds/dynamic/${randomNumber}.jpeg` || "assets/images/backgrounds/dynamic/35.jpeg";

    render(imageElement, backgroundImage);
    saveDailyData("dateNumber", getDate().dateNumber);
    saveDailyData("backgroundImage", backgroundImage);

    getDailyQuote().then(response => {
        const {author, content} = response;
        render(quoteElement, content || "We make our own fortunes and we call them fate.");
        render(quoteAuthor, author || "Benjamin Disraeli");
        saveDailyData("quote", content);
        saveDailyData("author", author);
    });
} else {
    const image = getDailyData("backgroundImage");
    const quote = getDailyData("quote");
    const author = getDailyData("author");
    render(imageElement, image);
    render(quoteElement, quote);
    render(quoteAuthor, author);
}

const logo = document.getElementById("logo");
logo.addEventListener("mouseleave", () => {
    logo.classList.add("reverse-spin");
});

// stay the nav link active when the link is clicked
const navLinks = document.querySelectorAll("nav ul li a");

navLinks.forEach((link) => {
    link.addEventListener("click", () => {
        navLinks.forEach((link) => {
            link.classList.remove("active");
        });
        link.classList.add("active");
    });
});


// style the filled form input and textarea border color when the input loses focus and the input is not empty
const formInputs = document.querySelectorAll("input, textarea");

formInputs.forEach((input) => {
    input.addEventListener("blur", () => {
        if (input.value !== "") {
            input.classList.add("filled");
        } else {
            input.classList.remove("filled");
        }
    });
});


// STYLE THE PROJECTS SECTION WITH RANDOM COLORS

// Set random background color on each section element
window.onload = function () {
    const sections = document.querySelectorAll(".flex-container section");

    //set the background color and text color for each section
    sections.forEach(function (section) {
        const color = getRandomColor();
        section.style.backgroundColor = color;
        section.style.color = getContrastYIQ(color);
    });
};

const age = 100 / 365;


// When the user clicks a section, set the window location prefix to the value of this section's h2 element
// document.querySelectorAll('section').forEach(function (section) {
//     const dir = "./";
//     section.addEventListener('click', function (e) {
//         // Replace every space with a dash
//         const sectionName = section.querySelector('h2').innerHTML.replace(/\s+/g, '-');
//         window.location = (dir + sectionName).toLowerCase() + "/";
//     });
// });
