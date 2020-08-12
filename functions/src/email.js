const nodemailer = require("nodemailer");

// async..await is not allowed in global scope, must use a wrapper
async function main(auth) {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth,
  });

  let info = await transporter.sendMail({
    from: '"401B Doorbell" <benjaminshen22@gmail.com>', // sender address
    to: "benjaminshen22+401b@gmail.com", // list of receivers
    subject: "Ding Dong!", // Subject line
    text: "Someone rang the doorbell!", // plain text body
    html: "<p>Someone rang the doorbell!</p>", // html body
  });

  console.log("Message sent: %s", info.messageId);
}

exports.send = (credentials) => {
  main(credentials).catch(console.error);
};
