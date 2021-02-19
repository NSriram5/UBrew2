async function getToken(typedEmail, typedPassword) {
    try {
        const response = await axios.post('/auth/token', { email: typedEmail, password: typedPassword });
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

async function conductLogin(e) {
    e.preventDefault();
    $("#entryErrors").text("");
    let typedEmail = e.target.querySelector("#emailInput").value;
    let typedPassword = e.target.querySelector("#passwordInput").value;

    let outcome = await getToken(typedEmail, typedPassword);
}

function applyErrors(response) {
    $("#entryErrors").text(response);
}

$(function() {
    $("#loginForm").submit(conductLogin);
});