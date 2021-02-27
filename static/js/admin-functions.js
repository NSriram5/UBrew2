let passwordEdit = false;

function routeClick(e) {
    e.preventDefault();
    if (e.target.classList.contains("reset-password")) {
        passwordAssignMode(e);
    } else if (e.target.classList.contains("user-disable")) {
        toggleUserDisable(e);

    } else if (e.target.classList.contains("recipe-disable")) {
        toggleRecipeDisable(e);

    } else if (e.target.classList.contains("recipe-style")) {
        styleChangeMode(e);
    } else if (e.target.classList.contains("style-select")) {} else if (e.target.classList.contains("password-set")) {
        passwordSetMode(e);
    }
}

async function toggleUserDisable(e) {
    const userId = e.target.dataset.id

    if (e.target.textContent == "Disable") {
        const response = await axios.patch("admin/disableUser", { userId, disabled: true })
        e.target.innerHTML = "Enable";
    } else if (e.target.textContent == "Enable") {
        const response = await axios.patch("admin/disableUser", { userId, disabled: false })
        e.target.innerHTML = "Disable";
    }
}

async function toggleRecipeDisable(e) {
    const id = e.target.dataset.id
    if (e.target.textContent == "Disable") {
        const response = await axios.patch("admin/disableRecipe", { id, active: false })
        e.target.innerHTML = "Enable";
    } else if (e.target.textContent == "Enable") {
        const response = await axios.patch("admin/disableRecipe", { id, active: true })
        e.target.innerHTML = "Disable";
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
    const response = await axios.patch("/admin/password", { userId, newPassword });
    const resetButton = $(`<button class="reset-password" data-id="${userId}">`).text("reset password");
    $(e.target.parentElement).append(resetButton)
    e.target.previousSibling.remove();
    e.target.remove();
    passwordEdit = false;
}

async function styleChangeMode(e) {
    const recipeId = e.target.dataset.id;
    const recipeToken = e.target.dataset.token;
    const results = await axios.get("/styles");
    const styleSelector = $(`<select name="stylesselection" id="stylesselection" data-id="${recipeId}" data-token="${recipeToken}">`);
    results.data.map((style) => { styleSelector.append($(`<option value="${style.id}" class="style-select">`).text(`${style.name}`)) });
    styleSelector.change(styleAssign);
    e.target.innerHTML = "";
    $(e.target).append(styleSelector);
}

async function styleAssign(e) {
    const recipeId = parseInt(e.target.dataset.id);
    const recipeToken = e.target.dataset.token;
    const styleId = parseInt(e.target.value);
    const results = await axios.patch("/recipes", { token: recipeToken, id: recipeId, styleId });
    e.target.parentElement.innerHTML = `${styleId}`;
    e.target.remove();

}


$(function() {
    $(".tm-gallery-page").click(routeClick);
    // $(".reset-password").click(resetUserPassword);
    // $(".user-disable").click(userDisable);
    // $(".recipe-disable").click(recipeDisable);
    // $(".recipe-style").click(recipeStyleClick);
});