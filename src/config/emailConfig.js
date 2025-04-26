// Brevo Email Configuration
export const emailConfig = {
  apiKey: import.meta.env.VITE_BREVO_API_KEY || "", // Your Brevo API key
  senderEmail: import.meta.env.VITE_BREVO_SENDER_EMAIL || "", // Sender email for Brevo
  senderName: import.meta.env.VITE_BREVO_SENDER_NAME || "VZBL", // Sender name
  recipientEmails: [
    import.meta.env.VITE_RECIPIENT_EMAIL_1 || "",
    import.meta.env.VITE_RECIPIENT_EMAIL_2 || ""
  ].filter(email => email !== "") // Recipient emails for both contact and join us forms
}; 