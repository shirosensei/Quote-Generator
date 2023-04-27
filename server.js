const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;
const app = express();


// Make sure you place body-parser before your CRUD handlers!
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
    const quotesCollection = db.collection('daily-quotes');
    
    //Display to acknowledged connection to database
        console.log('Connected to Database');
      
        //get handlers for handling index page
        app.get('/', (req, res) => {
            // Note: __dirname is the current directory you're in. Try logging it and see what you get!
          res.sendFile(__dirname + '/index.html');
      })
      
      //POST handlers for quotes to mongo db
        app.post('/quotes', (req, res) => {
            quotesCollection
        
            //insertOne method to add items into a MongoDB collection.
            .insertOne(req.body)
            .then(result => {
                res.redirect('/')
            })
            .catch(error => console.error(error))
           // console.log(req.body)
        })
    })

    //display error if there's problem connecting to database
    .catch(err => console.error(err)) 





app.listen(3000, () => {
    console.log('Node is running on port 3000! You better catch it')
})
