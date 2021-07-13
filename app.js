const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
require("dotenv").config();
const mailchimp = require("@mailchimp/mailchimp_marketing");

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mailchimp.setConfig({
    apiKey: process.env.API_KEY,
    server: process.env.SERVER_PREFIX
});

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/signup.html");
});
app.post("/", (req, res) => {
    const formData = req.body;
    const listId = process.env.LIST_ID;
    const subscribingUser = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email
    }

    async function run() {
        try{
            const response = await mailchimp.lists.addListMember(listId, {
                email_address: subscribingUser.email,
                status: "subscribed",
                merge_fields: {
                    FNAME: subscribingUser.firstName,
                    LNAME: subscribingUser.lastName
                }
            });
            console.log(`Successfully added contact as an audience member. The contact's id is ${response.id}.`);
            res.sendFile(__dirname + "/success.html");
        } catch (e){
            console.log(e.status);
            res.sendFile(__dirname + "/failure.html");
        }

    }
    run();
});

app.listen(process.env.PORT || 3000, () => {
    console.log("Server started");
})