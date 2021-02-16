const user = require('../controllers/user');
const ingredient = require('../controllers/ingredients');
const index = require('../models/index');
const fs = require('fs');
module.exports = {
    async runTests() {
        await index.sequelize
            .sync({ force: true })
            .then(() => { console.log('Connection has been established successfully.'); })
            .catch((err) => { console.error('Unable to connect to the database:', err); });
        let rawUser = fs.readFileSync('./test/TestData/user.json');
        let userobj = JSON.parse(rawUser);
        await user.createUser(userobj);
        console.log(user);
        console.log(userobj);
        var result = await user.getUser({ email: 'twahl@bu.edu' });
        debugger;
        console.log(result);
        let rawIngredients = fs.readFileSync('./test/TestData/ingredients.json');
        let ingredientsObj = JSON.parse(rawIngredients);
        await ingredientsObj.forEach(element => {
            console.log(element);
            ingredient.createIngredient(element);
        });

        console.log(ingredient.getAllIngredients());
    }
}