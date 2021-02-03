
module.exports = (sequelize, DataTypes)=>{
    const User = sequelize.define('User',{
    // Model attributes are defined here
        firstName: {
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
            unique:true,
            allowNull:false
        },
        admin:{
            type:DataTypes.BOOLEAN,
            allowNull:false,
            defaultValue:false
        },
        disabled:{
            type:DataTypes.BOOLEAN,
            allowNull:false,
            defaultValue:false
        },
        userId:{
            type:DataTypes.UUID,
            defaultValue:DataTypes.UUIDV4,
            allowNull:false,
            primaryKey:true
        }

    });

    return User;
}