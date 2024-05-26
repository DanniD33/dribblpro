const express = require('express');
var path = require('path');
const app = express();
// const port = 5000;
const port = process.env.PORT || 8080;


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'main.html'));
});


app.listen(port, () => {
  console.log(`Example app listening on outer endpoints port ${port}`);
    });