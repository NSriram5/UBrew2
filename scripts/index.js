"use strict";

/** Express app for jobly. */

const express = require("express");
const session = require("express-session")
const cors = require("cors");

const { NotFoundError } = require("../expressError");

const { authenticateJWT } = require("../middleware/auth");
const authRoutes = require("../routes/auth");
const usersRoutes = require("../routes/users");
const recipesRoutes = require("../routes/recipes");
const ingredientsRoutes = require("../routes/ingredients");
const adminRoutes = require("../routes/admin");
const stylesRoutes = require("../routes/styles");

const { getRecipe, getMyRecipes } = require("../controllers/recipe");
const { getUser } = require("../controllers/user");
const user = require("../controllers/user");
const { getStyles } = require("../controllers/style");

const path = require("path");
const nunjucks = require("nunjucks");
const bodyParser = require("body-parser");
const { SESSION_SECRET } = require("../config/config");

//const morgan = require("morgan");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.resolve(__dirname + "/../static")));
app.use(session({ secret: SESSION_SECRET }))
    //app.use(morgan("tiny"));
app.use(authenticateJWT);
// Parse body for urlencoded (non-JSON) data
app.use(bodyParser.urlencoded({ extended: false }));

nunjucks.configure(path.resolve(__dirname + "/../templates"), { autoescape: true, express: app });

app.get("/", authenticateJWT, async function(req, res, next) {
    try {
        const publicRecipesPromise = getRecipe({});
        let publicRecipes;
        let myRecipes;
        let user = {}
        if (res.locals.user) {
            console.log(`Logged in as ${res.locals.user}`)
            const myRecipesPromise = getMyRecipes(res.locals.user.userId);
            user = res.locals.user;
            [publicRecipes, myRecipes] = await Promise.all([publicRecipesPromise, myRecipesPromise]);
            if (!myRecipes) myRecipes = [];
        } else {
            publicRecipes = await publicRecipesPromise;
            myRecipes = [];
        }
        return res.render("index.html", { publicRecipes: publicRecipes.rows, myRecipes: myRecipes.rows, user });
    } catch (err) {
        return next(err);
    }
})

app.get("/login", authenticateJWT, async function(req, res, next) {
    try {
        if (res.session && res.session.token) delete res.session.token;
        return res.render("login.html");
    } catch (err) {
        return next(err);
    }
})

app.get("/logout", async function(req, res, next) {
    try {
        if (res.session && res.session.token) delete res.session.token;
        delete res.locals.user
        delete req.session.token
        return res.redirect("/");
    } catch (err) {
        return next(err);
    }
})

app.get("/register", async function(req, res, next) {
    try {
        if (res.session && res.session.token) delete res.session.token;

        return res.render("register.html");
    } catch (err) {
        return next(err);
    }
})

app.get("/about", async function(req, res, next) {
    try {
        return res.render("about.html");
    } catch (err) {
        return next(err);
    }
})

app.get("/create-recipe", authenticateJWT, async function(req, res, next) {
    try {
        if (!res.locals.user.userId) {
            return res.redirect("/");
        }
        const styles = await getStyles({});
        debugger;
        return res.render("create-recipe.html", styles);
    } catch (err) {
        return next(err);
    }
})

app.use("/auth", authRoutes);
app.use("/users", usersRoutes);
app.use("/recipes", recipesRoutes);
app.use("/ingredients", ingredientsRoutes);
app.use("/admin", adminRoutes);
app.use("/styles", stylesRoutes);

/** Handle 404 errors -- this matches everything */
app.use(function(req, res, next) {
    debugger;
    return next(new NotFoundError());
});

/** Generic error handler; anything unhandled goes here. */
app.use(function(err, req, res, next) {
    if (process.env.NODE_ENV !== "test") console.error(err.stack);
    const status = err.status || 500;
    const message = err.message || "no message has been provided on this error";

    return res.status(status).json({
        error: { message, status },
    });
});

module.exports = app;