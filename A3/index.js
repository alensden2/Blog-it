const bodyParser = require('body-parser');
const express = require('express');
const app = express();

const PORT = 8080;
app.use(bodyParser.json());
app.get("/testConnection", (req,res) => {
    res.send("<h1>Works</h1>")
});

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
});