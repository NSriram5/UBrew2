const Sequelize = require('sequelize');
const Recipe= require('../models').Recipe;
const Ingredient = require('./ingredients');
const Op = require('../models/').Sequelize.Op;
const RecipeIngredient = require('./recipeIngredient');
module.exports={
    async createRecipe(recipe){
        console.log(recipe);
        let recipeIngredientList=[];
        for(element in  recipe.Ingredients){
            let indingredient={};
            indingredient.Name = recipe.Ingredients[element].Name;
             await Ingredient
                .createIngredient(indingredient)
                .then((result)=>{
                     let recipeIngredientItem ={};
                    recipeIngredientItem.ingredientId = result.id;
                    recipeIngredientItem.quantity = recipe.Ingredients[element].quantity;
                    recipeIngredientList.push(recipeIngredientItem);
                })
                .catch((exception)=>{
                    console.log(exception);
                    console.log('Error creating Ingredient');
                })
        };
         let newRecipe={};
        newRecipe.Name = recipe.Name;
        newRecipe.ABV = recipe.ABV;
        newRecipe.OG = recipe.OG;
        newRecipe.FG = recipe.FG;
        newRecipe.IBU = recipe.IBU;
        newRecipe.public = recipe.public;
        newRecipe.shareable=recipe.shareable;
        newRecipe.styleId = recipe.styleId;
        newRecipe.userid = recipe.userId;
        newRecipe.active = recipe.active;
        newRecipe.instructions = recipe.instructions;
         return Recipe
            .create(
                newRecipe, 
                {returning: ['Name','ABV', 'OG', 'FG','IBU',
                            'public','shareable','userid',
                            'active','instructions','styleId','id'
                ]})
            .then((result)=>{
                for(ri in recipeIngredientList){
                    recipeIngredientList[ri].recipeId = result.dataValues.id;
                };
                console.log('Recipe Created');
                console.log(recipeIngredientList);
                RecipeIngredient
                    .bulkCreate(recipeIngredientList)
                    .then((result)=>{
                        console.log(result);
                        console.log('Recipe Ingredients Bulk Created');
                    } )
                    .catch((riError)=>{
                        console.log(riError);
                        
                    });
                console.log(result);
                return result;
            })
            .catch(error=>{
                console.log(error, 'There was an error in the create');
            });
    },
    getRecipe(filter){
        let whereclause;
        whereclause={};
        if(filter.name){
            whereclause.Name = {[Op.iLike]:'%' + filter.name + '%'};
        }
        if(filter.style){
            whereclause.Style={[Op.iLike]:filter.style};
        }
        if(filter.token){
            whereclause.token={[Op.eq]:filter.token};
        }
        if(filter.userId){
            whereclause.userId = {[Op.eq]:filter.userId};
        }
        return Recipe
            .findAll({
                where: whereclause,
                attributes:['Name', 'ABV', 'OG', 'FG','IBU', 'token', 
                'styleId', 'public', 'shareable', 'instructions','userId'],
            })
            .then((result)=>{
                console.log('Recipe Found');
                console.log(result);
                return result;
            })
            .catch(error=>{
                console.log(error, 'There was an error in the create');
            });
    },
    deleteRecipe(token){
        let whereclause;
        whereclause.token={[Op.eq]:token};
        return Recipe
            .findOne({
                where:whereclause,
                attributes:['id']
                
            })
            .then((result)=>{
                let foundRecipe;
                foundRecipe.id=result.id;
                foundRecipe.active=false;
                Recipe.update(found);
            })
            .catch((error)=> {
                console.log(error);
                console.log('Error updating the recipe');
            });
    },


    
}
