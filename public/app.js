async function sendEmail() {

    const email = document.getElementById("email").value;
    const message = document.getElementById("message");

    if (!email) {
        message.style.color = "red";
        message.innerText = "Please enter an email address.";
        return;
    }

    message.style.color = "#555";
    message.innerText = "Sending email...";

    try {

        const response = await fetch("/.netlify/functions/send-email", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email
            })
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Unknown server error");
        }

        message.style.color = "green";
        message.innerText = result.message;

    } catch (error) {

        console.error("Frontend Error:", error);

        message.style.color = "red";
        message.innerText = error.message || "Something went wrong.";

    }
}