const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");

exports.handler = async (event) => {

    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405,
            body: JSON.stringify({
                success:false,
                message:"Method not allowed"
            })
        };
    }


    try {

        const { email } = JSON.parse(event.body);


        if (!email) {
            return {
                statusCode:400,
                body:JSON.stringify({
                    success:false,
                    message:"Email is required"
                })
            };
        }


        const transporter = nodemailer.createTransport({

            host: process.env.SMTP_HOST,

            port: Number(process.env.SMTP_PORT),

            secure:false,

            auth:{
                user:process.env.SMTP_USER,
                pass:process.env.SMTP_PASS
            }

        });


        const filePath = path.join(
          process.cwd(),
         "templates",
          "email.html"
        );


        let html = fs.readFileSync(filePath,"utf8");


        html = html.replace(/{{name}}/g,"Hassan");
        html = html.replace(/{{amount}}/g,"$250.00");
        html = html.replace(/{{transactionId}}/g,"TXN-2026-0001");
        html = html.replace(/{{status}}/g,"Completed");
        html = html.replace(/{{date}}/g,new Date().toLocaleString());



        await transporter.sendMail({

            from:`"Simple Email Sender" <${process.env.MAIL_FROM}>`,

            to:email,

            subject:"🎉 Transaction Successful",

            html

        });



        return {

            statusCode:200,

            body:JSON.stringify({

                success:true,

                message:"Email sent successfully!"

            })

        };


    } catch(error){

        console.log(error);


        return {

            statusCode:500,

            body:JSON.stringify({

                success:false,

                message:"Failed to send email"

            })

        };

    }

};