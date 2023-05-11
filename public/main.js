const updateButton = document.getElementById('updateButton');
const deleteButton = document.getElementById('deleteButton');
const messageDiv = document.getElementById('message');
const quoteList = document.getElementById('quoteList');
const quoteContainer = document.getElementById('quote-container');
const newQuoteBtn = document.getElementById('new-quote-btn');
const keyPara = document.getElementById("key");
const valuePara = document.getElementById("value");
 const quoteOfTheDay = document.getElementById('quoteOfTheDay')

class Quote {
    constructor(author, quote) {
        this.author = author;
        this.quote = quote;
        this.id = null;
    }

    author() {
        return this.author;
    }

    quote() {
        return this.quote;
    }

    // Function to get a new quote from the API
    async getNewQuote() {
    const response = await fetch('https://type.fit/api/quotes');
    const data = await response.json();
    const quotes = data;
    const randomIndex = Math.floor(Math.random() * 1643);
    const randomQuote = quotes[randomIndex];
    const { author, text } = randomQuote;
    const quote = `${text}`;
    const newQuote = new Quote(author, quote);
    keyPara.textContent = `${author}`;
    valuePara.textContent = `${quote}`;

    return newQuote;

     }


        
     async updateMongoDB() {

        try {
      
        this.author = keyPara.textContent
         this.quote = valuePara.textContent;
           
            const response = await fetch(`/quotes`, {
                method: 'put',
                headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({
                    author: this.author,
                    quote: this.quote

                  }),
            })
            const data = await response.json({});
            console.log(data);
            const li = document.createElement('li');
            li.innerHTML = `${data.author}: ${data.quote}`;
            li.setAttribute('class', 'quotes');
            quoteList.appendChild(li);
            return data;
                        
        } catch (err) {
            console.error(err);
        } 

     }

     async deleteFromMongoDB(myQuote) {
        try {
          
          const response = await fetch(`/quotes`, 
          {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(myQuote),
        }
         
         );
         const data = await response.json();
         console.log(data);
         if(data === 'No quote to delete') {
            messageDiv.textContent = `No quote to delete`;
         } else {
            window.location.reload();
         }

          return data;
          
        } catch (err) {
          console.error(err);
        }
      }


    }



 //Button to generate a new quote
newQuoteBtn.addEventListener('click', async (e) => {
 e.preventDefault();
   const newQuote = new Quote();
   newQuote.getNewQuote();

   updateButton.style.display = 'none';

   setInterval(() => {
      // toggle the display property of the button every 5 seconds
      updateButton.style.display = updateButton.style.display === 'none' ? 'inline-block' : 'none';
     updateButton.style.backgroundColor = 'hsl(223, 90%, 60%)'
  }, 5000);
  


});

//Button to add a generated quote
updateButton.addEventListener('click', async (e) => {
    e.preventDefault();
const updateQuote = new Quote();
updateQuote.updateMongoDB();

updateButton.style.display = 'none';

   setInterval(() => {
      // toggle the display property of the button every 5 seconds
      deleteButton.style.display = deleteButton.style.display === 'none' ? 'inline-block' : 'none';
      deleteButton.style.backgroundColor = 'rgb(122, 74, 14)';
      updateButton.style.display = 'none';
  }, 5000);

})
  
const selectedRadio = document.querySelector('input[type="radio"]');

//Button to delete a quote
deleteButton.addEventListener('click', async (e) => {
e.preventDefault();
  // Get the selected radio button


const myQuote =  new Quote(selectedRadio.name, selectedRadio.value);
myQuote.deleteFromMongoDB(myQuote)
})


// Add event listener to radio buttons
const radioButtons = document.querySelectorAll('input[type="radio"]');
radioButtons.forEach(function(radioButton) {
  radioButton.addEventListener('change', function() {
    if (this.checked) {
      deleteButton.style.display = 'inline-block';
    } else {
      deleteButton.style.display = 'none';
    }
  });
});

// Function to get the current date as a string in the format "YYYY-MM-DD"
function getCurrentDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${day}-${month}-${year}`;
}

// Function to check if 24 hours have passed since the last quote update
function has24HourPassed(lastUpdateDate) {
  const currentDate = getCurrentDate();
  return currentDate !== lastUpdateDate;
}

// Fetch or Generate a random quote of the day
function getRandomQuote() {
    fetch('https://api.quotable.io/random')
    .then(response => {
      if(!response.ok) {
        throw new Error('Network response was not ok.');
      }
      return response.json();
    })
    .then(data => { 
      let { author, content } = data
      displayQuote({ author, content });
      return { author, content };
     

    })
      
    .catch(error => console.error(error))
  }

  function displayQuote({ author, content }) {
 // let { content, author } = data;
    const quoteTextElement = document.getElementById("quoteText");
    const quoteAuthorElement = document.getElementById("quoteAuthor");
    quoteTextElement.textContent = `${content}`;
    quoteAuthorElement.textContent = `___${author}`;
  }

  //Function to update the quote of the day
  function updateQuoteOfTheDay() {
    const lastUpdateDate = localStorage.getItem('quoteOfTheDayLastUpdate');
    const storedQuote = localStorage.getItem('quoteOfTheDay');

    if (lastUpdateDate && has24HourPassed(lastUpdateDate)) {
      getRandomQuote({ author, content })
      .then(data => {
        displayQuote(data.author, data.content);
        localStorage.setItem('quoteOfTheDay', JSON.stringify({ author, content }));
        localStorage.setItem('quoteOfTheDayLastUpdate', getCurrentDate());
      })
      .catch(error => console.error(error))

  } else if (storedQuote) {

    displayQuote(storedQuote);

  } else {

    getRandomQuote()
    .then(data => {
      displayQuote(data.author, data.content);
      localStorage.setItem('quoteOfTheDay', JSON.stringify({ author, content }));
      localStorage.setItem('quoteOfTheDayLastUpdate', getCurrentDate());
    })
    .catch(error => console.error(error))

  }
}

// Call the updateQuoteOfTheDay function to set the quote of the day
updateQuoteOfTheDay();

  // //Set quote of the day
  // getRandomQuote();

  // //Display the quote 
  // displayQuote();
