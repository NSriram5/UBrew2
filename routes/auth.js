"use strict";

/** Routes for authentication. */

const jsonschema = require("jsonschema");

//const User = require("../models/user");
const User = require("../controllers/user")
const express = require("express");
const router = new express.Router();
const bcrypt = require("bcrypt");
const { createToken } = require("../helpers/tokens");
const userAuthSchema = require("../schemas/userAuth.json");
const userRegisterSchema = require("../schemas/userRegister.json");
const { BadRequestError, UnauthorizedError } = require("../expressError");
// const { delete } = require("../scripts");
const { BCRYPT_WORK_FACTOR } = require("../config/config");
//const user = require("../controllers/user");

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
            return res.json({ invalidMessage: "The form has not been filled out correctly" })
        }

        const { email, password } = req.body;
        const valid = await User.authenticateUser(email, password);
        if (!valid) {
            return res.json({ invalidMessage: "User email or password is incorrect" })
        }
        const token = createToken(valid);
        req.session.token = token;
        return res.json({ validMessage: "Token loaded. You are logged in" });
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

        await User.createUser({ user: req.body });
        const valid = await User.authenticateUser(req.body.email, req.body.password);
        const token = createToken(valid);
        req.session.token = token;
        return res.json({ validMessage: "User Created. Token loaded. You are logged in" });
        // return res.status(201).json({ token });
    } catch (err) {
        return next(err);
    }
});


module.exports = router;