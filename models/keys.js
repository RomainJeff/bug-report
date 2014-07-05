module.exports = {
    connection : null,

    init : function (connection)
    {
        this.connection = connection;
    },

    exists : function (key, successCallback, errorCallback)
    {
        this.connection.query("SELECT COUNT(id) FROM keys WHERE api_key = '"+ key +"'", function (error, rows)
        {
            if (error) {
                errorCallback("La clee passée est invalide");

                return false;
            }

            successCallback();
        });
    }
};