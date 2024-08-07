const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const { connectToDatabase, getQuotesCollection, ObjectId } = require("./db");
const app = express();

app.use(cors());

// Connect to the database when the server starts
connectToDatabase()
  .then(() => {
    console.log("Database connection established");
  })
  .catch((err) => {
    console.error("Failed to connect to database:", err);
  });

// Set up EJS as the view engine
app.set("view engine", "ejs");

//This tells Express we’re using EJS as the template engine. This is to be above of handlers
app.use(express.static("public"));

// Set up middleware to handle JSON and form data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//get handlers for handling index page
app.get("/", async (req, res) => {
  try {
    const quotesCollection = getQuotesCollection();
    const quotes = await quotesCollection.find().toArray();
    res.render("index.ejs", { quotes });
  } catch (error) {
    console.error("Error fetching quotes:", error);
    res.status(500).send("Error fetching quotes");
  }
});

//POST handlers for quotes to mongo db
app.post("/quotes", async (req, res) => {
  try {
    const quotesCollection = getQuotesCollection();
    const { author, quote } = req.body;
    const result = await quotesCollection.insertOne({ author, quote });
    //insertOne method to add items into a MongoDB collection.
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to add quote" });
  }
});

//PUT Request to update Quotes
app.put("/quotes", async (req, res) => {
  try {
    const quotesCollection = getQuotesCollection();
    const { author, quote } = req.body;
    const result = await quotesCollection.findOneAndUpdate(
      { author },
      {
        $set: {
          author: updateName || author,
          quote: updateQuote || quote,
        },
      },
      {
        upsert: true,
      }
    );

    if (result.ok) {
      res.json({
        mesage: "Quote updated successfully",
        author: updateName || author,
        quote: updateQuote || quote,
      });
    } else {
      res.status(500).json({ message: "Failed to update quote" });
    }
  } catch (error) {
    console.error("Error updating quote:", error);
    res
      .status(500)
      .json({ message: "Error updating quote", error: error.message });
  }
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
