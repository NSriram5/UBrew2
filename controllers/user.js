const Sequelize = require('sequelize');
const User= require('../models').User;

module.exports={
    createUser(user){
        console.log(User);
        console.log(user);
        return User
            .create(user)
            .then((result)=>{
                console.log('User Created');
                console.log(result);
            })
            .catch(error=>{
                console.log(error, 'There was an error in the create');
            });
    },
    getUser(email){
        
        return User
            .findAll({
                where:{
                    email:{[Op.eq]:email}
                },
                attributes:['userId', 'email', 'admin', 'firstName','lastName'],
            })
            .then((result)=>{
                console.log('User Found');
                console.log(result);
            })
            .catch(error=>{
                console.log(error, 'There was an error in the create');
            });
    },
}
