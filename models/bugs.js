module.exports = {
    connection: null,

    init: function (mysql)
    {
        this.connection = mysql;
    },

    get: function(options, success)
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
                return false;
            }

            success(results);
        });

    }

};