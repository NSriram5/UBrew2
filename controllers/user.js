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
            console.log('No Password');
            return false;
        }
        return User
            .create(user)
            .then((result) => {
                console.log(result);
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
        const attributesclause = ['userId', 'email', 'admin', 'firstName', 'lastName']
        if (authenticate) { attributesclause.push('passwordHash'); }
        return User
            .findAll({
                where: whereclause,
                raw: true,
                attributes: attributesclause,
            })
            .then((result) => {
                console.log('User Found');
                console.log(result);
                return result;
            })
            .catch(error => {
                console.log(error, 'There was an error in the get');
            });
    },
    async updateUser(user) {
        let whereclause = {};
        if (user.password) {
            user.passwordHash = await bcrypt.hash(user.password, BCRYPT_WORK_FACTOR);
            delete user.password;
        }
        whereclause.userId = user.userId;
        return User
            .update(
                user, {
                    returning: ['firstName', 'lastName', 'email', 'admin',
                        'disabled', 'userId'
                    ],
                    raw:true,
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

    },
    async authenticateUser(email, password) {
        try {
            const user = await this.getUser({ email: email }, true);
            if (user[0] && user[0].passwordHash) {
                const valid = await bcrypt.compare(password, user[0].passwordHash);
                delete user[0].passwordHash;
                if (valid === true) {
                    console.log('User should be logged in');
                    return user[0];
                }
            }
            return false;

        } catch (error) {
            console.log(error, 'There was an error authenticating the user');
            return false;
        }
    },
    disableUser(userId){
        let whereclause = {};
        whereclause.userId = userId;
        return User
            .update(
                {disabled:true}, {
                    returning: true,
                    where: whereclause,
                    raw:true
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

        return results;
    }

}