const user = require('./controllers/user');
const fs = require('fs');
const test = require('./test');
const { configuration } = require('./config/config');
if(configuration.environmentOptions.environment =="LOCAL"){
    test.runTests();
}
