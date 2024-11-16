const express = require("express");
const app = express();
/*const db = require("../db/connection");*/
const router = require('../routes/users.js');
const routershows = require('../routes/shows.js')
app.use('/users', router);
app.use('/shows',routershows);
app.use(express.json());
app.use(express.urlencoded({extended: true  }))



module.exports = app;