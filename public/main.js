"use strict";

const updateButton = document.getElementById("updateButton");
const deleteButton = document.querySelector("#deleteButton");
const messageDiv = document.getElementById("errorMessage");
const quoteList = document.getElementById("quoteList");
const quoteContainer = document.getElementById("quote-container");
const newQuoteBtn = document.getElementById("new-quote-btn");
const authorElement = document.getElementById("key");
const quoteElement = document.getElementById("value");
const quoteOfTheDay = document.getElementById("quoteOfTheDay");
const trashIcons = document.querySelectorAll(".trash-icon");
const quoteDisplay = document.getElementById("quoteDisplay");

class Quote {
  constructor(author, quote, _id) {
    this.author = author;
    this.quote = quote;
    this.id = null;
  }

  // Function to get a new quote from the API
  async getNewQuote() {
    const response = await fetch(
      `https://juvenile-alder-quill.glitch.me/api/quotes`
    );
    const data = await response.json();
    const quotes = data;
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];
    let { author, quote } = randomQuote;

    // Create a new quote object
    const newQuote = new Quote(author, quote);
    // Render the quote to the DOM
    return this.renderQuote(newQuote);
  }

  // Function to render a quote to the DOM
  renderQuote(quote) {
    quoteElement.innerText = quote.quote;
    authorElement.innerText = quote.author;
  }

  //Function to update the quote into MongoDB
  async updateMongoDB(author, quote) {
    if (!quote || !author) {
      displayMessage("Quote and author cannot be empty.", "error");
      return;
    } else {
      try {
        const response = await fetch(`/quotes`, {
          method: "put",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            author: author,
            quote: quote,
          }),
        });

        return response;
      } catch (err) {
        console.error(err);
      }
    }
  }
}

//Button to generate a new quote
newQuoteBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  const newQuote = new Quote();
  newQuote.getNewQuote();
});

//Button to add a generated quote
updateButton.addEventListener("click", async (e) => {
  e.preventDefault();
  const newQuote = new Quote();
  const response = await newQuote.updateMongoDB(
    authorElement.textContent,
    quoteElement.textContent
  );

  if (response && response.ok) {
    const updatedData = await response.json();

    // Create the new quote element
    const li = document.createElement("li");
    li.innerHTML = `${updatedData.quote} __${updatedData.author}`;
    li.setAttribute("class", "quotes");

    //  Add a trash icon to the new quote
    const trashIcon = document.createElement("i");
    trashIcon.setAttribute("class", "gg-trash trash-icon"); // Add FontAwesome class for styling
    trashIcon.setAttribute("data-quote-id", updatedData.id);
    trashIcon.style.cursor = "pointer";

    // Append the trash icon to the list item
    li.appendChild(trashIcon);

    // Add the list item to the DOM
    quoteList.appendChild(li); // Add to the list dynamically

    authorElement.textContent = "";
    quoteElement.textContent = "";
  }
});

//delete quote from mongoDb
trashIcons.forEach((icon) => {
  icon.addEventListener("click", async (event) => {
    const quoteId = event.target.dataset.quoteId;

    const deleted = await deleteQuote(quoteId);

    if (deleted) {
      // Find the parent element (quote) and remove it from the DOM
      const quoteElement = event.target.parentElement;
      if (quoteElement) {
        quoteElement.remove();
      }
    }
  });
});

function displayMessage(message, type) {
  messageDiv.textContent = message;
  messageDiv.className = `errorMessage ${type}`;
}

//function to delete quote
async function deleteQuote(quoteId) {
  try {
    const response = await fetch(`/quotes/${quoteId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const contentType = response.headers.get("Content-Type");
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        console.log(data);

        if (data === "No quote to delete") {
          return "No data to delete";
        } else {
          // Quote deleted successfully, you can handle it as needed
          return true;
        }
      } else {
        // Handle non-JSON response
        const text = await response.text();
        console.log("Non-JSON response:", text);
        // Handle the non-JSON response appropriately
      }
    } else {
      throw new Error("Network response was not OK.");
    }
  } catch (err) {
    console.error(err);
  }
}

const searchForm = document.getElementById("search-form");

//Search form for a random quote
searchForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const searchTag = document.getElementById("searchQuote");

  const tag = searchTag.value.toLowerCase().trim();

  if (tag !== "") {
    fetchRandomQuoteWithTag(tag);
  } else {
    displayErrorMessage("Please enter a tag.");
  }
});

async function fetchRandomQuoteWithTag(tag) {
  try {
    // Fetch all quote data
    const randomData = await fetchQuoteData();

    // Filter the quotes based on the provided tag
    const filteredQuotes = randomData.filter((item) => {
      return Array.isArray(item.tags) && item.tags.includes(tag);
    });

    if (filteredQuotes.length === 0) {
      displayErrorMessage("No quotes found for the given tag.");
      return null;
    }

    // Randomly pick a quote from the filtered list
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const randomQuote = filteredQuotes[randomIndex];

    // Display the quote and author
    displaySearchedQuote(randomQuote.quote, randomQuote.author);

    return randomQuote; // Return the random quote for further use
  } catch (err) {
    console.log("Error", err); // HTTP error code
    displayErrorMessage("Error fetching quote.");
  }
}

function displaySearchedQuote(quote, author) {
  const quoteField = document.getElementById("value");
  const authorField = document.getElementById("key");

  quoteField.textContent = quote;
  authorField.textContent = author;
}

function displayErrorMessage(message) {
  quoteDisplay.innerHTML = `<p>${message}</p>`;
}

// Function to get the current date as a string in the format "YYYY-MM-DD"
function getCurrentDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${day}-${month}-${year}`;
}

//Function to get the current time s a string in the format ""HH:MM:SS"
function getCurrentTime() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
}

// Function to update the time every second
function updateTime() {
  const currentTimeElement = document.getElementById("currentTime");
  currentTimeElement.textContent = `${getCurrentTime()}`;
}

// Update the time immediately
updateTime();

// Update the time every second
setInterval(updateTime, 1000);

// Function to check if 24 hours have passed since the last quote update
function has24HourPassed(lastUpdateDate) {
  const currentDate = getCurrentDate();
  return currentDate !== lastUpdateDate;
}

// Function to fetch quote from api data
async function fetchQuoteData() {
  try {
    const response = await fetch(
      `https://juvenile-alder-quill.glitch.me/api/quotes`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok.");
    }
    const data = await response.json();

    return data;
  } catch (error) {
    console.error(error);
  }
}

//Function to get random quote of the day
async function getRandomQuote(quotesArray) {
  if (!Array.isArray(quotesArray) || quotesArray.length === 0) {
    throw new Error("Invalid quotes array");
  }
  const randomIndex = Math.floor(Math.random() * quotesArray.length);
  return quotesArray[randomIndex];
}

// Function to display current quote of the day
async function displayQuote(quoteData) {
  const { author, quote } = quoteData;
  const quoteTextElement = document.getElementById("quoteText");
  const quoteAuthorElement = document.getElementById("quoteAuthor");
  quoteTextElement.textContent = `${quote}`;
  quoteAuthorElement.textContent = `___${author}`;
}

// Function to check and update quote after 24 hours
async function updateQuoteOfTheDay() {
  const lastUpdateDate = localStorage.getItem("quoteOfTheDayLastUpdate");
  const storedQuote = localStorage.getItem("quoteOfTheDay");

  // Check if 24 hours have passed
  if (lastUpdateDate && has24HourPassed(lastUpdateDate)) {
    // Fetch a new quote
    const quoteData = await fetchQuoteData();

    await getRandomQuote(quoteData)
      .then((data) => {
        console.log("New quote fetched:", data);
        displayQuote(data);
        localStorage.setItem("quoteOfTheDay", JSON.stringify(data));
        localStorage.setItem("quoteOfTheDayLastUpdate", getCurrentDate());
      })
      .catch((error) => console.error("Error fetching new quote:", error));
  }
  // Use the stored quote if available
  else if (storedQuote) {
    const parsedQuote = JSON.parse(storedQuote);
    displayQuote(parsedQuote);
  }
  // Fetch a new quote if none is stored
  else {
    const quoteData = await fetchQuoteData();

    await getRandomQuote(quoteData)
      .then((data) => {
        displayQuote(data);
        localStorage.setItem("quoteOfTheDay", JSON.stringify(data));
        localStorage.setItem("quoteOfTheDayLastUpdate", getCurrentDate());
      })
      .catch((error) =>
        console.error("Error fetching first-time quote:", error)
      );
  }
}

// Call the updateQuoteOfTheDay function to set the quote of the day
updateQuoteOfTheDay();
