const nodemailer = require("nodemailer");

// async..await is not allowed in global scope, must use a wrapper
async function main(auth, userEmail, time) {
  try {
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth,
    });

    let info = await transporter.sendMail({
      from: '"401B Doorbell" <benjaminshen22@gmail.com>', // sender address
      to: "benjaminshen22+401b@gmail.com", // list of receivers
      subject: `Ding Dong!${
        userEmail ? " " + userEmail + "rang the doorbell." : ""
      }`, // Subject line
      html: `<p>${
        userEmail || "Someone"
      } rang the doorbell on <a href="https://apt.benjaminshen.com">apt.benjaminshen.com</a>!</p>${
        time && `<p>Time: <em>${time}</em></p>`
      }`, // html body
    });

    console.log("Message sent: %s", info.messageId);
  } catch (err) {
    console.log(err);
  }
}

exports.send = main;
