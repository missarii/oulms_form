const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt'); // Add bcrypt for password hashing

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
  username: { type: String, unique: true }, // Ensure username is unique
  password: String, // Will store hashed password
});

const User = mongoose.model('User', userSchema);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json()); // Add JSON parsing for API requests
app.use(express.static(__dirname)); // Serve static files

// Serve index.html as the homepage
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Serve login.html when accessing /submit-form route
app.get('/submit-form', (req, res) => {
  res.sendFile(__dirname + '/login.html');
});

// POST endpoint to handle login form submission (register user)
app.post('/submit-form', async (req, res) => {
  const { username, password } = req.body;

  // Validation for empty username or password
  if (!username || !password) {
    return res.status(400).send('<h3 style="color: red;">Invalid username or password. Please try again.</h3>');
  }

  try {
    // Check if username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).send('<h3 style="color: red;">Username already exists. Please choose another.</h3>');
    }

    // Hash the password before saving
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Save user data to MongoDB
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    // Redirect on success
    res.redirect('https://forms.gle/pzCXhatTGPDQ8EX68');
  } catch (error) {
    console.error('Error saving data to MongoDB:', error);
    res.status(500).send('<h3 style="color: red;">Server error. Please try again later.</h3>');
  }
});

// GET endpoint to fetch password based on username
app.get('/get-password', async (req, res) => {
  const { username } = req.query;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: 'Username not found' });
    }

    // For demonstration purposes, send the plaintext password (not secure in practice)
    // In a real app, you'd never send the password back; you'd verify it server-side
    res.json({ password: user.password }); // This sends the hashed password
  } catch (error) {
    console.error('Error fetching password:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
