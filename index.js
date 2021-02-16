const user = require('./controllers/user');
const fs = require('fs');
const test = require('./test');
const app = require('./scripts/index')
const { configuration } = require('./config/config');
if (configuration.environmentOptions.environment == "LOCAL") {
    test.runTests();
}

app.listen(3000, function() {
    console.log("Listening on 3000");
})