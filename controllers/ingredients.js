const Sequelize = require('sequelize');
const Ingredient= require('../models').Ingredient;
const Op = require('../models/').Sequelize.Op;
module.exports={
    createIngredient(ingredient){
        console.log(Ingredient);
        console.log(ingredient);
        return Ingredient
            .create(ingredient)
            .then((result)=>{
                console.log('ingredient Created');
                console.log(result);
            })
            .catch(error=>{
                console.log(error, 'There was an error in the create');
            });
    },
    getIngredient(filter){
        let whereclause;
        whereclause={};
        if(filter.name){
            whereclause.Name = {[Op.iLike]:'%' + filter.name + '%'};
        }
        
        return Ingredient
            .findAll({
                where: whereclause,
                attributes:["Name", "Season"],
            })
            .then((result)=>{
                console.log('Ingredient Found');
                console.log(result);
            })
            .catch(error=>{
                console.log(error, 'There was an error in the create');
            });
    },

    getAllIngredients(){
        return Ingredient.findAll()
        .then((result)=>console.log(result))
        .catch(error=>{
            console.log(error,'There was an error retrieving Ingredients');
        });
    }
}
