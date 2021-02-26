const Sequelize = require('sequelize');
const Ingredient= require('../models').Ingredient;
const Op = require('../models/').Sequelize.Op;
module.exports={
    createIngredient(ingredient){
        let whereclause ={};
        whereclause.Name={[Op.iLike]:'%' + ingredient.Name + '%'};
        return Ingredient
            .findOne({
                where: whereclause,
                attributes:['id','Name']
            })
            .then((result)=>{
                //console.log(result);
                if(result === null){
                    console.log('couldnt find an ingredient, creating');
                    result = Ingredient.create(ingredient,{returning:['id','Name']});
                }
                else{
                    console.log('ingredient found');
                    //console.log(result);
                }
                return result;
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
                attributes:["Name"],
            })
            .then((result)=>{
                console.log('Ingredient Found');
                //console.log(result);
                return ingredient;
            })
            .catch(error=>{
                console.log(error, 'There was an error in the create');
            });
    },

    getAllIngredients(){
        return Ingredient.findAll()
        .then((result)=>{/*console.log(result); */ return result;})
        .catch(error=>{
            console.log(error,'There was an error retrieving Ingredients');
        });
    }
}
