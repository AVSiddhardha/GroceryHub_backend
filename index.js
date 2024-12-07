// Import necessary modules
const express = require("express"); // Web framework for Node.js
const cors = require("cors"); // Middleware to enable Cross-Origin Resource Sharing
const { MongoClient } = require("mongodb"); // MongoDB client for connecting to the database
const path = require("path"); // Utility module for file and directory paths
const fs = require("fs"); // File system module for reading files
const serverless = require("serverless-http"); // Enables running the app on serverless platforms

// Initialize Express application
const app = express();

// Define the server port for local execution
const LOCAL_SERVER_PORT = 5000;

// Enable CORS for handling cross-origin requests
app.use(cors());

// MongoDB connection string (URI) for connecting to the database
const MONGO_URI =
  "mongodb+srv://siddhualla2:6wYRuTCIw6vr8KCQ@groceryhub.19tvl.mongodb.net/?retryWrites=true&w=majority&appName=GroceryHub";

// Create a MongoDB client instance
const mongoClient = new MongoClient(MONGO_URI);

/**
 * Function to establish a connection with MongoDB
 * Logs a success or error message depending on the connection status.
 */
async function initializeMongoDBConnection() {
  try {
    await mongoClient.connect(); // Attempt to connect to the database
    console.log("Successfully connected to MongoDB"); // Log success message
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error); // Log error details
    process.exit(1); // Exit process to indicate a critical failure
  }
}

/**
 * Root endpoint that serves a static HTML file to the client.
 * The file is read from the 'public' directory.
 */
app.get("/", (req, res) => {
  const htmlFilePath = path.join(__dirname, "public", "index.html"); // Define the path to the HTML file

  // Read the HTML file asynchronously
  fs.readFile(htmlFilePath, "utf8", (err, fileContent) => {
    if (err) {
      console.error("Error reading index.html:", err); // Log error details
      return res.status(500).send("Failed to load the page"); // Respond with an error message
    }
    res.send(fileContent); // Send the HTML content as the response
  });
});

/**
 * API endpoint to fetch data from MongoDB.
 * Fetches all documents from the 'GroceryList' collection in the 'GroceryHub' database.
 */
app.get("/api", async (req, res) => {
  try {
    const groceryList = await mongoClient
      .db("GroceryHub") // Specify the database name
      .collection("GroceryList") // Specify the collection name
      .find({}) // Fetch all documents
      .toArray(); // Convert the result into an array
    res.json(groceryList); // Send the result as a JSON response
  } catch (error) {
    console.error("Error fetching data from MongoDB:", error); // Log error details
    res.status(500).send("Internal Server Error"); // Respond with an error message
  }
});

/**
 * Export the Express application wrapped with serverless-http for serverless deployment.
 * The handler is required for platforms like AWS Lambda.
 */
module.exports.handler = serverless(app);

// Run the server locally if the script is executed directly
if (require.main === module) {
  (async () => {
    await initializeMongoDBConnection(); // Ensure MongoDB connection is established
    app.listen(LOCAL_SERVER_PORT, () => {
      console.log(`Server is running at http://localhost:${LOCAL_SERVER_PORT}`); // Log the server URL
    });
  })();
}
