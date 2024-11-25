const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors');
require("dotenv").config();
const { MongoClient, ObjectId } = require("mongodb");
const app = express();

app.use(cors());

let db;
const dbConnectionStr = process.env.MONGO_URI;
const dbName = "quotes";
let quotesCollection;

//mongodb client to database
MongoClient.connect(dbConnectionStr, {
  useUnifiedTopology: true, useNewUrlParser: true
})
  .then((client) => {
    //Display to acknowledged connection to database
    console.log(`Connected to ${dbName} Database`);

    // Get the reference to the database
    db = client.db(dbName);

    // Get the reference to the collection
    quotesCollection = db.collection("daily_quotes");

    //    console.log(`Connected to ${quotesCollection.collectionName} Database`);
  })
  .catch((err) => {
    console.error(`error ${err.message}`)
    throw err;
  });

// Set up EJS as the view engine
app.set("view engine", "ejs");

//This tells Express we’re using EJS as the template engine. This is to be above of handlers
app.use(express.static("public"));

// Set up middleware to handle JSON and form data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//get handlers for handling index page
app.get("/", (req, res) => {
  // Note: __dirname is the current directory you're in. Try logging it and see what you get!
//   res.sendFile(__dirname + '/views/index');

  quotesCollection

    //This is a find() function that will find the quotes
    .find()
    //This is toArray() that will convert the data into an array
    .toArray()

    .then((results) => {
      // Use map() to extract the object IDs from the results
      //      const objectIds = results.map(quote => quote._id);

      // Pass them along with our other arguments so they can be used by the next handler
      res.render("index.ejs", { quotes: results });
    })

    .catch((error) => console.error(error));

});

//POST handlers for quotes to mongo db
app.post("/quotes", (req, res) => {
  quotesCollection

    //insertOne method to add items into a MongoDB collection.
    .insertOne(req.body)
    .then((result) => {
      res.redirect("/");
    })
    .catch((error) => console.error(error));
});

//PUT Request to update Quotes
app.put("/quotes", async (req, res) => {
  const updateName = req.body.author;
  const updateQuote = req.body.quote;

  await quotesCollection
    .findOneAndUpdate(
      { author: "Yoda" },
      {
        $set: {
          author: updateName,
          quote: updateQuote,
        },
      },
      {
        upsert: true,
      }
    )
    .then((result) => {
      if (result.ok)
        return res.json({
          author: updateName,
          quote: updateQuote,
        });
    })
    .then((res) => {
      res.redirect("/");
      // window.location.reload(true)
    })
    .catch((error) => console.error(error));
});

//DELETE Request to remove quotes from mongodb
app.delete("/quotes/:id", (req, res) => {
  const objectIdString = req.params.id;
  // Example usage of ObjectId
  const objectId = new ObjectId(objectIdString);

  quotesCollection
    .deleteOne({ _id: objectId }, (err, result) => {
      if (err) {
        console.error("Error deleting document", err);
        return;
      }
    })
    .then((result) => {
      if (result.deletedCount === 0) {
        return res.json("No quote to delete");
      }
      console.log(`Deleted Successful`);
      res.json({ message: "Deleted Successful" });
    })
    .catch((error) => console.error(error));
});

app.listen(3000, () => {
  console.log("Node is running on port 3000! You better catch it");
});
