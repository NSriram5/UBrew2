const user = require('../controllers/user');
const ingredient = require('../controllers/ingredients');
const fs = require('fs');
module.exports= {
    async runTests(){
        let rawUser = fs.readFileSync('./test/TestData/user.json');
        let userobj = JSON.parse(rawUser);
        console.log(user);
        console.log(userobj);
        var result =  user.getUser({email : 'twahl@bu.edu'});
        console.log(result);
        let rawIngredients = fs.readFileSync('./test/TestData/ingredients.json');
        let ingredientsObj = JSON.parse(rawIngredients);
        await ingredientsObj.forEach(element=>{
           console.log(element);
           // ingredient.createIngredient(element);
        });

        console.log(ingredient.getAllIngredients());    
    }
}


