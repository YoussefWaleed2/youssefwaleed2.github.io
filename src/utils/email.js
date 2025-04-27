import { emailConfig } from '../config/emailConfig';

/**
 * Sends an email using configured email service
 * @param {Object} emailData - Email data object with proper format
 * @returns {Promise} - Response from email API
 */
export const sendEmail = async (emailData) => {
  try {
    // Determine which email configuration to use based on the form type
    const formType = emailData.formType || 'contact';
    const config = formType === 'joinUs' ? emailConfig.joinUs : emailConfig.contact;
    
    // Check if we're using the default debug API key
    const isUsingDefaultKey = config.apiKey.includes("xkeysibDebugKeyDoNotUseThisInProduction");
    if (isUsingDefaultKey && import.meta.env.DEV) {
      // For development - mock a successful response
      return { 
        messageId: 'dev-mode-mock-id',
        message: 'Email simulated in development mode' 
      };
    }
    
    // Format data for Brevo API
    const apiData = {
      sender: {
        name: emailData.senderName || config.senderName,
        email: emailData.senderEmail || config.senderEmail
      },
      to: emailData.to.map(email => ({ email })),
      replyTo: { email: emailData.replyTo },
      subject: emailData.subject,
      htmlContent: emailData.htmlContent,
    };
    
    // Only add attachment if there actually are attachments
    // For JoinUsForm with resumes
    if (formType === 'joinUs' && emailData.attachment && 
        Array.isArray(emailData.attachment) && 
        emailData.attachment.length > 0) {
      apiData.attachment = emailData.attachment;
    }
    
    // Send via Brevo API
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'api-key': config.apiKey
      },
      body: JSON.stringify(apiData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage;
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.message || 'Unknown error';
      } catch (e) {
        errorMessage = errorText || `HTTP error ${response.status}`;
      }
      throw new Error(`Email sending failed: ${errorMessage}`);
    }

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    throw error;
  }
}; 