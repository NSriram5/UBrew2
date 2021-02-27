function clickUpdate(e) {
    e.preventDefault();
    $(".formElements").show();
    $(".displayElements").hide();
    $(".controlBox>input").attr("disabled", false);
    $("#updateBtn").hide();
    $("#saveBtn").show();

}


async function updateRecipe(retrievedToken, typedName, typedABV, typedOG, typedFG, typedIBU, typedInstructions, selectedPublic, selectedShareable, selectedActive, selectedstyle, addedIngredients) {
    try {
        const response = await axios.patch('/recipes', { token: retrievedToken, Name: typedName, ABV: typedABV, OG: typedOG, FG: typedFG, IBU: typedIBU, instructions: typedInstructions, public: selectedPublic, shareable: selectedShareable, active: selectedActive, styleId: selectedstyle, Ingredients: addedIngredients });
        if (response.data.invalidMessage) {
            applyErrors(response.data.invalidMessage)
            return;
        }
        if (response.data.validMessage) {
            console.log("success. should redirect now");
            window.location.href = "/"
            return
        }
    } catch (err) {
        console.log(err)
    }
}

function addIngredient(e) {
    e.preventDefault();
    const previousIngredients = JSON.parse(sessionStorage.getItem("ingredients")) || [];
    let newIngredient = $("#ingredientInput").val();
    const newQty = parseFloat($("#ingredientqtyInput").val());
    const key = previousIngredients.length === 0 ? 0 : previousIngredients[previousIngredients.length - 1]["key"];
    newIngredient = { key: key + 1, Name: newIngredient, quantity: newQty }
    sessionStorage.setItem("ingredients", JSON.stringify([...previousIngredients, newIngredient]));
    const paragraphItem = $("<p>").text(`${newQty} - of - ${newIngredient["Name"]}`)
    const delBtn = $("<button>").text("x").addClass("del-ingredient").data("key", key + 1)
    const liItem = $("<li>").append(paragraphItem).append(delBtn);
    $("#saved-ingredients").append(liItem);
}

function clickIngredient(e) {
    e.preventDefault();
    if (e.target.classList.contains("del-ingredient")) {
        const targetKey = $(e.target).data().key;
        const unfilteredIngredients = JSON.parse(sessionStorage.getItem("ingredients"));
        const filteredIngredients = unfilteredIngredients.filter(ingr => ingr["key"] != targetKey);
        sessionStorage.setItem("ingredients", JSON.stringify(filteredIngredients));
        e.target.parentElement.remove();
    }
}

function clicksaveRecipe(event) {
    event.preventDefault();
    let retrievedToken = $(".name-box").data().token;
    let typedName = $("#nameInput").val();
    let typedABV = parseFloat($("#abvInput").val());
    let typedOG = parseFloat($("#ogInput").val());
    let typedFG = parseFloat($("#fgInput").val());
    let typedIBU = parseInt($("#ibuInput").val());
    let typedInstructions = $("#instructionsInput").val();
    let selectedPublic = $("#publicInput").is(':checked');
    let selectedShareable = $("#shareableInput").is(':checked')
    let selectedActive = $("#activeInput").is(':checked')
    let selectedstyle = $("#styleInput").val();
    let addedIngredients = JSON.parse(sessionStorage.getItem("ingredients"));
    updateRecipe(retrievedToken, typedName, typedABV, typedOG, typedFG, typedIBU, typedInstructions, selectedPublic, selectedShareable, selectedActive, selectedstyle, addedIngredients);


}

function applyErrors(response) {

}

function clearSessionStorage() {
    sessionStorage.setItem("ingredients", JSON.stringify([]));
}


$(function() {
    clearSessionStorage();
    $("#updateBtn").click(clickUpdate);
    $("#addingredientBtn").click(addIngredient);
    $("#saved-ingredients").click(clickIngredient);
    $("#saveBtn").click(clicksaveRecipe);
});