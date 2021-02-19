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
    return Ingredient;
};