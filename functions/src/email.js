const nodemailer = require("nodemailer");

const config = require("../env.json").gmail.auth;

// async..await is not allowed in global scope, must use a wrapper
async function main() {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: config,
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

exports.send = () => {
  main().catch(console.error);
};
