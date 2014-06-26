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
 * Methodes utiles
 */
/***************************/
function sendSuccess(datas)
{
    return JSON.stringify({
        error: false,
        datas: datas
    }, null, 4);
}

function sendSuccessNext(datas, next)
{
    return JSON.stringify({
        error: false,
        datas: datas,
        next: next
    }, null, 4);
}

function sendError(message)
{
    return JSON.stringify({
        error: true,
        message: message
    }, null, 4);
}

function deleteQuotes(string)
{
    string = string.replace(/'/g, "");
    return string.replace(/"/g, "");
}



/***************************/
/**
 * Url de l'application
 */
/***************************/

/**
 * Recupere les bugs
 * GET /bugs
 * ?filters=name:value,name2:value2
 * &rows=rowName,rowName2
 * &offset=1
 */
app.get('/bugs', function (req, res)
{
    var options = [];

    /** FILTERS **/
    if (req.query.filters) {
        var filters = req.query.filters.split(',');

        for (var i = 0; i < filters.length; i++) {
            var currentFilter = filters[i].split(':');

            options["filters"][options.filters.length] = {
                name: currentFilter[0],
                value: currentFilter[1]
            };
        }
    }

    /** ROWS **/
    if (req.query.rows) {
        options.rows = deleteQuotes(req.query.rows);
    }

    /** PAGINATION **/
    if (req.query.offset) {
        options.currentPage = deleteQuotes(req.query.offset);
    }
    options.dataDisplayedPerPage = 10;


    bugsModel.get(options,
        function (results, next) {
            res.send(
                sendSuccessNext(results, next)
            );
        },
        function (message) {
            res.send(
                sendError(message)
            );
        }
    );
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