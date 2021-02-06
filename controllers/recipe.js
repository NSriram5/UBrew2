const Sequelize = require('sequelize');
const Recipe= require('../models').Recipe;
const Op = require('../models/').Sequelize.Op;
module.exports={
    createRecipe(recipe){
        console.log(Recipe);
        console.log(user);
        return Recipe
            .create(recipe)
            .then((result)=>{
                console.log('Recipe Created');
                console.log(result);
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
                'style', 'public', 'shareable', 'instructions','userId'],
            })
            .then((result)=>{
                console.log('Recipe Found');
                console.log(result);
            })
            .catch(error=>{
                console.log(error, 'There was an error in the create');
            });
    },
}
