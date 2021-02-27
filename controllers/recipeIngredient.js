const RecipeIngredient = require('../models').recipeIngredients;
const Op = require('../models/').Sequelize.Op;
module.exports={
    bulkCreate(recipeIngredientList){
        return RecipeIngredient
                .bulkCreate(recipeIngredientList)
                .then((result)=>{
                   // console.log(result);
                    console.log('successfully created ingredients');
                    return result;
                })
                .catch((err)=>{
                    console.log(err);
                    console.log('THere was an error in the bulk creation of recipe ingredients');
                    return err;
                });
    },
    
    getRecipeIngredients(filter){
        if(filter==undefined){
            return {error: 'You must submit filter criteria'};
        }
        let whereclause={};
        if(filter.recipeId){
            whereclause.recipeId=filter.recipeId;
        }
        else if(filter.ingredientId){
            whereclause.ingredientId = filter.ingredientId
        }
        else{
            return {error: 'you must submit filter criteria'};
        }

        return RecipeIngredient
            .findAll({
                where:whereclause,
                returning:['id','recipeId','ingredientId','quantity'],
                raw:true
            })
            .catch((error)=>{
                console.log(error);
                return error;
            });
    },
    updateOrCreateRecipeIngredient(recipeIngredient){
       
        console.log(recipeIngredient);
        return RecipeIngredient
                .upsert(
                    recipeIngredient)
                .then((result)=>{
                    console.log(result);
                    console.log('successfully created ingredients');
                    return result;
                })
                .catch((err)=>{
                    console.log(err);
                    console.log('THere was an error in the  creation of recipe ingredients');
                    return err;
                });
    },

}