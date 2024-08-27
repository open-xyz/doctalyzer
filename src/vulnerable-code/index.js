const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const app = express();

app.use(express.urlencoded({ extended: true }));

// Create an in-memory SQLite database
const db = new sqlite3.Database(':memory:');

db.serialize(() => {
  // Create a table for users
  db.run("CREATE TABLE users (id INTEGER PRIMARY KEY, username TEXT, password TEXT)");

  // Insert a test user with an insecurely hashed password
  const insecurePassword = 'password123'; // Plaintext password
  const hashedPassword = bcrypt.hashSync(insecurePassword, 2); // Insufficiently hashed
  db.run("INSERT INTO users (username, password) VALUES ('testuser', ?)", hashedPassword);
});

// Vulnerable to SQL Injection
app.get('/login', (req, res) => {
  const username = req.query.username;
  const password = req.query.password;

  // Vulnerable query without parameterized statements
  const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
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

// Vulnerable to XSS
app.get('/profile', (req, res) => {
  const username = req.query.username;

  // Displaying user input directly without sanitization
  res.send(`<h1>Profile of ${username}</h1>`);
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
