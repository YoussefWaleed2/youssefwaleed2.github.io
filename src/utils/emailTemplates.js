/**
 * Email template generator for VZBL forms
 */

// Base HTML template with styling
const baseTemplate = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>VZBL</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 0;
    }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background-color: #000;
      padding: 30px;
      text-align: center;
      color: #fff;
    }
    .logo {
      font-size: 24px;
      font-weight: bold;
      letter-spacing: 2px;
    }
    .content {
      padding: 30px 20px;
      background-color: #f9f9f9;
    }
    .footer {
      padding: 20px;
      text-align: center;
      font-size: 12px;
      color: #888;
      background-color: #f1f1f1;
    }
    h1 {
      color: #000;
      margin-top: 0;
      font-size: 22px;
    }
    h2 {
      color: #333;
      font-size: 18px;
      margin-top: 30px;
      margin-bottom: 15px;
      padding-bottom: 10px;
      border-bottom: 1px solid #eee;
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    td {
      padding: 10px;
      border-bottom: 1px solid #eee;
    }
    td:first-child {
      font-weight: bold;
      width: 40%;
    }
    .highlight {
      background-color: #f5f5f5;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <div class="logo">VZBL</div>
    </div>
    <div class="content">
      {{CONTENT}}
    </div>
    <div class="footer">
      &copy; ${new Date().getFullYear()} VZBL. All rights reserved.<br>
      This is an automated email, please do not reply.
    </div>
  </div>
</body>
</html>
`;

/**
 * Generates a styled HTML email for Contact form submissions
 * @param {Object} formData - The form data from the contact form
 * @returns {string} - HTML content for the email
 */
export const generateContactEmail = (formData) => {
  const { 
    name, email, phone, projectName, 
    sector, service, budget,
    brandName, brandingType,
    socialMediaLink, platforms, campaignObjective
  } = formData;

  // Create service-specific content
  let serviceDetails = '';
  
  if (service === 'Branding') {
    serviceDetails = `
      <tr>
        <td>Brand Name</td>
        <td>${brandName || 'Not provided'}</td>
      </tr>
      <tr>
        <td>Branding Type</td>
        <td>${brandingType || 'Not provided'}</td>
      </tr>
    `;
  } else if (service === 'Marketing' || service === 'Advertisement') {
    serviceDetails = `
      <tr>
        <td>Social Media Link</td>
        <td>${socialMediaLink || 'Not provided'}</td>
      </tr>
      <tr>
        <td>Platforms</td>
        <td>${platforms.join(', ') || 'Not provided'}</td>
      </tr>
    `;
    
    if (service === 'Advertisement') {
      serviceDetails += `
        <tr>
          <td>Campaign Objective</td>
          <td>${campaignObjective || 'Not provided'}</td>
        </tr>
      `;
    }
  }

  // Create the main content
  const content = `
    <h1>New Contact Form Submission</h1>
    <p>A new potential client has submitted the contact form with the following information:</p>
    
    <h2>Client Information</h2>
    <table>
      <tr class="highlight">
        <td>Name</td>
        <td>${name}</td>
      </tr>
      <tr>
        <td>Email</td>
        <td>${email}</td>
      </tr>
      <tr class="highlight">
        <td>Phone</td>
        <td>${phone}</td>
      </tr>
    </table>
    
    <h2>Project Details</h2>
    <table>
      <tr class="highlight">
        <td>Project Name</td>
        <td>${projectName}</td>
      </tr>
      <tr>
        <td>Sector</td>
        <td>${sector}</td>
      </tr>
      <tr class="highlight">
        <td>Service</td>
        <td>${service}</td>
      </tr>
      ${serviceDetails}
      <tr>
        <td>Budget</td>
        <td>${budget}</td>
      </tr>
    </table>
  `;

  return baseTemplate.replace('{{CONTENT}}', content);
};

/**
 * Generates a styled HTML email for Join Us form submissions
 * @param {Object} formData - The form data from the join us form
 * @returns {string} - HTML content for the email
 */
export const generateJoinUsEmail = (formData) => {
  const { 
    firstName, lastName, email, phone, 
    jobTitle, aboutYou, resume
  } = formData;

  // Create the main content
  const content = `
    <h1>New Job Application</h1>
    <p>A new candidate has applied for a position at VZBL.</p>
    
    <h2>Position Information</h2>
    <table>
      <tr class="highlight">
        <td>Job Title</td>
        <td>${jobTitle || 'General Application'}</td>
      </tr>
    </table>
    
    <h2>Candidate Information</h2>
    <table>
      <tr class="highlight">
        <td>Name</td>
        <td>${firstName} ${lastName}</td>
      </tr>
      <tr>
        <td>Email</td>
        <td>${email}</td>
      </tr>
      <tr class="highlight">
        <td>Phone</td>
        <td>${phone}</td>
      </tr>
    </table>
    
    ${aboutYou ? `
    <h2>Additional Information</h2>
    <p>${aboutYou}</p>
    ` : ''}
    
    ${resume ? `
    <h2>Resume</h2>
    <p>The candidate has attached their resume to this application.</p>
    ` : ''}
  `;

  return baseTemplate.replace('{{CONTENT}}', content);
}; 