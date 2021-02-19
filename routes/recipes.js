/** User routes for UBrew2 */

const express = require("express");

const { ensureLoggedIn, ensureAdmin } = require("../middleware/auth");
//const Recipe = require("../models/recipe");
const { BadRequestError, UnauthorizedError, ForbiddenError } = require("../expressError");
const router = new express.Router();

/** GET / => render recipes list
 *
 * Returns rendered list of all recipes.
 *
 * Authorization required: login AND admin
 **/
router.get("/", ensureLoggedIn, ensureAdmin, async function(req, res, next) {
    try {
        const recipes = await Recipe.findAll();
        return res.render("recipe_list.html", { recipes });
    } catch (err) {
        return next(err);
    }
});

/** GET /[id] => render recipe page
 *
 * Returns render of recipe page
 *
 * Authorization required: recipe==public OR login OR admin OR user of page being requested
 */
router.get("/:id", async function(req, res, next) {
    try {
        const recipe = await Recipe.get(req.params.id);

        //TODO need to write authorization logic

        return res.render("recipe_view.html", { recipe });
    } catch (err) {
        return next(err);
    }
});

/** POST / => render recipe page with new recipe made
 *  
 *  Returns a rendered page with a new recipe
 * 
 *  Authorization required: login 
 */
router.post("/", ensureLoggedIn, async function(req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, jobNewSchema);
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }
        const recipe = await Recipe.create(req.body);

        return res.redirect(`/${recipe.id}`);
    } catch (err) {
        return next(err);
    }
});

/** PATCH /[id] => render updated recipe pages
 *  
 *  Returns render of the updated recipe page
 * 
 *  Authorization required: login AND user of page being requested
 */
router.patch("/:id", ensureLoggedIn, async function(req, res, next) {
    try {

        const recipe = await Recipe.get(req.params.id);

        if (res.locals.user.username != recipe.user) {
            throw new ForbiddenError("Only an admin or the user of this account can update these details");
        }

        const validator = jsonschema.validate(req.body, recipeUpdateSchema);
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }
        //TODO: Update this to match model
        recipe.name = req.body.name;
        //.... add more model update items

        await recipe.save();

        return res.redirect(`/${recipe.id}`);
    } catch (err) {
        return next(err);
    }
});

/** DELETE /[id] => Removed recipe
 * 
 *  Returns render of homepage with recipe removed
 *  
 *  Authorization required: login OR admin
 **/
router.delete(":/id", ensureLoggedIn, async function(req, res, next) {
    try {
        const recipe = await Recipe.get(req.params.id);
        if (res.locals.user.isAdmin == false && res.locals.user.username != recipe.user) {
            throw new ForbiddenError("Only an admin or the user of this account can delete this recipe");
        }

        await recipe.remove(req.params.id);
        return res.redirect(`/`);
    } catch (err) {
        return next(err);
    }
});

module.exports = router;