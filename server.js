"use strict";
const express = require('express');
const { Client } = require('pg');
const app = express();
app.use(express.static("public"));
const PORT = 8000;
app.listen(PORT);
const clientConfig = {
    user: '',
    password: '',
    host:'',
    port: 5432,
    ssl: {
    rejectUnauthorized: false,
    }
};

app.get('/items', async (req, res) => {
    try {
        const client = new Client(clientConfig);
        await client.connect();
        const result = await client.query('SELECT * FROM nasdq;');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching data');
    }
});

app.post('/items', async (req, res) => {
    const { name, description } = req.body;
    try {
        const client = new Client(clientConfig);
        await client.connect();
        const result = await client.query(
        'INSERT INTO nasdq (name, description) VALUES ($1, $2) RETURNING *;',
        [name, description]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error inserting data');
    }
});

app.delete('/items/:id', async (req, res) => {
    const { id } = req.params; 
    try {
        const client = new Client(clientConfig);
        await client.connect();
        const result = await client.query('DELETE FROM nasdq WHERE id = $1 RETURNING *;', [id]);
      if (result.rowCount === 0) {
        res.status(404).send('Item not found');
      } else {
        res.json(result.rows[0]); 
      }
    } catch (err) {
      console.error(err);
      res.status(500).send('Error deleting item');
    }
});



app.get('/hello', function (req, res) {
    res.set("Content-Type", "text/plain");
    res.send('Hello World!');
});
app.get('/echo', function (req, res) {
    const value = req.query['input'];
    res.set("Content-Type", "text/plain");
    res.send(value);
});

