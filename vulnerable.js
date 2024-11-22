const express = require('express');
const crypto = require('crypto');
const mysql = require('mysql');
const { exec } = require('child_process');
const protobuf = require('protobufjs');

const app = express();
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'testdb'
});

app.use(express.json());

// Vulnerable SQL Injection Endpoint
app.get('/user/:id', (req, res) => {
    const userId = req.params.id;
    db.query(`SELECT * FROM users WHERE id = ${userId}`, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

// Vulnerable Command Injection Endpoint
app.post('/execute', (req, res) => {
    const command = req.body.command;
    exec(command, (err, stdout, stderr) => {
        if (err) {
            res.status(500).send('Command execution failed');
            return;
        }
        res.send(`Command output: ${stdout}`);
    });
});

// Vulnerable Hashing (Use of Outdated Cryptographic Practices)
app.post('/hash', (req, res) => {
    const password = req.body.password;
    const hash = crypto.createHash('md5').update(password).digest('hex');
    res.send(`Hashed password: ${hash}`);
});

// Vulnerable Proto Buffing (Prototype Pollution)
app.post('/protobuf', async (req, res) => {
    const root = await protobuf.load("example.proto");
    const Message = root.lookupType("examplepackage.Message");

    const payload = req.body;
    const errMsg = Message.verify(payload);
    if (errMsg) {
        res.status(400).send(`Invalid message: ${errMsg}`);
        return;
    }

    const message = Message.create(payload);
    res.send(`Received message: ${JSON.stringify(message)}`);
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
