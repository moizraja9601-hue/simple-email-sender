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

        const response = await fetch("/send-email", {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify({

                email

            })

        });

        const result = await response.json();

        if(result.success){

            message.style.color="green";

        }else{

            message.style.color="red";

        }

        message.innerText=result.message;

    }

    catch(error){

        message.style.color="red";

        message.innerText="Something went wrong.";

    }

}