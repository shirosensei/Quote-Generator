'use strict';

const updateButton = document.getElementById('updateButton');
const deleteButton = document.querySelector('#deleteButton');
const messageDiv = document.getElementById('message');
const quoteList = document.getElementById('quoteList');
const quoteContainer = document.getElementById('quote-container');
const newQuoteBtn = document.getElementById('new-quote-btn');
const authorElement = document.getElementById("key");
const quoteElement = document.getElementById("value");
 const quoteOfTheDay = document.getElementById('quoteOfTheDay')
 const trashIcons = document.querySelectorAll('.trash-icon');
 const searchItem = document.getElementById('#searchQuote')

class Quote {
    constructor(author, quote, _id) {
        this.author = author;
        this.quote = quote;       
         this.id = null;

    }


    // Function to get a new quote from the API
    async getNewQuote() {
    const response = await fetch('https://type.fit/api/quotes');
    const data = await response.json();
    const quotes = data;
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];
    let { author, text } = randomQuote;
    let quote = text
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
      
        try {
            const response = await fetch(`/quotes`, {
                method: 'put',
                headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({
                     author: author,
                   quote: quote,
                  }),
            })
            const data = await response.json();
            console.log({ data });            

            const li = document.createElement('li');
            li.innerHTML = `${data.quote} __${data.author}`;
            li.setAttribute('class', 'quotes');
           quoteList.appendChild(li);
            return data;
                        
        } catch (err) {
            console.error(err);
        } 

     }

    //  async deleteFromMongoDB(idToDelete) {
    //   try {
        
    //     const response = await fetch(`/quotes/${idToDelete}`, {
    //       method: 'DELETE',
    //       headers: {
    //           'Content-Type': 'application/json'
    //         },
    //   });

    //   if(response.ok) {
    //     const contentType = response.headers.get('Content-Type');
    //     if(contentType && contentType.includes('application/json')) {
    //       const data = await response.json();
    //       console.log(data);

    //       if(data === 'No quote to delete') {
    //         messageDiv.textContent = `No quote to delete`;
    //      }
      
    //     } else {
    //       // Handle non-JSON response
    //     const text = await response.text();
    //     console.log('Non-JSON response:', text);
    //     // Handle the non-JSON response appropriately

    //     }
    //   } else {
    //     throw new Error('Network response was not OK.');

    //   }
               
    //   } catch (err) {
    //     console.error(err);
    //   }
    // }


}

    
 //Button to generate a new quote
newQuoteBtn.addEventListener('click', async (e) => {
 e.preventDefault();
   const newQuote = new Quote();
   newQuote.getNewQuote();
});

//Button to add a generated quote
updateButton.addEventListener('click', async (e) => {
    e.preventDefault();
    const newQuote = new Quote();
    newQuote.updateMongoDB(authorElement.textContent, quoteElement.textContent);
})

//delete quote from mongoDb
trashIcons.forEach(icon => {
  icon.addEventListener('click', async (event) => {
    const quoteId = event.target.dataset.quoteId;
    const deleted = await deleteQuote(quoteId);

    if (deleted) {
      // Find the parent element (quote) and remove it from the DOM
      const quoteElement = event.target.parentElement;
      if (quoteElement) {
        quoteElement.remove();
      }
    }
  })
})

//function to delete quote 
async function deleteQuote(quoteId) {
 
  try {

    const response = await fetch(`/quotes/${quoteId}`, {
      method: 'DELETE',
      headers: {
          'Content-Type': 'application/json'
        },
  });

  if (response.ok) {
    const contentType = response.headers.get('Content-Type');
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      console.log(data);

      if (data === 'No quote to delete') {
        return 'No data to delete';
      } else {
        // Quote deleted successfully, you can handle it as needed
       return true;
      }
    } else {
      // Handle non-JSON response
      const text = await response.text();
      console.log('Non-JSON response:', text);
      // Handle the non-JSON response appropriately
    }
  } else {
    throw new Error('Network response was not OK.');
  }
  } catch(err) {
    console.error(err);
  }

}


//function to search for quote tags and author
async function searchRandomQuote() {
  const response = await fetch('https://api.quotable.io/random');
  const data = response.json();
  return data;
}

function getSearchRandomQuote(searchItem) {
  return searchRandomQuote()
  .then(quotes => {
    const searchResult = quotes.filter(quote => {
      const tagsMatch = quote.tags.some(tag => tag.includes(searchItem));
      const authorMatch = quote.author.toLowerCase().includes(searchItem.toLowerCase());
      return tagsMatch || authorMatch;
    });

    if(searchResult.length > 0) {
      const randomIndex = Math.floor(Math.random() * searchResult.length);
      return searchResult[randomIndex]
    } else {
      console.log("No matching results found");
    }
  })
  .catch(error => {
    console.log(`Error fetching API ${error}`);
    return null;
  })
 
}


getSearchRandomQuote(searchItem)
.then(randomQuote => {
  // Update UI with randomly selected quote and add timestamp for when it was fetched from server
  if(randomQuote) {
    document.getElementById('text').textContent = `"${randomQuote.content}" - ${randomQuote}`
    console.log('Search Quote', randomQuote);
      
  } else {
    console.log("No quotes found for the search term:", searchTerm);
  }
})


// Function to get the current date as a string in the format "YYYY-MM-DD"
function getCurrentDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${day}-${month}-${year}`;
}

//Function to get the current time s a string in the format ""HH:MM:SS"
function getCurrentTime() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}

// Function to update the time every second
function updateTime() {
  const currentTimeElement = document.getElementById('currentTime');
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

//Function to get random quote of the day from api
async function getRandomQuote() {
  try {
    const response = await fetch('https://api.quotable.io/random');
    if (!response.ok) {
      throw new Error('Network response was not ok.');
    }
    const data = await response.json();
    let { author, content } = data;
    return { author, content }
  } catch (error) {
    console.error(error);
  }
}

// Function to display current quote of the day
async function displayQuote({ author, content }) {
  const quoteTextElement = document.getElementById("quoteText");
  const quoteAuthorElement = document.getElementById("quoteAuthor");
  quoteTextElement.textContent = `${content}`;
  quoteAuthorElement.textContent = `___${author}`;
}

//Function to check anď update quote after 24hours
function updateQuoteOfTheDay() {
  const lastUpdateDate = localStorage.getItem('quoteOfTheDayLastUpdate');
  const storedQuote = localStorage.getItem('quoteOfTheDay');

  if (lastUpdateDate && has24HourPassed(lastUpdateDate)) {
    getRandomQuote()
      .then(data => {
        displayQuote(data);
        localStorage.setItem('quoteOfTheDay', JSON.stringify(data));
        localStorage.setItem('quoteOfTheDayLastUpdate', getCurrentDate());
      })
      .catch(error => console.error(error));

  } else if (storedQuote) {
     displayQuote(JSON.parse(storedQuote));

  } else {
    getRandomQuote()
      .then(data => {
        displayQuote(data);
        localStorage.setItem('quoteOfTheDay', JSON.stringify(data));
        localStorage.setItem('quoteOfTheDayLastUpdate', getCurrentDate());
      })
      .catch(error => console.error(error));
  }
}


// Call the updateQuoteOfTheDay function to set the quote of the day
updateQuoteOfTheDay();