const Sequelize = require('sequelize');
const User = require('../models').User;
const Op = require('../models/').Sequelize.Op;
module.exports = {
    createUser(user) {
        console.log(User);
        console.log(user);
        return User
            .create(user)
            .then((result) => {
                console.log('User Created');
                console.log(result);
            })
            .catch(error => {
                console.log(error, 'There was an error in the create');
            });
    },
    async getUser(filter) {
        let whereclause;
        whereclause = {};
        if (filter.email) {
            whereclause.email = {
                [Op.eq]: filter.email
            };
        }
        if (filter.firstname) {
            whereclause.firstName = {
                [Op.iLike]: '%' + filter.firstname + '%'
            };
        }
        if (filter.lastname) {
            whereclause.lastName = {
                [Op.iLike]: '%' + filter.lastname + '%'
            };
        }
        if (filter.userId) {
            whereclause.userId = {
                [Op.eq]: filter.userId
            };
        }
        const results = User
            .findAll({

                where: whereclause,
                attributes: ['userId', 'email', 'admin', 'firstName', 'lastName', 'passwordHash'],
            })
            .then((result) => {
                debugger;
                console.log('User Found');
                console.log(result);
                return result
            })
            .catch(error => {
                console.log(error, 'There was an error in the create');
            });

        debugger;
        return results;
    },
}