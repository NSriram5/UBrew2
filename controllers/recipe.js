const Sequelize = require('sequelize');
const Recipe = require('../models').Recipe;
const Ingredient = require('./ingredients');
const Op = require('../models/').Sequelize.Op;
const RecipeIngredient = require('./recipeIngredient');
module.exports = {
    createRecipe(recipe) {
        console.log(recipe);
        let recipeIngredientList = [];
        recipe.Ingredients.forEach(element => {
            let indingredient = {};
            indingredient.Name = element.Name;
            Ingredient
                .createIngredient(indingredient)
                .then((result) => {
                    console.log(result);
                    let recipeIngredientItem = {};
                    recipeIngredientItem.ingredientId = result.dataValues.id;
                    recipeIngredientItem.quantity = element.quantity;
                    recipeIngredientList.push(recipeIngredientItem);
                })
                .catch((exception) => {
                    console.log(exception);
                    console.log('Error creating Ingredient');
                })
        });
        let newRecipe = {};
        newRecipe.Name = recipe.name;
        newRecipe.ABV = recipe.ABV;
        newRecipe.OG = recipe.OG;
        newRecipe.FG = recipe.FG;
        newRecipe.IBU = recipe.IBU;
        newRecipe.public = recipe.public;
        newRecipe.shareable = recipe.shareable;
        newRecipe.Style = recipe.style;
        newRecipe.active = recipe.active;
        newRecipe.instructions = recipe.instructions;
        return Recipe
            .create(recipe)
            .then((result) => {
                recipeIngredientList.forEach((element) => {
                    element.recipeId = result.dataValues.id;
                });
                console.log('Recipe Created');
                console.log(recipeIngredientList);
                RecipeIngredient
                    .bulkCreate(recipeIngredientList)
                    .then((result) => {
                        console.log(result);
                        console.log('Recipe Ingredients Bulk Created');
                    })
                    .catch((riError) => {
                        console.log(riError);

                    });
                console.log(result);
                return result;
            })
            .catch(error => {
                console.log(error, 'There was an error in the create');
            });
    },
    getRecipe(filter) {
        let whereclause;
        whereclause = {};
        if (filter.name) {
            whereclause.Name = {
                [Op.iLike]: '%' + filter.name + '%'
            };
        }
        if (filter.style) {
            whereclause.Style = {
                [Op.iLike]: filter.style
            };
        }
        if (filter.token) {
            whereclause.token = {
                [Op.eq]: filter.token
            };
        }
        if (filter.userId) {
            whereclause.userId = {
                [Op.eq]: filter.userId
            };
        }
        return Recipe
            .findAll({
                where: whereclause,
                attributes: ['Name', 'ABV', 'OG', 'FG', 'IBU', 'token',
                    'public', 'shareable', 'instructions'
                ],
            })
            .then((result) => {
                console.log('Recipe Found');
                console.log(result);
                return result;
            })
            .catch(error => {
                console.log(error, 'There was an error in the find');
            });
    },
    deleteRecipe(token) {
        let whereclause;
        whereclause.token = {
            [Op.eq]: token
        };
        return Recipe
            .findOne({
                where: whereclause,
                attributes: ['id']

            })
            .then((result) => {
                let foundRecipe;
                foundRecipe.id = result.id;
                foundRecipe.active = false;
                Recipe.update(found);
            })
            .catch((error) => {
                console.log(error);
                console.log('Error updating the recipe');
            });
    },



}