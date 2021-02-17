const e = require("express");

module.exports=(sequelize, DataTypes) =>{
    const Style = sequelize.define('Style',{
        id:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name:{
            type:DataTypes.STRING,
            allowNull:false
        },
        color:{
            type:DataTypes.STRING,
            allowNull:false
        }

    }) ;

    return Style;
}