const express = require('express');
var path = require('path');
const app = express();
// const port = 3000;
const port = 8080;
require('dotenv').config();



app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/r1/r1.html'));
});

app.use(express.static(path.join(__dirname, './r1')));

app.listen(port, () => {
  console.log(`Example app listening on outer endpoints port ${port}`);
    });
