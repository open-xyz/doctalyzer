const express = require('express');
const fs = require('fs');
const vm = require('vm');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Insecure Deserialization
app.post('/deserialize', (req, res) => {
    const serializedData = req.body.data;
    try {
        const deserializedData = JSON.parse(serializedData);
        res.send(`Deserialized data: ${deserializedData}`);
    } catch (e) {
        res.status(400).send('Invalid data');
    }
});

// Cross-Site Scripting (XSS)
app.get('/greet', (req, res) => {
    const name = req.query.name;
    res.send(`<h1>Hello, ${name}</h1>`);
});

// Insecure JWT Handling
app.post('/login', (req, res) => {
    const user = { id: 1, username: req.body.username };
    const token = jwt.sign(user, 'secretkey'); // Weak secret
    res.json({ token });
});

// Unsafe File Operations
app.get('/read-file', (req, res) => {
    const filename = req.query.filename;
    fs.readFile(`/var/data/${filename}`, 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('File read error');
            return;
        }
        res.send(`File content: ${data}`);
    });
});

// Server-Side JavaScript Injection
app.post('/execute', (req, res) => {
    const code = req.body.code;
    try {
        const result = vm.runInNewContext(code, {});
        res.send(`Execution result: ${result}`);
    } catch (e) {
        res.status(500).send('Execution error');
    }
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
