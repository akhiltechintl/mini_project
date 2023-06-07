const express = require('express');
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose.connect("mongodb+srv://akhilnmptf:zxDdPDUt1XXz80Jp@cluster0.ygch4vp.mongodb.net/?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true });


app.use('/api', require('../routes/routes.js'));
app.use('/api', require('../routes/projectRoute.js'));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;
