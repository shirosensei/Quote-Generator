const { MongoClient, ObjectId } = require("mongodb");

let db;
const dbConnectionStr = process.env.MONGO_URI;
const dbName = "quotes";
let quotesCollection;

// Function to connect to MongoDB
async function connectToDataBase() {
  try {
    //mongodb client to database
    const client = MongoClient.connect(dbConnectionStr, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });

    //Display to acknowledged connection to database
    console.log(`Connected to ${dbName} Database`);

    // Get the reference to the database
    db = client.db(dbName);

    // Set the reference to the collection
    quotesCollection = db.collection("daily_quotes");
  } catch (error) {
    console.error(`Database connection error: ${err.message}`);
    throw err;
  }
}

// Getter function for `db` and `quotesCollection`
function getDb() {
  if (!db)
    throw new Error("Database not initialized. Call connectToDatabase first.");
}

function getQuotesCollection() {
  if (!quotesCollection)
    throw new Error(
      "Quotes collection not initialized. Call connectToDatabase first."
    );
}

module.exports = { connectToDataBase, getDb, getQuotesCollection, ObjectId };
