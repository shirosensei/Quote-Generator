const { MongoClient, ObjectId } = require("mongodb");

let db; // Reference to database
let quotesCollection; // Reference to the collection
const dbConnectionStr = process.env.MONGO_URI;
const dbName = "quotes";

// Function to connect to MongoDB
async function connectToDatabase() {
  try {
    //mongodb client to database
    const client = await MongoClient.connect(dbConnectionStr, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });

    //Display to acknowledged connection to database
    console.log(`Connected to ${dbName} Database`);

    // Set the database and collection reference
    db = client.db(dbName);
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
  return db;
}

function getQuotesCollection() {
  if (!quotesCollection)
    throw new Error(
      "Quotes collection not initialized. Call connectToDatabase first."
    );
  return quotesCollection;
}

module.exports = { connectToDatabase, getDb, getQuotesCollection, ObjectId };
