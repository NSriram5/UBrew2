module.exports = (sequelize, DataTypes)=>{
    const Brew = sequelize.define('Brew',{
    // Model attributes are defined here
        F: {
            type: DataTypes.STRING,
            allowNull: false
        },
        lastName: {
            type: DataTypes.STRING
            // allowNull defaults to true
        },
        passwordHash:{
            type:DataTypes.STRING,
            allowNull:false
        },
        email:{
            type:DataTypes.STRING,
            allowNull:false
        },
        admin:{
            type:DataTypes.BOOLEAN,
            allowNull:false,
            defaultValue:false
        },
        userId:{
            type:DataTypes.UUID,
            allowNull:false
        }

    });
    
    return Brew;
}