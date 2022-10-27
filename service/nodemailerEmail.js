import nodemailer from "nodemailer";

export async function myEmail(dest, subject, message, attachments) {
  if (!attachments) {
    const attachments = []
  }
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service : 'gmail',
    auth: {
      user: process.env.nodemailerEmail, // generated ethereal user
      pass: process.env.nodemailerPassword, // generated ethereal password
    },
    tls: {
      // do not fail on invalid certs
      rejectUnauthorized: false
  },
  });
  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: `" FaceMost 👻" <${process.env.nodemailerEmail}>`, // sender address
    to: dest, // list of receivers
    subject: subject, // Subject line
    text: "Hello world?", // plain text body
    html: message, // html body
    attachments,
  });
  console.log(info);
}
/* 
    attachments : [
        {
            filename : 'text1.txt',
            content : 'Hellow world'
        },
        {
            filename : 'cv.pdf',
            path : path.join(__dirname, '../uploads/pdf'),
            contentType : 'application/pdf'
        },
        {
            filename : 'myImage.jpg',
            path : 'cloudinary link',
            contentType : 'image/jpeg'
        }
    ]
*/