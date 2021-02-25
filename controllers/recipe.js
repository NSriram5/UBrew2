const Sequelize = require('sequelize');
const Recipe = require('../models').Recipe;
const Ingredient = require('./ingredients');
const Op = require('../models/').Sequelize.Op;
const RecipeIngredient = require('./recipeIngredient');
const RecipeIngredientModel = require('../models').recipeIngredients;
const Ingredientmodel = require('../models').Ingredient;
module.exports = {
    async createRecipe(recipe) {
        let recipeIngredientList = [];
        for (element in recipe.Ingredients) {
            let indingredient = {};
            indingredient.Name = recipe.Ingredients[element].Name;
            await Ingredient
                .createIngredient(indingredient)
                .then((result) => {
                    let recipeIngredientItem = {};
                    recipeIngredientItem.ingredientId = result.id;
                    recipeIngredientItem.quantity = recipe.Ingredients[element].quantity;
                    recipeIngredientList.push(recipeIngredientItem);
                })
                .catch((exception) => {
                    console.log(exception);
                    console.log('Error creating Ingredient');
                })
        };
        let newRecipe = {};
        newRecipe.Name = recipe.Name;
        newRecipe.ABV = recipe.ABV;
        newRecipe.OG = recipe.OG;
        newRecipe.FG = recipe.FG;
        newRecipe.IBU = recipe.IBU;
        newRecipe.public = recipe.public;
        newRecipe.shareable = recipe.shareable;
        newRecipe.styleId = recipe.styleId;
        newRecipe.userId = recipe.userId;
        newRecipe.active = recipe.active;
        newRecipe.instructions = recipe.instructions;
        return Recipe
            .create(
                newRecipe, {
                    returning: ['Name', 'ABV', 'OG', 'FG', 'IBU',
                        'public', 'shareable', 'userId',
                        'active', 'instructions', 'styleId', 'id'
                    ]
                })
            .then((result) => {
                for (ri in recipeIngredientList) {
                    recipeIngredientList[ri].recipeId = result.dataValues.id;
                };
                console.log('Recipe Created');
                //console.log(recipeIngredientList);
                RecipeIngredient
                    .bulkCreate(recipeIngredientList)
                    .then((result) => {
                        // console.log(result);
                        //console.log('Recipe Ingredients Bulk Created');
                    })
                    .catch((riError) => {
                        console.log(riError);

                    });
                //console.log(result);
                return result;
            })
            .catch(error => {
                console.log(error, 'There was an error in the create');
            });
    },
    getRecipe(filter) {
        let whereclause;
        whereclause = {};
        let offsetClause = {};
        let limitClause = {};
        whereclause.public = {
            [Op.eq]: true
        };
        if (filter == undefined) { filter = {}; }
        if (filter.name) {
            whereclause.Name = {
                [Op.iLike]: '%' + filter.name + '%'
            };
        }
        if (filter.style) {
            whereclause.styleId = {
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
        if (filter.shareable) {
            whereclause.shareable = {
                [Op.eq]: filter.shareable
            };
        }
        if (filter.ABV) {
            whereclause.ABV = {
                [Op.eq]: filter.ABV
            };
        }
        if (filter.IBU) {
            whereclause.IBU = {
                [Op.eq]: filter.IBU
            };
        }
        if (filter.offset) {
            offsetClause.offset = filter.offset;
        } else { offsetClause.offset = 0; }
        if (filter.limit) {
            limitClause.limit = filter.limit;
        } else { limitClause.limit = 21; }
        //console.log(whereclause);
        return Recipe
            .findAndCountAll({
                model: Recipe,
                where: whereclause,
                limitClause,
                offsetClause,
                raw: true,
                attributes: ['id', 'Name', 'ABV', 'OG', 'FG', 'IBU', 'token',
                    'styleId', 'public', 'shareable', 'active', 'instructions', 'userId', 'active'
                ],

            })
            .then((result) => {
                console.log('Recipe Found');
                //console.log(result);
                return result;
            })
            .catch(error => {
                console.log(error, 'There was an error in the find');
            });
    },
    getFullRecipe(filter) {
        let whereclause;
        whereclause = {};
        let offsetClause = {};
        let limitClause = {};
        whereclause.public = {
            [Op.eq]: true
        };
        //console.log(filter);
        if (filter == undefined) { filter = {}; }
        if (filter.name) {
            whereclause.Name = {
                [Op.iLike]: '%' + filter.name + '%'
            };
        }
        if (filter.style) {
            whereclause.styleId = {
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
        if (filter.shareable) {
            whereclause.shareable = {
                [Op.eq]: filter.shareable
            };
        }
        if (filter.ABV) {
            whereclause.ABV = {
                [Op.eq]: filter.ABV
            };
        }
        if (filter.IBU) {
            whereclause.IBU = {
                [Op.eq]: filter.IBU
            };
        }
        if (filter.id) {
            whereclause.id = {
                [Op.eq]: filter.id
            };
        }
        if (filter.offset) {
            offsetClause.offset = filter.offset;
        } else { offsetClause.offset = 0; }
        if (filter.limit) {
            limitClause.limit = filter.limit;
        } else { limitClause.limit = 21; }
        //console.log(whereclause);
        return Recipe
            .findAll({

                raw: true,
                include: [
                    { model: Ingredientmodel, attributes: ["id", "Name"] },
                    //    {model:RecipeIngredientModel,attributes:['quantity']}
                ],
                where: whereclause,
                limitClause,
                offsetClause,
                //group:['Ingredients.id', 'Recipe.id','Ingredients->recipeIngredients.quantity'],

                nest: true,
                attributes: ['id', 'Name', 'ABV', 'OG', 'FG', 'IBU', 'token',
                    'styleId', 'public', 'shareable', 'instructions', 'userId'
                ],
                //}]
            })
            .then((result) => {
                //console.log(result);
                var tempRes = result[0];
                //console.log(tempRes.Ingredients);
                IngrdeientArray = [];
                //tempRes.Ingredients = [];
                for (index in result) {
                    //console.log(result);
                    var item = result[index];
                    var ing = item.Ingredients;
                    //console.log('this is item?');
                    //console.log(item);
                    //console.log(item.Ingredients.recipeIngredients);
                    //console.log(ing.recipeIngredients);
                    //console.log(result[index].Ingredients)
                    ing.quantity = result[index].Ingredients.recipeIngredients.quantity;
                    delete ing.recipeIngredients;
                    IngrdeientArray.push(ing);
                }
                tempRes.Ingredients = IngrdeientArray;
                //console.log(tempRes);
                return tempRes;
            })
            .catch(error => {
                console.log(error, 'There was an error in the find');
            });
    },
    deleteRecipe(token) {
        let whereclause = {};
        whereclause.token = {
            [Op.eq]: token
        };
        return Recipe
            .findOne({
                where: whereclause,
                attributes: ['id'],
                raw: true,
            })
            .then((result) => {
                console.log(result);
                let foundRecipe = {};
                foundRecipe.id = result.id;
                foundRecipe.active = false;
                Recipe.update(
                        foundRecipe, {
                            where: { id: foundRecipe.id },
                            returning: true,
                            raw: true
                        })
                    .then((result) => { console.log(result); });
            })
            .catch((error) => {
                console.log(error);
                console.log('Error updating the recipe');
            });
    },
    getMyRecipes(userid) {
        let whereclause = {};
        whereclause.userId = {
            [Op.eq]: userid
        };
        return Recipe
            .findAll({
                where: whereclause,
                raw: true,
                attributes: ['id', 'Name', 'ABV', 'OG', 'FG', 'IBU', 'token',
                    'styleId', 'public', 'shareable', 'instructions', 'userId'
                ],
            })
            .catch((error) => {
                console.log(error);
                return error;
            })
    },
    async updateRecipe(recipe) {
        var res = await Recipe.findOne({
            where: { Name: recipe.Name },
            raw: true
        });
        //console.log(res);
        if (!res) {
            console.log('recipe doesn\'t exist');
            return { error: true, message: 'The recipe doesn\'t exist. please create it first.' };
        }
        let returnRecipeIngredients = RecipeIngredient.getRecipeIngredients({ recipeId: recipe.id });
        let recipeIngredientList = [];
        for (element in recipe.Ingredients) {
            let indingredient = {};
            indingredient.Name = recipe.Ingredients[element].Name;
            await Ingredient
                .createIngredient(indingredient)
                .then((result) => {
                    let recipeIngredientItem = {};
                    recipeIngredientItem.ingredientId = result.id;
                    recipeIngredientItem.quantity = recipe.Ingredients[element].quantity;
                    recipeIngredientItem.recipeId = recipe.id;
                    recipeIngredientList.push(recipeIngredientItem);
                })
                .catch((exception) => {
                    console.log(exception);
                    console.log('Error creating Ingredient');
                })
        };

        let newRecipe = {};
        newRecipe.Name = recipe.Name;
        newRecipe.ABV = recipe.ABV;
        newRecipe.OG = recipe.OG;
        newRecipe.FG = recipe.FG;
        newRecipe.IBU = recipe.IBU;
        newRecipe.public = recipe.public;
        newRecipe.shareable = recipe.shareable;
        newRecipe.styleId = recipe.styleId;
        newRecipe.userId = recipe.userId;
        newRecipe.active = recipe.active;
        newRecipe.instructions = recipe.instructions;
        newRecipe.id = recipe.id;
        let returnedRecipeIngredients = await returnRecipeIngredients;
        for (temp in recipeIngredientList) {
            newIngredient = recipeIngredientList[temp];
            var altered = true;
            var newRi = true;
            console.log('new Ingredient');
            console.log(newIngredient);
            console.log(returnedRecipeIngredients);
            for (existing in returnedRecipeIngredients) {
                console.log(newIngredient.ingredientId);
                console.log(returnedRecipeIngredients[existing].ingredientId);
                if (returnedRecipeIngredients[existing].ingredientId == newIngredient.ingredientId) {
                    newRi = false;
                    newIngredient.id = returnedRecipeIngredients[existing].id;
                    if (returnedRecipeIngredients[existing].quantity == newIngredient.quantity) {
                        altered = false;
                    }
                }
            }
            if (altered || newRi) {
                console.log(newIngredient);
                RecipeIngredient.updateOrCreateRecipeIngredient(newIngredient);
            }
        }
        return Recipe
            .update(
                newRecipe, {
                    where: { id: newRecipe.id },
                    returning: true,
                    raw: true
                })
            .then((result) => {
                console.log(result);

                //console.log('Recipe updated');
                //console.log(recipeIngredientList);
                /*RecipeIngredient
                    .bulkCreate(recipeIngredientList)
                    .then((result) => {
                       // console.log(result);
                        //console.log('Recipe Ingredients Bulk Created');
                    })
                    .catch((riError) => {
                        console.log(riError);

                    });*/
                //console.log(result);
                return result;
            })
            .catch(error => {
                console.log(error, 'There was an error in the create');
            });
    }

}