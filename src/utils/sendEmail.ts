import nodemailer from "nodemailer";

export default async function sendEmail(
  to: string,
  subject: string,
  html: string
) {
  // Creating test account
  // const testAccount = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for port 465, false for other ports
    auth: {
      user: "jwz5yrt4qpeu22bc@ethereal.email",
      pass: "hgH3ju5HVBMrxxAgYW",
    },
  });

  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: '"Maddison Foo Koch 👻" <maddison53@ethereal.email>', // sender address
    to: to, // list of receivers
    subject: subject, // Subject line
    html, // html
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
  console.log("Email URL: ", nodemailer.getTestMessageUrl(info));
}
