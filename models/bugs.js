module.exports = {
    connection: null,

    init: function (mysql)
    {
        this.connection = mysql;
    },

    get: function(options, successCallback, errorCallback)
    {
        var where = "";

        if (!options) {
            options = [];
        }

        if (options.length > 0) {
            where += "WHERE ";
        }

        for(var i = 0; i < options.length; i++) {
            where += options[i].name +" = '"+ options[i].value +"'";

            if (i < options.length - 1) {
                where += " AND ";
            }
        }

        this.connection.query("SELECT * FROM bugs "+ where, function (error, results)
        {
            if (error) {
                console.log("Erreur SQL");
                errorCallback("Erreur de requete SQL");
                return false;
            }

            successCallback(results);
        });

    }

};