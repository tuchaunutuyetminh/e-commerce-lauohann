const nodemailer = require('nodemailer')
const asyncHandler = require('express-async-handler')
const sendMail = asyncHandler(async({email, html, subject}) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_NAME,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });
  
    let info = await transporter.sendMail({
      from: '"Cuahangdientu " <no-reply@cuahangdientu.com>', // sender address
      to: email, // list of receivers
      subject: subject, // Subject line
      html: html, // html body
    });
    return info
}) 

module.exports = sendMail