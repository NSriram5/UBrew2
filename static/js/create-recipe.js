async function addRecipe(typedName, typedABV, typedOG, typedFG, typedIBU, typedInstructions, selectedPublic, selectedShareable, selectedActive, selectedstyle, addedIngredients) {
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
    debugger;
    const paragraphItem = $("<p>").text(`${newQty} of ${newIngredient}`)
    const delBtn = $("<button>").text("x").addClass("del-ingredient").data("key", key + 1)
    const liItem = $("<li>").append(paragraphItem).append(delBtn);
    $("#saved-ingredients").append(liItem);
}

function clickIngredient(e) {
    e.preventDefault();
    debugger;
    if (e.target.classList.contains("del-ingredient")) {
        const targetKey = $(e.target).data().key;
        const unfilteredIngredients = JSON.parse(sessionStorage.getItem("ingredients"));
        const filteredIngredients = unfilteredIngredients.filter(ingr => ingr[0] != targetKey);
        sessionStorage.setItem("ingredients", JSON.stringify(filteredIngredients));
        e.target.parentElement.remove();
    }
}

async function addRecipe(e) {
    e.preventDefault();
    let typedName = e.target.querySelector("#nameInput").value;
    let typedABV = e.target.querySelector("#abvInput").value;
    let typedOG = e.target.querySelector("#ogInput").value;
    let typedFG = e.target.querySelector("#fgInput").value;
    let typedIBU = e.target.querySelector("#ibuInput").value;
    let typedInstructions = e.target.querySelector("#instructionsInput").value;
    let selectedPublic = e.target.querySelector("#publicInput").value;
    let selectedShareable = e.target.querySelector("#shareableInput").value;
    let selectedActive = e.target.querySelector("#activeInput").value;
    let selectedstyle = e.target.querySelector("#styleInput").value;
    let addedIngredients = sessionStorage.getItem["ingredients"];
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
    $("createBtn").click(addRecipe);
});