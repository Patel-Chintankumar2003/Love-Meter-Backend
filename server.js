const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// MongoDB Connection URI from the .env file
const uri = process.env.MONGODB_URI;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();
    console.log("Connected to MongoDB!");

    const database = client.db('loveMeter'); // Use your database name here
    const loveCollection = database.collection('loves'); // Use your collection name here

    // Middleware
    app.use(bodyParser.json());
    app.use(express.static('public'));

    // Handle POST request
    app.post('/submit', async (req, res) => {
      const { yourName, partnerName, result } = req.body;

      const newEntry = {
        yourName,
        partnerName,
        result
      };

      try {
        await loveCollection.insertOne(newEntry);
        res.json({ message: 'Data saved successfully' });
      } catch (err) {
        res.status(500).json({ error: 'Failed to save data' });
      }
    });

    // Start the server
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (err) {
    console.error('Error connecting to MongoDB:', err.message);
  }
}

run().catch(console.dir);
