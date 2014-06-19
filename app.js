var express         = require("express");
var bodyParser      = require('body-parser');
var methodOverride  = require('method-override');
var app             = express();
var config          = require("./config.js");


/**
 * Initialise les headers
 *
 */
var initHeaders = function (req, res, next)
{
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "POST,GET,PUT,DELETE");
    res.header("Content-type", "application/json");

    next();
}


/**
 * Modules express
 */
app.use(initHeaders);
app.use(bodyParser());
app.use(methodOverride());


/**
 * On lance l'app
 */
app.listen(3000);