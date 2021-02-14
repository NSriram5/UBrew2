/** User routes for UBrew2 */

const express = require("express");

const { ensureLoggedIn, ensureAdmin } = require("../middleware/auth");
const User = require("./models/user");
const Recipe = require("./models/recipe");
const { BadRequestError, UnauthorizedError, ForbiddenError } = require("../expressError");
const { createToken } = require("../helpers/tokens");
const userNewSchema = require("../schemas/userNew.json");
const userUpdateSchema = require("../schemas/userUpdate.json");
const { use } = require("../scripts");

const router = new express.Router();


/** GET / => Users list
 *
 * Returns rendered list of all users.
 *
 * Authorization required: login, admin
 **/
router.get("/", ensureLoggedIn, ensureAdmin, async function(req, res, next) {
    try {
        const users = await User.findAll();
        return res.render("users_list.html", { users });
    } catch (err) {
        return next(err);
    }
});

/** GET /[username] => { user }
 *
 * Returns render of user page with associated recipes
 *
 * Authorization required: login, admin OR user of page being requested
 **/
router.get("/:userId", ensureLoggedIn, async function(req, res, next) {
    try {
        if (res.locals.user.isAdmin == false && res.locals.user.userId != req.params.userId) {
            throw new ForbiddenError("Only an admin or the user of this account can see these details");
        }
        const user = await User.get(req.params.userId);
        const recipes = await user.getRecipes();

        return res.render("user_details.html", { customer, recipes });
    } catch (err) {
        return next(err);
    }
})

/** PATCH /[username] => { user }
 *
 * Returns render of the user page with the information updated
 *
 * Authorization required: login, admin OR user of page being requested
 **/
router.patch("/:username/edit/", async function(req, res, next) {
    try {
        const user = await User.get(req.params.username);

        const validator = jsonschema.validate(req.body, userUpdateSchema);
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }
        //TODO: Update this to match model
        user.firstName = req.body.firstName;
        user.lastName = req.body.lastName;
        user.phone = req.body.phone;
        user.bio = req.body.bio;
        await user.save();

        return res.redirect(`/${customer.username}`);
    } catch (err) {
        return next(err);
    }
});

/** DELETE /[username] => Removed user
 * 
 *  Returns render of homepage with user removed
 *  
 *  Authorization required: login OR admin
 **/
router.delete("/:username", ensureLoggedIn, async function(req, res, next) {
    try {
        if (res.locals.user.isAdmin == false && res.locals.user.username != req.params.username) {
            throw new ForbiddenError("Only an admin or the user of this account can delete this account");
        }
        await User.remove(req.params.username);
        return res.redirect(`/`);
    } catch (err) {
        return next(err);
    }
});

module.exports = router;