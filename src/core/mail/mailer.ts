import nodemailer from 'nodemailer';

let transporter = nodemailer.createTransport({
  service: 'hotmail',
  auth: {
    user: process.env.SENDER_EMAIL,
    pass: process.env.SENDER_EMAIL_PASSWORD
  }
});

function sendEmail(subject: string, body: string) {

    let mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: process.env.RECEIVER_EMAIL,
        subject: subject,
        text: body
      };

    transporter.sendMail(mailOptions, function(error: any, info: any){
        if (error) {
          //console.log(error);
        } else {
          //console.log('Email sent: ' + info.response);
        }
      });
}

export default sendEmail;