const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
    ssl: true, // Ensure SSL/TLS is used for the connection
    tlsAllowInvalidCertificates: true, // This can be removed in production if you're using valid certificates
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Error connecting to MongoDB:', err.message);
});

const loveSchema = new mongoose.Schema({
    yourName: String,
    partnerName: String,
    result: Number,
});

const Love = mongoose.model('Love', loveSchema);

app.use(bodyParser.json());
app.use(express.static('public'));

// Handle POST request
app.post('/submit', (req, res) => {
    const { yourName, partnerName, result } = req.body;

    const newEntry = new Love({ yourName, partnerName, result });

    newEntry.save()
        .then(() => res.json({ message: 'Data saved successfully' }))
        .catch(err => res.status(500).json({ error: 'Failed to save data' }));
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
