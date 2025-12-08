# Email Setup Guide for Contact Form

Your contact form is configured to send responses to: **izhaarlove2025@gmail.com**

## Option 1: Using Formspree (Recommended - Free & Easy)

1. Go to [https://formspree.io](https://formspree.io)
2. Sign up for a free account using your email: izhaarlove2025@gmail.com
3. Create a new form
4. Copy your unique Form ID (looks like: `xpznabcd`)
5. In `script.js`, replace `YOUR_FORM_ID` with your actual Form ID:
   ```javascript
   fetch('https://formspree.io/f/xpznabcd', {
   ```
6. Save and test your form!

**Formspree Free Plan includes:**
- 50 submissions/month
- Email notifications
- Spam filtering
- No credit card required

## Option 2: Using Web3Forms (Alternative - Free)

1. Go to [https://web3forms.com](https://web3forms.com)
2. Enter your email: izhaarlove2025@gmail.com
3. Get your Access Key
4. Update `script.js`:
   ```javascript
   formData.append('access_key', 'YOUR_ACCESS_KEY');
   fetch('https://api.web3forms.com/submit', {
   ```

## Option 3: Using EmailJS (Alternative - Free)

1. Go to [https://www.emailjs.com](https://www.emailjs.com)
2. Sign up and connect your Gmail
3. Create an email service and template
4. Get your Service ID, Template ID, and Public Key
5. Update the JavaScript accordingly

## Option 4: Direct mailto (Simple but Limited)

If you want a simpler approach without external services, I can modify the form to use `mailto:` which will open the user's email client.

## Current Backup

All form submissions are also stored in the browser's localStorage as a backup. You can view them in the browser console:
```javascript
console.log(JSON.parse(localStorage.getItem('izhaarSubmissions')))
```

## Need Help?

Let me know which option you'd like to use, and I can help you set it up!
