async function getToken(typedEmail, typedPassword) {
    try {
        const response = await axios.post('/auth/token', { email: typedEmail, password: typedPassword });
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

async function conductLogin(e) {
    e.preventDefault();
    let typedEmail = e.target.querySelector("#emailInput").value;
    let typedPassword = e.target.querySelector("#passwordInput").value;

    let outcome = await getToken(typedEmail, typedPassword);
    debugger;

}

function applyErrors(response) {

}

$(function() {
    $("#loginForm").submit(conductLogin);
});