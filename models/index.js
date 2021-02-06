const {Sequelize} = require('sequelize');
const config = require( '../config/config.js');
const path = require('path');
const fs = require('fs');
const basename= path.basename(__filename);
const db={};
//sequelize = new Sequelize(




// Option 1: Passing a connection URI
let sequelize;
sequelize = new Sequelize(
    config.configuration.databaseConfig.DATABASE_NAME,
    config.configuration.databaseConfig.DATABASE_USERNAME,
    config.configuration.databaseConfig.DATABSE_PASSWORD,
    config.configuration.databaseOptions
); // Example for postgres

fs
  .readdirSync(__dirname)
  .filter(file=>{
      return (file.indexOf('.') !==0 )&&(file!= basename) && (file.slice(-3)==='.js');
  })
  .forEach(file=>{
      const model = require(path.join(__dirname, file))(sequelize,Sequelize.DataTypes);
      db[model.name]=model;
});
Object.keys(db).forEach(modelName=>{
    if(db[modelName].associate){
        db[modelName].associate(db);
    }   
})
sequelize
    .sync({force:true})
    .then(()=>{ console.log('Connection has been established successfully.'); })
    .catch( (err) => { console.error('Unable to connect to the database:', error);});

db.sequelize=sequelize;
db.Sequelize = Sequelize;
module.exports = db;