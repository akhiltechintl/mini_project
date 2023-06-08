const express = require("express");
const router = express.Router();
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.use('/task', require('../controller/taskController.js'));

module.exports = app;