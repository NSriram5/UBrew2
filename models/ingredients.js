module.exports = (sequelize, DataTypes)=>{
    const Ingredient = sequelize.define('Ingredient',{
    // Model attributes are defined here
        id:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        Name: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });
    Ingredient.associate=(models)=>{
        Ingredient.belongsToMany(models.Recipe,{
            through:'recipeIngredients',
            foreignKey:"ingredientId"
        });
    }
    return Ingredient;
};