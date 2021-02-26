/** User routes for UBrew2 */

const express = require("express");

const jsonschema = require("jsonschema");

const { ensureLoggedIn, ensureAdmin } = require("../middleware/auth");
const Recipe = require("../controllers/recipe");
const { getStyle } = require("../controllers/style");
const { BadRequestError, UnauthorizedError, ForbiddenError } = require("../expressError");
const recipeNew = require("../schemas/recipeNew.json");
const recipeUpdateSchema = require("../schemas/recipeUpdate.json");
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
router.get("/:token", async function(req, res, next) {
    try {
        const recipe = await Recipe.getFullRecipe({ token: req.params.token });
        let canUpdate
        if (!res.locals.user || (res.locals.user.userId != recipe.userId && !res.locals.user.admin)) {
            if (!recipe.public) {
                throw new ForbiddenError("Only an admin or the user of this account can view these details");
            }
            canUpdate = false;
        } else {
            canUpdate = true;
        }
        const [style] = await getStyle({ id: recipe.styleId });
        recipe["styleName"] = style.name;
        let user = res.locals.user ? res.locals.user : false;
        return res.render("view-recipe.html", { recipe, user, canUpdate });
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
        req.body["userId"] = res.locals.user.userId
        const validator = jsonschema.validate(req.body, recipeNew);
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }
        const recipe = await Recipe.createRecipe(req.body);

        return res.json({ validMessage: "Recipe has been created" });
        //return res.redirect(`/${recipe.id}`);
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
router.patch("/", ensureLoggedIn, async function(req, res, next) {
    try {
        const response = await Recipe.getRecipe({ isAdmin: true, id: req.body.id });
        const recipe = response.rows[0];
        if (res.locals.user.userId != recipe.userId && !res.locals.user.admin) {
            throw new ForbiddenError("Only an admin or the user of this account can update these details");
        }

        const validator = jsonschema.validate(req.body, recipeUpdateSchema);
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }

        await Recipe.updateRecipe(req.body);

        return res.json({ validMessage: "Recipe has been updated" })
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
        const recipe = await Recipe.getRecipe(req.params.id);
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