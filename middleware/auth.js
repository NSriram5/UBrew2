"use strict";

/** Convenience middleware to handle common auth cases in routes. */

const jwt = require("jsonwebtoken");
const { restart } = require("nodemon");
const { SECRET_KEY } = require("../config/config");
const { UnauthorizedError } = require("../expressError");


/** Middleware: Authenticate user.
 *
 * If a token was provided, verify it, and, if valid, store the token payload
 * on res.locals (this will include the username and isAdmin field.)
 *
 * It's not an error if no token was provided or if the token is not valid.
 */

function authenticateJWT(req, res, next) {
    try {
        const authHeader = req.headers && req.headers.authorization;
        if (authHeader) {
            const token = authHeader.replace(/^[Bb]earer /, "").trim();
            res.locals.user = jwt.verify(token, SECRET_KEY);
        } else if (req.session.token) {
            console.log("Logged in as a person");
            res.locals.user = jwt.verify(req.session.token, SECRET_KEY);
        }

        return next();
    } catch (err) {
        return next();
    }
}

/** Middleware to use when they must be logged in.
 *
 * If not, raises Unauthorized.
 */

function ensureLoggedIn(req, res, next) {
    try {
        if (!res.locals.user) throw new UnauthorizedError();
        return next();
    } catch (err) {
        res.redirect('login');
        //return next(err);
    }
}

function ensureAdmin(req, res, next) {
    try {
        if (res.locals.user == false) {
            throw new UnauthorizedError();
        }
        if (res.locals.user.admin == false) {
            throw new ForbiddenError();
        }
        return next();
    } catch (err) {
        return next(err);
    }
}


module.exports = {
    authenticateJWT,
    ensureLoggedIn,
    ensureAdmin
};