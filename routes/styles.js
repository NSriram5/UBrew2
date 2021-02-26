/** Ingredient route for UBrew2 */

const express = require("express");

const { ensureAdmin, ensureLoggedIn } = require("../middleware/auth");
const { getAllStyles } = require("../controllers/style")
const { BadRequestError, UnauthorizedError, ForbiddenError } = require("../expressError");

const router = new express.Router();

/** GET / => Styles list
 * 
 *  Returns rendered list of all styles.
 * 
 *  Authorization required: login
 */
router.get("/", ensureLoggedIn, async function(req, res, next) {
    try {
        const styles = await getAllStyles();
        return res.json(styles);
    } catch (err) {
        return next(err);
    }
});


module.exports = router;