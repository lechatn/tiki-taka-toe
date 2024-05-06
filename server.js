const http = require('http');
const fs = require ('fs');
const url = require('url');
const path = require('path');
const express = require('express');
const bcrypt = require('bcrypt');
const session = require('express-session');
const app = express();
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config({path: __dirname + '/key.env'})

app.use(express.static("static"));
app.use('/IMG', express.static('static/IMG'));
app.use(express.json());

// Connect to MongoDB
const client = new MongoClient(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect().then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});


app.use(express.json());

app.use(session({
    secret: 'your secret key',
    resave: false,
    saveUninitialized: false
}));

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const collection = client.db("test").collection("users");

        // Find user with given email
        const user = await collection.findOne({ email });

        if (user && await bcrypt.compare(password, user.password)) {
            req.session.user = user;
            res.json({ status: 'success', message: 'User logged in successfully' });
        } else {
            res.status(401).json({ status: 'error', message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'An error occurred while logging in the user' });
    }
});

app.post('/signup', async (req, res) => {
    const { email, password } = req.body;

    try {
        const collection = client.db("test").collection("users");
        const pastUser = await collection.findOne({ email });

        if (pastUser) {
            return res.status(400).json({ status: 'error', message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await collection.insertOne({ email, password: hashedPassword });

        if (!result) {
            throw new Error('Failed to insert user into database');
        }

        req.session.user = result;

        res.json({ status: 'success', message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'An error occurred while registering the user' });
    }
});

app.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error(err);
            res.status(500).json({ status: 'error', message: 'An error occurred while logging out' });
        } else {
            res.json({ status: 'success', message: 'User logged out successfully' });
        }
    });
});

app.get('/is-logged-in', (req, res) => {

    if (req.session.user) {
        res.json({ isLoggedIn: true });
        console.log('is-logged-in')
    } else {
        res.json({ isLoggedIn: false });
        console.log('is-not-logged-in')
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates', 'index.html'));
});

app.get('/game1.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates', 'game1.html'));
});

app.get('/game2.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates', 'game2.html'));
});

app.get('/game3.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates', 'game3.html'));
});

app.get('/game4.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates', 'game4.html'));
});

app.get('/game5.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates', 'game5.html'));
});

app.get('/signup.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates', 'signup.html'));
});

process.on('SIGINT', async () => {
    await client.close();
    console.log('Disconnected from MongoDB');
    process.exit();
});

const server = http.createServer(app);

const host = 'localhost';
const port = 3000;
server.listen(port, () => {
    console.log(`Server is running on http://${host}:${port}/`);
});

