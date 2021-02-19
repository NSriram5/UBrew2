const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config/config");

/** return signed JWT from user data. */

function createToken(user) {
    console.assert(user.admin !== undefined,
        "createToken passed user without isAdmin property");

    let payload = {
        userId: user.userId,
        admin: user.admin || false,
    };
    return jwt.sign(payload, SECRET_KEY);
}

module.exports = { createToken };