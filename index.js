const express = require("express");
const app = express();

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

const distancesRote = require('./routes/distance');
const popularSearshRote=require('./routes/popular-search')

app.use('/', distancesRote);
app.use('/', popularSearshRote);


app.listen(3000);


