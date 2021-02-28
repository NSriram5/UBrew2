/** Admin routes for UBrew2 */

const express = require("express");

const { ensureLoggedIn, ensureAdmin } = require("../middleware/auth");
const User = require("../controllers/user");
const Recipe = require("../controllers/recipe");
const { BadRequestError, UnauthorizedError, ForbiddenError } = require("../expressError");

const router = new express.Router();


/** Admin view
 *
 * Returns ...
 *
 * Authorization required: login, admin
 **/
router.get("/", ensureLoggedIn, ensureAdmin, async function(req, res, next) {
    try {
        let usersPromise = User.getUser();
        let recipesPromise = Recipe.getRecipe({ isAdmin: true });
        const [users, recipes] = await Promise.all([usersPromise, recipesPromise]);
        return res.render("admin-dash.html", { users, recipes: recipes.rows });
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
        const user = User.get({ userId: req.params.userId });
        const recipes = Recipe.getRecipe({ userId: req.params.userId });
        await user && await recipes;
        return res.render("user_details.html", { user, recipes });
    } catch (err) {
        return next(err);
    }
})

/** PATCH /password => { userId, newPassword }
 *
 * Updates the password of the user
 *
 * Authorization required: admin
 **/
router.patch("/password", ensureLoggedIn, ensureAdmin, async function(req, res, next) {
    try {
        const response = await User.updateUser({ userId: req.body.userId, password: req.body.newPassword })
        return res.json({ validMessage: "Password changed" });
    } catch (err) {
        return next(err);
    }
});

/** PATCH /disableUser
 *  
 *  Changes the state to the desired disable/enable condition
 * 
 *  Authorization required: admin
 */
router.patch("/disableUser", ensureLoggedIn, ensureAdmin, async function(req, res, next) {
    try {

        const response = await User.updateUser({ userId: req.body.userId, disabled: req.body.disabled })
        return res.json({ validMessage: "User disabled condition set" });
    } catch (err) {
        return next(err);
    }
});

/** PATCH /disableRecipe
 *  
 *  Changes the state to the desired disable/enable condition
 * 
 *  Authorization required: admin
 */
router.patch("/disableRecipe", ensureLoggedIn, ensureAdmin, async function(req, res, next) {
    try {
        const response = await Recipe.updateRecipe({ id: req.body.id, active: req.body.active })
        return res.json({ validMessage: "Recipe active condition set" });
    } catch (err) {
        return next(err);
    }
});

/** PATCH /[username] => { user }
 *
 * Returns render of the user page with the information updated
 *
 * Authorization required: login, admin OR user of page being requested
 **/
// router.patch("/:username/edit/", async function(req, res, next) {
//     try {
//         const user = await User.get(req.params.username);

//         const validator = jsonschema.validate(req.body, userUpdateSchema);
//         if (!validator.valid) {
//             const errs = validator.errors.map(e => e.stack);
//             throw new BadRequestError(errs);
//         }
//         //TODO: Update this to match model
//         user.firstName = req.body.firstName;
//         user.lastName = req.body.lastName;
//         user.phone = req.body.phone;
//         user.bio = req.body.bio;
//         await user.save();

//         return res.redirect(`/${customer.username}`);
//     } catch (err) {
//         return next(err);
//     }
// });

/** DELETE /[username] => Removed user
 * 
 *  Returns render of homepage with user removed
 *  
 *  Authorization required: login OR admin
 **/
// router.delete("/:username", ensureLoggedIn, async function(req, res, next) {
//     try {
//         if (res.locals.user.isAdmin == false && res.locals.user.username != req.params.username) {
//             throw new ForbiddenError("Only an admin or the user of this account can delete this account");
//         }
//         await User.remove(req.params.username);
//         return res.redirect(`/`);
//     } catch (err) {
//         return next(err);
//     }
// });

module.exports = router;