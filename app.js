/**
 * Repoleak (c) 2014
 * @author Romain QUILLIOT
 * @version 1.0.0
 */

var express         = require("express");
var bodyParser      = require('body-parser');
var methodOverride  = require('method-override');
var app             = express();
var mysql           = require('mysql');
var config          = require("./config.js");

var bugsModel       = require("./models/bugs.js");



/***************************/
/**
 * Initialise les headers
 */
/***************************/
var initHeaders = function (req, res, next)
{
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "POST,GET,PUT,DELETE");
    res.header("Content-type", "application/json");

    next();
}



/***************************/
/**
 * Initialise la connexion MySQL
 */
/***************************/
var connection = mysql.createConnection(config.mysql);
connection.connect();

bugsModel.init(connection);



/***************************/
/**
 * Modules express
 */
/***************************/
app.use(initHeaders);
app.use(bodyParser());
app.use(methodOverride());



/***************************/
/**
 * Url de l'application
 */
/***************************/

/**
 * Recupere les bugs
 * GET /bugs
 */
app.get('/bugs', function (req, res)
{
    var options = [];

    if (req.query.filters) {
        var filters = req.query.filters.split(',');

        for (var i = 0; i < filters.length; i++) {
            var currentFilter = filters[i].split(':');

            options[options.length] = {
                name: currentFilter[0],
                value: currentFilter[1]
            };
        }
    }

    bugsModel.get(options, function (results) {
        res.send(
            JSON.stringify(results)
        );
    });
});


/**
 * Poste un bug
 * POST /bugs
 */
app.post('/bugs', function (req, res)
{
    
});


/**
 * Recupere un bug
 * GET /bugs/:id
 */
app.get('/bugs/:id', function (req, res)
{
    
});


/**
 * Modifie un bug
 * PUT /bugs/:id
 */
app.put('/bugs/:id', function (req, res)
{
    
});


/**
 * Supprime un bug
 * DELETE /bugs/:id
 */
app.delete('/bugs/:id', function (req, res)
{
    
});


/**
 * Recupere les evenements trackers
 * GET /trackers
 */
app.get('/trackers', function (req, res)
{
    
});


/**
 * Poste un nouvel evenement
 * POST /trackers
 */
app.post('/trackers', function (req, res)
{
    
});



/***************************/
/**
 * On lance l'app
 */
/***************************/
console.log("Application up !");
app.listen(3000);