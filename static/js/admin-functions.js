let passwordEdit = false;

function routeClick(e) {
    e.preventDefault();
    if (e.target.classList.contains("reset-password")) {
        passwordAssignMode(e);
    } else if (e.target.classList.contains("user-disable")) {

    } else if (e.target.classList.contains("recipe-disable")) {

    } else if (e.target.classList.contains("recipe-style")) {
        styleChangeMode(e);
    } else if (e.target.classList.contains("style-select")) {} else if (e.target.classList.contains("password-set")) {
        passwordSetMode(e);
    }
}

function passwordAssignMode(e) {
    passwordEdit = true;
    const userId = e.target.dataset.id;
    const textBox = $(`<input type="text" id="newPassword" name="newPassword">`);
    const changeButton = $(`<button class="password-set" id="submitPwdChange" data-id="${userId}">`).text("Change");
    $(e.target.parentElement).append(textBox).append(changeButton);
    e.target.remove();
}

async function passwordSetMode(e) {
    const newPassword = e.target.previousSibling.value;
    const userId = e.target.dataset.id;
    //const response = await axios.patch("/admin/password", { userId, newPassword });
    const resetButton = $(`<button class="reset-password" data-id="${userId}">`).text("reset password");
    $(e.target.parentElement).append(resetButton)
    e.target.previousSibling.remove();
    e.target.remove();
    passwordEdit = false;
}

async function styleChangeMode(e) {
    const recipeId = e.target.dataset.id;
    const results = await axios.get("/styles");
    const styleSelector = $(`<select name="stylesselection" id="stylesselection" data-id="${recipeId}">`);
    results.data.map((style) => { styleSelector.append($(`<option value="${style.id}" class="style-select">`).text(`${style.name}`)) });
    styleSelector.change(styleAssign);
    e.target.innerHTML = "";
    $(e.target).append(styleSelector);
}

async function styleAssign(e) {
    const recipeId = e.target.dataset.id;
    const styleId = e.target.value;
    //const results = await axios.patch("/recipes", { id: recipeId, styleId });
    e.target.parentElement.innerHTML = `${styleId}`;
    e.target.remove();

}

function addIngredient(e) {}

function clickIngredient(e) {}

function clickaddRecipe(e) {

}



$(function() {
    $(".tm-gallery-page").click(routeClick);
    // $(".reset-password").click(resetUserPassword);
    // $(".user-disable").click(userDisable);
    // $(".recipe-disable").click(recipeDisable);
    // $(".recipe-style").click(recipeStyleClick);
});