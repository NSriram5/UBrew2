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
            defaultValue:DataTypes.UUIDV4,
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
        Recipe.belongsTo(models.Style,{
            foreginKey:'styleId',
            allowNull:true,
        });
    }
    return Recipe;
}