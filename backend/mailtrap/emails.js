// import necessary templates and configurations
import {
	PASSWORD_RESET_REQUEST_TEMPLATE,
	PASSWORD_RESET_SUCCESS_TEMPLATE,
	VERIFICATION_EMAIL_TEMPLATE,
  } from "./emailTemplates.js";
  import { mailtrapClient, sender } from "./mailtrap.config.js";
  
  // Verification email (SKIPPED)
  export const sendVerificationEmail = async (email, verificationToken) => {
	// Skip sending verification email
	console.log("Skipping email verification process.");
	return { success: true, message: "Email verification skipped" };
  };
  
  // Welcome email (optional, retain if desired)
  export const sendWelcomeEmail = async (email, name) => {
	const recipient = [{ email }];

	try {
		const response = await mailtrapClient.send({
			from: sender,
			to: recipient,
			subject: "Welcome to Our Service",
			html: `<h1>Welcome, ${name}!</h1><p>Thank you for joining our service.</p>`,
			category: "Welcome Email",
		});

		console.log("Welcome email sent successfully", response);
	} catch (error) {
		console.error(`Error sending welcome email`, error);
		throw new Error(`Error sending welcome email: ${error}`);
	}
};

  
  // Password reset email (optional, retain if needed)
  export const sendPasswordResetEmail = async (email, resetURL) => {
	const recipient = [{ email }];
  
	try {
	  const response = await mailtrapClient.send({
		from: sender,
		to: recipient,
		subject: "Reset your password",
		html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
		category: "Password Reset",
	  });
  
	  console.log("Password reset email sent successfully", response);
	} catch (error) {
	  console.error(`Error sending password reset email`, error);
	  throw new Error(`Error sending password reset email: ${error}`);
	}
  };
  
  // Password reset success email (optional, retain if needed)
  export const sendResetSuccessEmail = async (email) => {
	const recipient = [{ email }];
  
	try {
	  const response = await mailtrapClient.send({
		from: sender,
		to: recipient,
		subject: "Password Reset Successful",
		html: PASSWORD_RESET_SUCCESS_TEMPLATE,
		category: "Password Reset",
	  });
  
	  console.log("Password reset success email sent successfully", response);
	} catch (error) {
	  console.error(`Error sending password reset success email`, error);
	  throw new Error(`Error sending password reset success email: ${error}`);
	}
  };
  