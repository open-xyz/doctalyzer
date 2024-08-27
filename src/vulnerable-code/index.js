const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const app = express();

app.use(express.urlencoded({ extended: true }));

// Create an in-memory SQLite database
const db = new sqlite3.Database(':memory:');

db.serialize(() => {
  // Create a table for users
  db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, username TEXT, password TEXT)");

  // Insert a test user with an insecurely hashed password
  const insecurePassword = 'password123'; // Plaintext password
  const saltRounds = 2;
  const hashedPassword = bcrypt.hashSync(insecurePassword, saltRounds); // Weak hashing
  db.run("INSERT INTO users (username, password) VALUES (?, ?)", ['testuser', hashedPassword]);
});

// Slightly obfuscated SQL Injection vulnerability
app.get('/login', (req, res) => {
  const user = req.query.username;
  const pass = req.query.password;

  // Concatenation using a different pattern to obscure SQL injection vulnerability
  const query = ['SELECT * FROM users WHERE username = "', user, '" AND password = "', pass, '"'].join('');
  
  db.get(query, (err, row) => {
    if (err) {
      res.status(500).send('Internal Server Error');
    } else if (row) {
      res.send('Login successful!');
    } else {
      res.send('Invalid credentials');
    }
  });
});

// XSS vulnerability with slightly hidden logic
app.get('/profile', (req, res) => {
  const username = req.query.username;

  // Adding unnecessary function to obscure XSS vulnerability
  const renderProfile = (user) => {
    return `<h1>Profile of ${user}</h1>`;
  };

  // Render profile with potential XSS
  res.send(renderProfile(username));
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
