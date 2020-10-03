const sgMail = require('@sendgrid/mail')
const { SENGRID_API_KEY, EMAIL } = require('../config/keys')

sgMail.setApiKey(SENGRID_API_KEY)

const sendWelcomeEmail = (name, email) => {
   sgMail.send({
      to: email,
      from: 'instagramclone007@outlook.com',
      subject: 'Welcome to Instagram Clone!',
      text: `Happy to see you, ${name}`,
   })
}

const sendResetPasswordMail = (token, email) => {
   sgMail.send({
      to: email,
      from: 'instagramclone007@outlook.com',
      subject: 'Reset password',
      html: `<h4><a href="${EMAIL}/resetpassword/${token}">Click here to reset password.</a> This link is valid for only 1 hour</h4>`,
   })
}

module.exports = {
   sendWelcomeEmail,
   sendResetPasswordMail,
}
