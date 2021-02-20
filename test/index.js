const user = require('../controllers/user');
const ingredient = require('../controllers/ingredients');
const index = require('../models/index');
const fs = require('fs');
const recipe = require('../controllers/recipe');
const style = require('../controllers/style');
module.exports = {
    async runDatabaseTests() {
        await index.sequelize
            .sync({ force: true })
            .then(() => { console.log('Connection has been established successfully.'); })
            .catch((err) => { console.error('Unable to connect to the database:', err); });
        //USER TEST
        let rawUser = fs.readFileSync('./test/TestData/user.json');
        let userobj = JSON.parse(rawUser);
        await user.createUser(userobj[0]);
        await user.createUser(userobj[1]);
        console.log(user);
        console.log(userobj);
        var createResult = await user.createUser(userobj);
        var result = await user.getUser({ email: 'twahl@bu.edu' });
        console.log('result of get user');
        //console.log(result[0]);
        console.log(result);
        let tempUser={};
        //tempUser.userId=result[0].userId;
        //tempUser.disabled = true;
       // var userUpdateResult = await user.updateUser(tempUser);
        //console.log('userUpdateResult');
        //console.log(userUpdateResult[1][0].dataValues);
        //console.log(await user.authenticateUser('twahl@bu.edu','T3stPassword'));
        //INGREDIENTS TEST
        let rawIngredients = fs.readFileSync('./test/TestData/ingredients.json');
        let ingredientsObj = JSON.parse(rawIngredients);
        /*await ingredientsObj.forEach(element=>{
           console.log(element);
            ingredient.createIngredient(element);
        });
        console.log(ingredient.getAllIngredients());*/

        //STYLE TEST
        let rawStyles = fs.readFileSync('./test/TestData/styles.json');
        let stylesObj = JSON.parse(rawStyles);
        console.log(stylesObj);
        var styleCreateResult = await style.bulkCreateStyles(stylesObj);
        console.log(styleCreateResult);
        
        //RECIPETEST
        let rawRecipe = fs.readFileSync('./test/TestData/recipe.json');
        let recipeObj = JSON.parse(rawRecipe);
        //console.log(recipeObj);
       // recipeObj.userid = tempUser.userId;
        recipeObj.styleId=1;

        var recipeCreateResult = await recipe.createRecipe(recipeObj); 
        console.log(recipeCreateResult);

        
    }
}