#!/usr/bin/env node

/**
 * This script creates a template .env file for the project
 * Run with: node src/scripts/create-env-template.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the current directory and resolve the .env file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootPath = path.resolve(__dirname, '../..');
const envPath = path.join(rootPath, '.env.template');

// The template content for the .env file
const envTemplate = `# VZBL Email Configuration
# This file contains environment variables for the email functionality
# Copy this file to .env and update with your actual values

# Join Us form Brevo account
VITE_BREVO_API_KEY_1=xkeysib-your-key-here
VITE_BREVO_SENDER_EMAIL_1=your-verified-email@example.com
VITE_BREVO_SENDER_NAME_1=VZBL Careers
VITE_RECIPIENT_EMAIL_1=careers@your-company.com

# Contact form Brevo account
VITE_BREVO_API_KEY_2=xkeysib-your-other-key-here
VITE_BREVO_SENDER_EMAIL_2=your-other-verified-email@example.com
VITE_BREVO_SENDER_NAME_2=VZBL Contact
VITE_RECIPIENT_EMAIL_2=contact@your-company.com
`;

// Create the .env template file
fs.writeFileSync(envPath, envTemplate);

console.log(`✅ Created .env template at ${envPath}`);
console.log('Please copy this template to .env and update with your actual values'); 