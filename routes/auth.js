"use strict";

/** Routes for authentication. */

const jsonschema = require("jsonschema");

//const User = require("../models/user");
const { createUser, getUser } = require("../controllers/user")
const express = require("express");
const router = new express.Router();
const bcrypt = require("bcrypt");
const { createToken } = require("../helpers/tokens");
const userAuthSchema = require("../schemas/userAuth.json");
const userRegisterSchema = require("../schemas/userRegister.json");
const { BadRequestError, UnauthorizedError } = require("../expressError");
// const { delete } = require("../scripts");
const { BCRYPT_WORK_FACTOR } = require("../config.js");
const user = require("../controllers/user");

/** POST /auth/token:  { username, password } => { token }
 *
 * Returns JWT token which can be used to authenticate further requests.
 *
 * Authorization required: none
 */

router.post("/token", async function(req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, userAuthSchema);
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }

        const { email, password } = req.body;
        const user = await getUser({ email: email });
        const isValidPassword = await bcrypt.compare(password, user.passwordHash);
        if (isValidPassword === true) {
            delete user.passwordHash
            const token = createToken(user);
            return res.json({ token });
        } else {
            throw new UnauthorizedError("Invalid email/password");
        }

    } catch (err) {
        return next(err);
    }
});


/** POST /auth/register:   { user } => { token }
 *
 * user must include { username, password, firstName, lastName, email }
 *
 * Returns JWT token which can be used to authenticate further requests.
 *
 * Authorization required: none
 */

router.post("/register", async function(req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, userRegisterSchema);
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }
        const passwordHash = await bcrypt.hash(req.body.password, BCRYPT_WORK_FACTOR);
        delete req.body.password
        const newUser = await User.createUser({...req.body, passwordHash: passwordHash });
        delete user.passwordHash
        const token = createToken(newUser);
        return res.status(201).json({ token });
    } catch (err) {
        return next(err);
    }
});


module.exports = router;