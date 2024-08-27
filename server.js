const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 3000;

// MongoDB Connection
require('dotenv').config();
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
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



