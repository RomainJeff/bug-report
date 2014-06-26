module.exports = {
    connection: null,

    init: function (mysql)
    {
        this.connection = mysql;
    },

    /**
     * Recupere les donnees
     * @param array options
     *     filters : Les filtres
     *     rows : Les champs a selectionner
     *     currentPage : La page courante de pagination
     *     dataDisplayedPerPage : Nombre de donnees affichees par page
     * @param function successCallback
     * @param function errorCallback
     */
    get: function(options, successCallback, errorCallback)
    {
        var where = "";

        if (!options) {
            options = [];
        }

        /** FILTERS **/
        if (!options.filters) {
            options.filters = [];
        }

        var filters = options.filters;

        if (filters.length > 0) {
            where += "WHERE ";
        }

        for(var i = 0; i < filters.length; i++) {
            where += filters[i].name +" = '"+ filters[i].value +"'";

            if (i < filters.length - 1) {
                where += " AND ";
            }
        }

        /** ROWS **/
        if (!options.rows) {
            options.rows = "*";
        }

        /** PAGINATION **/
        if (!options.currentPage) {
            options.currentPage = 1;
        }

        if (!options.dataDisplayedPerPage) {
            options.dataDisplayedPerPage = 10;
        }

        if (options.currentPage > 1) {
            var start = (options.currentPage - 1) * options.dataDisplayedPerPage;
        } else {
            var start = 0;
        }


        var queryText  = "SELECT "+ options.rows +" AS total_entries FROM bugs "+ where +" GROUP BY message, type ORDER BY priority DESC, timestamp ASC";
        var queryToExe = queryText +" LIMIT "+ start +","+ options.dataDisplayedPerPage;
        var connection = this.connection;

        connection.query(queryToExe, function (error, rows, results)
        {
            if (error) {
                console.log("Erreur SQL");
                errorCallback("Erreur de requete SQL");
                return false;
            }

            /** PAGINATION **/
            start = (options.currentPage) * options.dataDisplayedPerPage;
            queryToExe = queryText +" LIMIT "+ start +","+ options.dataDisplayedPerPage;
            
            // On effectue la prochaine requete afin de savoir si 
            // il y a une page suivante
            connection.query(queryToExe, function (error, rowsSecond) {
                var next = false;

                // Si des donnees sont retournees il y a
                // une page suivante
                if (!error && rowsSecond.length > 0) {
                    next = true;
                }

                successCallback(rows, next);
            });
        });

    }

};