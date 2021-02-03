const user = require('./controllers/user');
const fs = require('fs');
let rawUser = fs.readFileSync('./test/TestData/user.json');
let userobj = JSON.parse(rawUser);
console.log(user);
console.log(userobj);
var result =  user.getUser('twahl@bu.edu');
console.log(result);
