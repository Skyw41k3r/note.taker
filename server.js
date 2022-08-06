const { response } = require('express');
const express = require('express');
const fs = require('fs');
const path = require('path');
const notes = require('./db/db.json');
const uniqid = require('uniqid');


const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));


app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/notes.html'))
});
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'))
});

app.get('/api/notes', (req, res) => {
    fs.readFile('db/db.json', 'utf-8', (err, data) => {
        if (err) throw err;
        const parseData = JSON.parse(data);
        res.json(parseData);
    });
});

app.post('/api/notes', (req, res) => {
    const {title, text} = req.body;
    if (title && text) {
        const newNote = {
            title,
            text,
            id: uniqid(),
        };
        fs.readFile('db/db.json', 'utf-8', (err, data) => {
            if (err) throw err;
            const parseData = JSON.parse(data);
            parseData.push(newNote);
            fs.writeFile('db/db.json', JSON.stringify(parseData), (err) => {
                if (err) throw err;
                res.json(parseData);
                console.log('The note has been saved!');
            });
        });
    }  
});


app.listen(PORT, () => console.log(`listening on PORT: ${PORT}`));