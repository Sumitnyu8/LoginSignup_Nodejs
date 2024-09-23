const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('public')); // Serve static files
app.set('view engine', 'ejs');

// MongoDB Atlas connection
const dbURI = 'mongodb+srv://sumitnyu9:lSkYWk97y6giRQio@cluster0.kxrqd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// Connect to MongoDB Atlas
mongoose.connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB Atlas'))
.catch(err => console.log('MongoDB connection error:', err));

// Route definitions
app.use('/', require('./routes/auth'));

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
