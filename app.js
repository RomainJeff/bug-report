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
var trackersModel   = require("./models/trackers.js");
var keyModel        = require("./models/keys.js");



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
 * Verifie l'authenticite des clees
 */
/***************************/
var verifyPrivateKey = function (req, res, next)
{
    var key = deleteQuotes(req.query.key);

    if (!key) {
        res.send(
            401,
            sendError("La clée passée est invalide")
        );
        return false;
    }

    // On verifie l'existance de la clée dans la base de données
    keyModel.exists(key,
        function (){
            next();
        },

        function (message)
        {
            res.send(
                401,
                sendError(message)
            );
        }
    );
}



/***************************/
/**
 * Initialise la connexion MySQL
 */
/***************************/
var connection = mysql.createConnection(config.mysql);
connection.connect();

bugsModel.init(connection);
trackersModel.init(connection);
keyModel.init(connection);



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
 * ?filters=name:value,name2:value2     Filtrer les bugs
 * &rows=rowName,rowName2               Informations voulues
 * &offset=1                            Numero de la page
 */
app.get('/bugs', function (req, res)
{
    var options = [];

    /** FILTERS **/
    if (req.query.filters) {
        var filters = req.query.filters.split(',');
        options.filters = [];

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
 * Recupere les stats d'un bug
 * get /bugs/:type/:message
 * ?users=true          Nombre d'utilisateurs touches par le bug
 * &reproduction=true   Nombre total de reproduction du bug
 * &plateforme=true     Informations concernant les plateformes touchees
 * &last_seen=true      Date de la derniere apparition du bug
 * &version=true        Infos sur les versions de l'app touchees
 * &evolution=day       Evolution du bug (nombre de bugs & utilisateur touches) (day, week, month)
 */
app.get('/stats/:type/:message', function (req, res)
{
    var options = [];

    if (req.query.users) {
        options.users = req.query.users;
    }

    if (req.query.reproduction) {
        options.reproduction = req.query.reproduction;
    }

    if (req.query.plateforme) {
        options.plateforme = req.query.plateforme;
    }

    if (req.query.last_seen) {
        options.last_seen = req.query.last_seen;
    }

    if (req.query.version) {
        options.version = req.query.version;
    }

    if (req.query.evolution) {
        options.evolution = req.query.evolution;
    }

    
});


/**
 * Poste un bug
 * POST /bugs
 */
app.post('/bugs', verifyPrivateKey, function (req, res)
{
    var app_version         = deleteQuotes(req.body.app_version);
    var plateforme          = deleteQuotes(req.body.plateforme);
    var plateforme_version  = deleteQuotes(req.body.plateforme_version);
    var priority            = deleteQuotes(req.body.priority);
    var type                = deleteQuotes(req.body.type);
    var message             = deleteQuotes(req.body.message);
    var udid                = deleteQuotes(req.body.udid);
    var timestamp           = new Date().getTime();

    bugsModel.add([
        {
            name    : "app_version",
            value   : app_version
        },
        {
            name    : "platform",
            value   : plateforme
        },
        {
            name    : "platform_version",
            value   : plateforme_version
        },
        {
            name    : "priority",
            value   : priority
        },
        {
            name    : "type",
            value   : type
        },
        {
            name    : "message",
            value   : message
        },
        {
            name    : "UDID",
            value   : udid
        },
        {
            name    : "timestamp",
            value   : timestamp
        }
    ],
        function ()
        {
            res.send(
                sendSuccess("Le bug a bien été envoyé")
            );
        },
        function (message)
        {
            res.send(
                sendError(message)
            );
        }
    );
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
app.post('/trackers', verifyPrivateKey, function (req, res)
{
    var app_version         = deleteQuotes(req.body.app_version);
    var plateforme          = deleteQuotes(req.body.plateforme);
    var plateforme_version  = deleteQuotes(req.body.plateforme_version);
    var action              = deleteQuotes(req.body.action);
    var feature             = deleteQuotes(req.body.feature);
    var udid                = deleteQuotes(req.body.udid);
    var note                = deleteQuotes(req.body.note);
    var timestamp           = new Date().getTime();

    trackersModel.add([
        {
            name    : "UDID",
            value   : udid
        },
        {
            name    : "feature",
            value   : feature
        },
        {
            name    : "action",
            value   : action
        },
        {
            name    : "app_version",
            value   : app_version
        },
        {
            name    : "platform",
            value   : plateforme
        },
        {
            name    : "platform_version",
            value   : plateforme_version
        },
        {
            name    : "note",
            value   : note
        },
        {
            name    : "timestamp",
            value   : timestamp
        }
    ],
        function ()
        {
            res.send(
                sendSuccess("L'evenement a bien été ajouté")
            );
        },
        function (message)
        {
            res.send(
                sendError(message)
            );
        }
    );
});



/***************************/
/**
 * On lance l'app
 */
/***************************/
console.log("Application up !");
app.listen(3000);