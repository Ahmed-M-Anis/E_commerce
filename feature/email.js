const nodemailer = require("nodemailer");
const pug = require("pug");
const { convert } = require("html-to-text");

class Email {
  constructor(user, url) {
    this.firstName = user.name.split(" ")[0];
    this.to = user.email;
    this.url = url;
    this.from = `ahmed anis <"testemail31585@gmail.com">`;
  }

  newTransporter() {
    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "testemail31585@gmail.com",
        pass: "wdwa hnrd vgqp uvsd",
      },
    });
  }

  async send(template, subject) {
    const html = pug.renderFile(`./views/emailTemplet/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject,
    });

    const mailDetails = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: convert(html),
    };

    await this.newTransporter().sendMail(mailDetails);
  }

  async sendWelcome() {
    await this.send("welcome", "welcom to the family");
  }

  async sendResetPassword() {
    await this.send(
      "resetPassword",
      "reset Passwor link (will expires in 10 min)"
    );
  }
}

module.exports = Email;
