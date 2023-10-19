const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'Gmail', 
  auth: {
    user: 'musimbival@gmail.com',
    pass: 'Atero97*Vaal*',
  },
});

const mailOptions = {
    from: 'musimbival@gmail.com',
    to: 'faithchepkoech40@gmail.com',
    subject: 'Payment Details',
    html: '<p>Your payment details here...</p>',
  };
  
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });

  function sendPaymentDetailsByEmail() {
    
    <button type="button" id="email" onClick={handleSendEmail}>SendEmail</button>
  }
  