async function getRegister(typedEmail, typedPassword, typedFirstName, typedLastName) {
    try {
        const response = await axios.post('/auth/register', { email: typedEmail, password: typedPassword, firstName: typedFirstName, lastName: typedLastName });
        if (response.data.invalidMessage) {
            applyErrors(response.data.invalidMessage)
            return;
        }
        if (response.data.validMessage) {
            console.log("success. should redirect now");
            window.location.href = "/"
            return
            // sessionStorage.setItem("Token", response.data.token)
        }

    } catch (err) {
        console.log(err)
    }



}

async function conductRegister(e) {
    e.preventDefault();
    let typedEmail = e.target.querySelector("#emailInput").value;
    let typedPassword = e.target.querySelector("#passwordInput").value;
    let typedFirstName = e.target.querySelector("#firstnameInput").value;
    let typedLastName = e.target.querySelector("#lastnameInput").value;
    debugger;
    getRegister(typedEmail, typedPassword, typedFirstName, typedLastName);


}

function applyErrors(response) {

}

$(function() {
    $("#registerForm").submit(conductRegister);
});