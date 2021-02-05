/** Ingredient route for UBrew2 */

const express = require("express");

const { ensureAdmin, ensureLoggedIn } = require("../middleware/auth");
const Ingredient = require("./models/ingredient");
const { BadRequestError, UnauthorizedError, ForbiddenError } = require("../expressError");
const ingredientNewSchema = require("../schemas/ingredientNew.json");
const ingredientUpdateSchema = require("../schemas/ingredientUpdate.json");

const router = new express.Router();

/** POST / => create new ingredient
 * 
 *  Returns rendered list of of all ingredients with new ingredient added.
 * 
 *  Authorization required: admin
 */
router.post("/", ensureLoggedIn, ensureAdmin, async function(req, res, next) {
    try {
        const ingredient
        return res.redirect(`/`);
    } catch (err) {
        return next(err);
    }
});

/** GET / => Ingredients list
 * 
 *  Returns rendered list of all ingredients.
 * 
 *  Authorization required: login
 */
router.get("/", ensureLoggedIn, async function(req, res, next) {
    try {
        const ingredients = await Ingredient.findall();
        return res.render("ingredients_list.html", { ingredients });
    } catch (err) {
        return next(err);
    }
});

/** GET /[id] => Render ingredient page
 * 
 *  Return rendered page of a specific ingredient
 * 
 *  Authorization required: login
 */
router.get("/:id", ensureLoggedIn, async function(req, res, next) {
    try {
        const ingredient = await Ingredient.get(req.params.id);
        return res.render("ingredient_details.html", { ingredient });
    } catch (err) {
        return next(err);
    }
});

/** PATCH /[id] => Render updated ingredient page
 * 
 *  Return rendered page of updated ingredient
 * 
 *  Authorization required: admin
 */
router.get("/:id", ensureAdmin, async function(req, res, next) {
    try {
        const ingredient = await Ingredient.get(req.params.id);
        const validator = jsonschema.validate(req.body, userUpdateSchema);
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }
        //TODO: Update this to match model
        ingredient.name = req.body.name;

        await ingredient.save();

        return res.redirect(`/${ingredient.id}`);
    } catch (err) {
        return next(err);
    }
})


/** DELETE /[id] => Removed id
 * 
 *  Returns render of ingredients with ingredient removed
 * 
 *  Authorization required: admin
 */
router.delete("/:id", ensureAdmin, async function(req, res, next) {
    try {
        await Ingredient.remove(req.params.id);
        return res.redirect(`/`);
    } catch (err) {
        return next(err);
    }
});

module.exports = router;