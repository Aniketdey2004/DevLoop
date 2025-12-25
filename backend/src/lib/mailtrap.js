import { MailtrapClient } from "mailtrap";
import {ENV} from "./env.js";

const TOKEN=ENV.MAILTRAP_TOKEN;

export const client=new MailtrapClient({
    token:TOKEN
});

export const sender={
    email: ENV.EMAIL_FROM,
    name: ENV.EMAIL_NAME,
};