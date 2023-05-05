const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;
const app = express();


  // Set up EJS as the view engine
  app.set('view engine', 'ejs');

//This tells Express we’re using EJS as the template engine. This is to be above of handlers
app.use(express.static('public'));


  // Set up middleware to handle JSON and form data
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

//connect url to connect mongodb database
const connectionString = "mongodb+srv://service:BP0OQfZsEzFQEwA1@cluster0.byqceiq.mongodb.net/quotes?retryWrites=true&w=majority";

//mongodb client to database
MongoClient.connect(connectionString,  
    {
    useUnifiedTopology: true,
    })
    .then(client => {

        //changing the database from the previous to something else
    const db = client.db('quotes');
    
    //this is collection for storing information in database
    const quotesCollection = db.collection('daily_quotes');
    
    //Display to acknowledged connection to database
        console.log('Connected to Database');
      
        //get handlers for handling index page
        app.get('/', (req, res) => {
            // Note: __dirname is the current directory you're in. Try logging it and see what you get!
         // res.sendFile(__dirname + '/index.html');

          db.collection('daily_quotes')

          //This is a find() function that will find the quotes
          .find()
            //This is toArray() that will convert the data into an array
          .toArray()

          .then(results => {

            //Thi is a render syntax method built into Express’s response to pass the quote data into index.ejs (view, locals). 
            res.render('index.ejs', { quotes : results })

          })

         .catch(error => console.error(error))
          
      });
      
      //POST handlers for quotes to mongo db
        app.post('/quotes', (req, res) => {
            quotesCollection
        
            //insertOne method to add items into a MongoDB collection.
            .insertOne(req.body)
            .then(result => {
                res.redirect('/')
            })
            .catch(error => console.error(error));
        });

        //PUT Request to update Quotes
        app.put('/quotes', async (req, res) => {
         
          const  updateName = req.body.author;
          const updateQuote = req.body.quote;
         

          await  quotesCollection
            .findOneAndUpdate(
                { author: 'Yoda' }, 
            { $set: { 
                author: updateName,
                quote: updateQuote,

            },
        }, 
        {
            upsert: true,
        })
            .then(result => {

                if(result.ok) return res.json({
                    author: updateName,
                    quote: updateQuote,
                });
                console.log({
                    author: updateName,
                    quote: updateQuote,
                })
            })
            .then(res => {
              res.redirect('/')
                // window.location.reload(true)
            })
            .catch(error => console.error(error))

        })

        //DELETE Request to remove quotes from mongodb
        app.delete('/quotes', (req, res) => {
            const  updateName = req.body.author;

            quotesCollection
            .deleteOne({ author: updateName }, (err, result) => {
                if (err) return res.status(500).send();
            })
            .then(result => {
                if (result.deletedCount === 0) {
                    return res.json('No quote to delete')
                }
                res.json(`Deleted Successful`);
                res.redirect('/');
            })
            .catch(error => console.error(error));
        })

  
    })

    //display error if there's problem connecting to database
    .catch(err => console.error(err)) 





app.listen(3000, () => {
    console.log('Node is running on port 3000! You better catch it')
})
