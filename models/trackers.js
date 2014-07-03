module.exports = {
    connection: null,

    init: function (mysql)
    {
        this.connection = mysql;
    },

    /**
     * Ajoute une donnee
     * @param array fields
     * @param function successCallback
     * @param function errorCallback
     * 
     * @return boolean
     */
    add : function (fields, successCallback, errorCallback)
    {
        var query = "INSERT INTO trackers SET ";

        if (!fields || fields.length < 1) {
            errorCallback("Aucun champs passé");
            return false;
        }

        for (var i = 0; i < fields.length; i++) {
            query += fields[i].name +" = '"+ fields[i].value +"'";

            if (i < fields.length - 1) {
                query += ", ";
            }
        }

        this.connection.query(query, function (error)
        {
            if (error) {
                errorCallback("Impossible d'ajouter l'événement");
                return false;
            }

            successCallback();
        });

        return true;
    }

};