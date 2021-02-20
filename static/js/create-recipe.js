async function addRecipe(typedName, typedABV, typedOG, typedFG, typedIBU, typedInstructions, selectedPublic, selectedShareable, selectedActive, selectedstyle, addedIngredients) {
    debugger;
    try {
        const response = await axios.post('/recipes', { name: typedName, abv: typedABV, og: typedOG, fg: typedFG, ibu: typedIBU, instructions: typedInstructions, public: selectedPublic, shareable: selectedShareable, active: selectedActive, style: selectedstyle, ingredients: addedIngredients });
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
    const newIngredient = $("#ingredientInput").val();
    const newQty = $("#ingredientqtyInput").val();
    const key = previousIngredients.length === 0 ? 0 : previousIngredients[previousIngredients.length - 1][0];
    sessionStorage.setItem("ingredients", JSON.stringify([...previousIngredients, [key + 1, newIngredient, newQty]]));
    const paragraphItem = $("<p>").text(`${newQty} of ${newIngredient}`)
    const delBtn = $("<button>").text("x").addClass("del-ingredient").data("key", key + 1)
    const liItem = $("<li>").append(paragraphItem).append(delBtn);
    $("#saved-ingredients").append(liItem);
}

function clickIngredient(e) {
    e.preventDefault();
    if (e.target.classList.contains("del-ingredient")) {
        const targetKey = $(e.target).data().key;
        const unfilteredIngredients = JSON.parse(sessionStorage.getItem("ingredients"));
        const filteredIngredients = unfilteredIngredients.filter(ingr => ingr[0] != targetKey);
        sessionStorage.setItem("ingredients", JSON.stringify(filteredIngredients));
        e.target.parentElement.remove();
    }
}

function addRecipe(e) {
    e.preventDefault();
    let typedName = ("#nameInput").value;
    let typedABV = ("#abvInput").value;
    let typedOG = ("#ogInput").value;
    let typedFG = ("#fgInput").value;
    let typedIBU = ("#ibuInput").value;
    let typedInstructions = ("#instructionsInput").value;
    let selectedPublic = ("#publicInput").value;
    let selectedShareable = ("#shareableInput").value;
    let selectedActive = ("#activeInput").value;
    let selectedstyle = ("#styleInput").value;
    let addedIngredients = JSON.parse(sessionStorage.getItem("ingredients"));
    debugger;
    addRecipe(typedName, typedABV, typedOG, typedFG, typedIBU, typedInstructions, selectedPublic, selectedShareable, selectedActive, selectedstyle, addedIngredients);


}

function applyErrors(response) {

}

function clearSessionStorage() {
    sessionStorage.setItem("ingredients", JSON.stringify([]));
}


$(function() {
    clearSessionStorage();
    $("#addingredientBtn").click(addIngredient);
    $("#saved-ingredients").click(clickIngredient);
    $("#createBtn").click(addRecipe);
});