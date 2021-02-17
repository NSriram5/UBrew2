const RecipeIngredient = require('../models').recipeIngredients;
const Op = require('../models/').Sequelize.Op;
module.exports={
    bulkCreate(recipeIngredientList){
        return RecipeIngredient
                .bulkCreate(recipeIngredientList)
                .then((result)=>{
                    console.log(result);
                    console.log('successfully created ingredients');
                    return result;
                })
                .catch((err)=>{
                    console.log(err);
                    console.log('THere was an error in the bulk creation of recipe ingredients');
                    return err;
                });
    }

}