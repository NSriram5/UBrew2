module.exports = (sequelize, DataTypes)=>{
    const Ingredient = sequelize.define('Ingredient',{
    // Model attributes are defined here
        Name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        Season: {
            type: DataTypes.STRING
            // allowNull defaults to true
        }
        

    });

    return Ingredient;
};