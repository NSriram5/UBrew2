async function getRegister(typedEmail, typedPassword) {
    try {
        const response = await axios.post('/auth/register', { email: typedEmail, password: typedPassword, firstName: typedFirstName, lastName: typedLastName });
        if (response.data.invalidMessage) {
            applyErrors(response.data.invalidMessage)
            return;
        }
        if (response.data.token) {
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
    let outcome = await getRegister(typedEmail, typedPassword, typedFirstName, typedLastName);

    debugger;

}

function applyErrors(response) {

}

$(function() {
    $("#loginForm").submit(conductRegister);
});