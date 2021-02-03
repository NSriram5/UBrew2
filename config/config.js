const configuration = {
    databaseConfig:{
        DATABASE_USERNAME:'dbadmin',
        DATABSE_PASSWORD:'MaLtT3A&HoppZ',
        DATABASE_NAME:'uBrew2',
        DATABSE_URL :'127.0.0.1',
        DATABASE_PORT:'8000'
    },
    databaseOptions:{
        "host":"127.0.0.1",
        "dialect": "postgres",
        "freezeTableName":true,
        "port":8000,
        pool:{
            acquire:600000
        }
    }
}

module.exports.configuration=configuration;