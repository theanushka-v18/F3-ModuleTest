// get all required elements from HTML
const currentImageContainer = document.getElementById("current-image-container");
const searchBtn = document.getElementById("searchBtn");

// created an empty array to add previous searched dates
let searchesArr = [];

// this function will run as web page load
window.onload = function onLoad() {
    getCurrentImageOfTheDay(); // calling the function to get current image of the day
    if(localStorage.getItem("searches")) { // checking if the localStorage contains some or not
        searchesArr = JSON.parse(localStorage.getItem("searches")); // if localStorage contains some value then get array and parse it
        addSearchToHistory(); // also add those value(previous searches) to the history(unordered list)
    }
}

// this function will made all the data in the UI(user interface)
function renderUI(data) {
    // get all the required elements from HTML
    const currentImage = document.querySelector("#current-image-container img");
    const currentImageTitle = document.querySelector("#current-image-container #imgTitle");
    const currentImageExp = document.querySelector("#current-image-container #imgExp");
    currentImage.src = data.url; // set the url to the image src
    currentImageTitle.innerHTML = data.title; // set the title to the image innerHTML
    currentImageExp.innerHTML = data.explanation; // set the explanation to the image innerHTML
}

// this is a async function that will get all the data from NASA API by using API_KEY
async function getDataFromNasaApi(API_KEY, date) {
    let response = await fetch(`https://api.nasa.gov/planetary/apod?date=${date}&api_key=${API_KEY}`); // this will fetch the data
    let data = await response.json(); // here we will get the response object

    const imageTitle = document.querySelector("#podHeading"); // get the h2 to display the imageTitle
    imageTitle.innerHTML = `Picture on ${date}`; 
    renderUI(data); // this function will render all the data in the UI as mentioned above
    saveSearch(date); // this function will save the previous searches
    addSearchToHistory(); // also add those value(previous searches) to the history(unordered list)
}

// this function will fetch the data of the present(current) day
async function getCurrentImageOfTheDay() {
    let API_KEY = "ArMoihEVnDLs6XBTopExuLeNtAiwoJmzyA3SDfCD"; // this is an API key
    let response = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`); // this will fetch the data
    let data = await response.json(); // here we will get the response object

    renderUI(data); // this function will render all the data in the UI as mentioned above
    getImageOfTheDay(API_KEY); // calling the getImageOfTheDay function 
}

// implementation of getImageOfTheDay function. This will fetch the data for the searched date
function getImageOfTheDay(API_KEY) {
    const dateInput = document.querySelector("#search-input"); // get the input type of date
    // adding the event listener to the search button
    searchBtn.addEventListener("click", function(e) { 
        e.preventDefault(); // this will prevent the page to refresh
        let date = dateInput.value.split("/").reverse().join("-"); // converting date format to yyyy-mm-dd 
        getDataFromNasaApi(API_KEY, date) // calling again to get the data
    })
}

// this function will save all the searched dates to localStorage
function saveSearch(date) {
    // creating the object to store date
    let dateObj = {
        date: date
    }
    searchesArr.push(dateObj); // adding the object to the array
    localStorage.setItem("searches", JSON.stringify(searchesArr)); // storing the array of searches to localStorage
}

// this function will render all the previous searches to the unordered list
function addSearchToHistory() {
    let getSearchesArr = JSON.parse(localStorage.getItem("searches")); // getting the array of searches from localStorage
    document.getElementById("search-history").innerHTML = ""; // initializing it to empty string so that next time this will not re-render it
    getSearchesArr.forEach(getSearchDate => {
        let li = document.createElement("li");
        li.innerHTML = getSearchDate.date;
        document.getElementById("search-history").prepend(li);

        li.addEventListener("click", async function() {
            let date = li.innerText;
            let API_KEY = "ArMoihEVnDLs6XBTopExuLeNtAiwoJmzyA3SDfCD";
            getDataFromNasaApi(API_KEY, date);
        })
    });
}

