module.exports = (sequelize, DataTypes)=>{
    const Recipe = sequelize.define('Recipe',{
    // Model attributes are defined here
        Name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        
        ABV:{
            type:DataTypes.FLOAT,
            allowNull:true
        },
        OG:{
            type:DataTypes.FLOAT,
            allowNull:true
        },
        FG:{
            type:DataTypes.FLOAT,
            allowNull:true
        },
        IBU:{
            type:DataTypes.FLOAT,
            allowNull:true
        },
        token:{
            type:DataTypes.UUID,
            allowNull:false
        },
        public:{
            type:DataTypes.BOOLEAN,
            allowNull:false,
            default:false
        },
        shareable:{
            type:DataTypes.BOOLEAN,
            allowNull:false,
            default: false
        },
        instructions:{
            type:DataTypes.BLOB,
            allowNull:false,
        },
        Style:{
            type:DataTypes.STRING,
            allowNull:true
        },
        active:{
            type:DataTypes.BOOLEAN,
            allowNull:false,
            default:true   
        }



    });
    Recipe.associate=(models)=>{
        Recipe.belongsTo(models.User,{
            foreignKey:'userid',
            allowNull: true,
        });
    }
    return Recipe;
}