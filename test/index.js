const user = require('../controllers/user');
const ingredient = require('../controllers/ingredients');
const index = require('../models/index');
const fs = require('fs');
const recipe = require('../controllers/recipe');
const style = require('../controllers/style');
module.exports = {
    async runDatabaseTests(forceOption={force:true}) {
       await index.sequelize
            .sync(forceOption)
            .then(() => { console.log('Connection has been established successfully.'); })
            .catch((err) => { console.error('Unable to connect to the database:', err); });
        //USER TEST
      //  console.log('past the sync');
        let rawUser = fs.readFileSync('./test/TestData/user.json');
        let userobj = JSON.parse(rawUser);
        await user.createUser(userobj[0]);
        await user.createUser(userobj[1]);
        //console.log(user);
        //console.log(userobj);
        //var createResult = await user.createUser(userobj);
        var result = await user.getUser({ email: 'twahl@bu.edu' });
        //console.log('result of get user');
        //console.log(result[0]);
        //console.log(result);
        let tempUser={};
        tempUser.userId=result[0].userId;
        tempUser.firstName = 'Moose';
        var userUpdateResult = await user.updateUser(tempUser);
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
        //console.log(stylesObj);
        var styleCreateResult = await style.bulkCreateStyles(stylesObj);
        //console.log(styleCreateResult);
        
        //RECIPETEST
        let rawRecipe = fs.readFileSync('./test/TestData/recipe.json');
        let recipeObj = JSON.parse(rawRecipe);
        //console.log(recipeObj);
       // recipeObj.userid = tempUser.userId;
        //recipeObj.styleId=1;
        createRecipes = async function(asyncrecipeObj, userId) {
            console.log(asyncrecipeObj);
            if(Array.isArray(asyncrecipeObj)){
                for(item in asyncrecipeObj){
                    asyncrecipeObj[item].userId = userId;
                    //item.styleId = 1;
                    console.log(asyncrecipeObj[item]);
                    rs = await recipe.createRecipe(asyncrecipeObj[item]);
                    console.log(rs);
                }
            }else{
                recipeCreateResult.userId = userId;
                var recipeCreateResult = await recipe.createRecipe(asyncrecipeObj); 
                return recipeCreateResult;
            }
        };
        await createRecipes(recipeObj, tempUser.userId);
        var recipeResult = await recipe.getRecipe();
        var fullRecipeResult = await recipe.getFullRecipe({id:recipeResult.rows[0].id})
        console.log('full recipe result');
        console.log(fullRecipeResult);
        fullRecipeResult.IBU=345;
        const deleteRecipe = fullRecipeResult;
        await recipe.updateRecipe(fullRecipeResult);
        console.log(recipeResult.rows[0].instructions);
        await recipe.deleteRecipe(deleteRecipe.token);
        const updatePass = await user.updateUser({userId:tempUser.userId, password:'plaintText!'});
        console.log(updatePass);
        const userdisable = await user.disableUser(tempUser.userId);
        console.log(userdisable);
    }
}