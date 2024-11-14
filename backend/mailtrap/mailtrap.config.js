// mailtrap.config.js
import { MailtrapClient } from "mailtrap";
import dotenv from "dotenv";

dotenv.config();

export const mailtrapClient = new MailtrapClient({
  token: "699e4aa64239a1b75acfd3d67aa3ced9", // replace with your production token
});

export const sender = {
  email: "hasnainbharmal4@gmail.com", // Use your domain’s email address
  name: "SuperNotes",
};
