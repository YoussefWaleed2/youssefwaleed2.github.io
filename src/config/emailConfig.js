// Brevo Email Configuration

// Default values for development/testing
const DEFAULT_API_KEY = "xkeysibDebugKeyDoNotUseThisInProduction";
const DEFAULT_SENDER_EMAIL = "debug@yourdomain.com";

// Helper to get environment variable
const getEnvVar = (key, defaultValue = "") => {
  return import.meta.env[key] || defaultValue;
};

export const emailConfig = {
  // First Brevo account (for Join Us form)
  joinUs: {
    apiKey: getEnvVar("VITE_BREVO_API_KEY_1", DEFAULT_API_KEY),
    senderEmail: getEnvVar("VITE_BREVO_SENDER_EMAIL_1", DEFAULT_SENDER_EMAIL),
    senderName: getEnvVar("VITE_BREVO_SENDER_NAME_1", "VZBL Careers"),
    recipientEmail: getEnvVar("VITE_RECIPIENT_EMAIL_1", "careers@example.com")
  },
  
  // Second Brevo account (for Contact form)
  contact: {
    apiKey: getEnvVar("VITE_BREVO_API_KEY_2", DEFAULT_API_KEY),
    senderEmail: getEnvVar("VITE_BREVO_SENDER_EMAIL_2", DEFAULT_SENDER_EMAIL),
    senderName: getEnvVar("VITE_BREVO_SENDER_NAME_2", "VZBL Contact"),
    recipientEmail: getEnvVar("VITE_RECIPIENT_EMAIL_2", "contact@example.com")
  },
  
  // For backward compatibility
  apiKey: getEnvVar("VITE_BREVO_API_KEY_1", DEFAULT_API_KEY),
  senderEmail: getEnvVar("VITE_BREVO_SENDER_EMAIL_1", DEFAULT_SENDER_EMAIL),
  senderName: getEnvVar("VITE_BREVO_SENDER_NAME_1", "VZBL"),
  joinUsRecipient: getEnvVar("VITE_RECIPIENT_EMAIL_1", "careers@example.com"),
  contactRecipient: getEnvVar("VITE_RECIPIENT_EMAIL_2", "contact@example.com"),
  recipientEmails: [
    getEnvVar("VITE_RECIPIENT_EMAIL_1", "careers@example.com"),
    getEnvVar("VITE_RECIPIENT_EMAIL_2", "contact@example.com")
  ].filter(email => email !== "")
}; 