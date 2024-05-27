const express = require('express');
var path = require('path');
const app = express();
// const port = 3000;
const port = 8080;
require('dotenv').config();



app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'main.html'));
});


app.listen(port, () => {
  console.log(`Example app listening on outer endpoints port ${port}`);
    });
