module.exports = (sequelize, DataTypes)=>{
    const Recipe = sequelize.define('Recipe',{
    // Model attributes are defined here
       id:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        Name: {
            type: DataTypes.STRING,
            allowNull: false
        },

        ABV: {
            type: DataTypes.FLOAT,
            allowNull: true
        },
        OG: {
            type: DataTypes.FLOAT,
            allowNull: true
        },
        FG: {
            type: DataTypes.FLOAT,
            allowNull: true
        },
        IBU: {
            type: DataTypes.FLOAT,
            allowNull: true
        },
        token: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false
        },
        public: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            default: false
        },
        shareable: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            default: false
        },
        instructions: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            default: true
        }



    });
    Recipe.associate=(models)=>{
        Recipe.belongsTo(models.Style,{
            foreignKey:'styleId',
            allowNull:true,
        });
        Recipe.belongsTo(models.User,{
            foreignKey:'userId',
            allowNull: true,
        });
        Recipe.belongsToMany(models.Ingredient,{
            through:'recipeIngredients',
            foreignKey:"recipeId",
            onDelete:'CASCADE'
        });
        
       
    }
    return Recipe;
}