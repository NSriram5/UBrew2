const user = require('./controllers/user');
const fs = require('fs');
const test = require('./test');
const index = require('./models/index');
const { configuration } = require('./config/config');
if(configuration.environmentOptions.environment =="LOCAL"){
    test.runDatabaseTests();
}
if(configuration.environmentOptions.environment=="AWS"){
    
}
