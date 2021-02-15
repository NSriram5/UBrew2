module.exports = (sequelize, DataTypes)=>{
    const RecipeIngredient = sequelize.define('recipeIngredient',{
    // Model attributes are defined here
      

    });
    RecipeIngredient.associate=(models)=>{
        RecipeIngredient.belongsTo(models.Recipe,{
            foreignKey:'recipeId',
            onDelete: 'CASCADE'
        });
        RecipeIngredient.belongsTo(models.Ingredient,{
            foreignKey:'ingredientId',
            onDelete:'CASCADE',
        });
    };

    return RecipeIngredient;
};