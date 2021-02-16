const configuration = {
    databaseConfig: {
        DATABASE_USERNAME: 'artain',
        DATABSE_PASSWORD: '',
        DATABASE_NAME: 'ubrew2',
        DATABSE_URL: '127.0.0.1',
        DATABASE_PORT: '5432'
    },
    databaseOptions: {
        "host": "127.0.0.1",
        "dialect": "postgres",
        "freezeTableName": true,
        "port": 5432,
        pool: {
            acquire: 600000
        },
        "logging": false
    },
    environmentOptions: {
        environment: "LOCAL",
    }
}

module.exports.configuration = configuration;
module.exports.BCRYPT_WORK_FACTOR = process.env.NODE_ENV === "test" ? 1 : 12;
module.exports.SESSION_SECRET = "brewbrewbrewhaha"