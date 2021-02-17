const Sequelize = require('sequelize');
const User = require('../models').User;
const Op = require('../models/').Sequelize.Op;
const bcrypt = require("bcrypt");
const { BCRYPT_WORK_FACTOR } = require("../config/config.js");
module.exports = {
    async createUser(user) {
        console.log(User);
        console.log(user);
        if (user.password) {
            user.passwordHash = await bcrypt.hash(user.password, BCRYPT_WORK_FACTOR);
            delete user.password;
        } else {
            return false;
        }
        return User
            .create(user)
            .then((result) => {
                const userResult = result.get({ plain: true });
                delete userResult.passwordHash;
                return userResult;
            })
            .catch(error => {
                console.log(error, 'There was an error in the create');
            });
    },
    getUser(filter, authenticate = false) {
        let whereclause
        whereclause = {};
        if (filter.email) {
            whereclause.email = {
                [Op.eq]: filter.email };
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
        const attributesclause = ['userId', 'email', 'admin', 'firstName', 'lastName']
        if (authenticate) { attributesclause.push('passwordHash'); }
        return User
            .findAll({

                where: whereclause,
                raw: true,

                attributes: attributesclause,
            })
            .then((result) => {
                debugger;
                console.log('User Found');
                console.log(result);
                return result;
            })
            .catch(error => {
                console.log(error, 'There was an error in the get');
            });
    },
    updateUser(user) {
        let whereclause = {};
        whereclause.userId = user.userId;
        return User
            .update(
                user, {
                    returning: ['firstName', 'lastName', 'email', 'admin',
                        'disabled', 'userId'
                    ],
                    where: whereclause
                }
            )
            .then((result) => {
                //console.log('User updated');
                //const userResult = result.get({plain:true});

                //console.log(result);
                return result;
            })
            .catch(error => {
                console.log(error, 'There was an error in the create');
            });

        debugger;
        return results;
    },
    async authenticateUser(email, password) {
        try {
            const user = await this.getUser({ email: email }, true);
            if (user[0].passwordHash) {
                const valid = await bcrypt.compare(password, user[0].passwordHash);
                delete user[0].passwordHash;
                if (valid === true) {
                    return user[0];
                }
            }
            return false;

        } catch (error) {
            console.log(error, 'There was an error authenticating the user');
            return false;
        }
    }

}