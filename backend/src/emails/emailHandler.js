import { sender, client } from "../lib/mailtrap.js";
import { createWelcomeEmailTemplate } from "./emailTemplate.js";

export const sendWelcomeMail=async(name,email,profileUrl)=>{
    const recipients=[{email}];
    try{
        const response=await client.send({
            from: sender,
            to: recipients,
            subject: "Welcome to DevLoop",
            html:createWelcomeEmailTemplate(name,profileUrl),
            category: "Welcome",
        });
        console.log("Email send successfully:",response);
    }
    catch(error){
        throw error;
    }
}