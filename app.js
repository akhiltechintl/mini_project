const express = require('express');
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// mongoose.connect("mongodb+srv://akhilnmptf:zxDdPDUt1XXz80Jp@cluster0.ygch4vp.mongodb.net/?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connect("mongodb://0.0.0.0:27017/workluge", { useNewUrlParser: true, useUnifiedTopology: true });


app.use('/api/auth', require('./routes/Authroute.js'));
app.use('/api/project', require('./routes/projectRoute.js'));
app.use('/api/task', require('./routes/taskRouter.js'));
app.use('/api/people', require('./routes/PeopleRoute'));
app.use('/api/portfolio', require('./routes/PortfolioRoute'));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;
