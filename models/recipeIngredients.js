module.exports = (sequelize, DataTypes)=>{
    const RecipeIngredient = sequelize.define('recipeIngredients',{
    // Model attributes are defined here
        quantity:{
            type:DataTypes.FLOAT,
            allowNull:true
        },
        id:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
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