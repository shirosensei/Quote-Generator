const updateButton = document.getElementById('updateButton');
const deleteButton = document.getElementById('deleteButton');
const messageDiv = document.getElementById('message');
const quoteList = document.getElementById('quoteList');
const quoteContainer = document.getElementById('quote-container');
const newQuoteBtn = document.getElementById('new-quote-btn');
const keyPara = document.getElementById("key");
const valuePara = document.getElementById("value");
 

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
});

//Button to add a generated quote
updateButton.addEventListener('click', async (e) => {
    e.preventDefault();

const updateQuote = new Quote();
updateQuote.updateMongoDB();
})
  
//Button to delete a quote
deleteButton.addEventListener('click', async (e) => {
e.preventDefault();
  // Get the selected radio button
  const selectedRadio = document.querySelector('input[type="radio"]:checked');

const myQuote = new Quote(selectedRadio.name, selectedRadio.value);
myQuote.deleteFromMongoDB(myQuote)
})


//  //Set PUT Request here    
// updateButton.addEventListener('click', async (e) => {
//     e.preventDefault();

// // get references to the two paragraph elements
// const key = keyPara.quoteContent;
// const value = valuePara.quoteContent;

//     try {
//         const response = await fetch(`/quotes`, {
//             method: 'put',
//             headers: {
//                 'Content-Type': 'application/json'
//               },
//               body: JSON.stringify({
//                 author: key,
//                 quote: value
                
//               }),
//         })
//         let data = await response.json();
//         console.log(data);

//            const { author, quote } = data
//             const li = document.createElement('li');
//             li.innerquote = `${author}: ${quote}`;
//             quoteList.appendChild(li);

//     } catch (err) {
//         console.error(err);
//     } 
// })


// deleteButton.addEventListener('click', async (e) => {
//     e.preventDefault();
    
//        await fetch('/quotes', {
//             method: 'delete',
//             headers: {
//                 'Content-Type': 'application/json'
//               },
//             body: JSON.stringify({ 
//                 author: 'Darth Vader' 
//             }),
//         })
//         .then(res => {
//             if (res.ok) return res.json();
//         })
//         .then(data => {
//             if(data === 'No quote to delete') {
//                 messageDiv.quoteContent = 'No quote to delete'
//             } else {
//                 window.location.reload();
//             }
//         })
//         .catch(error => console.error(error));
//     })
    