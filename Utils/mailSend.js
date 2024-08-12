const nodemailer = require("nodemailer");
const pug = require("pug");

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name;

    this.url = url;
    this.from = `Mamvo App <${process.env.USERNAME}>`;
  }

  newTransport() {
    // Send Grid
    return nodemailer.createTransport({
      service: "gmail",
      host: process.env.USER_HOST,
      auth: {
        user: process.env.GMAILUSER,
        pass: process.env.GMAILPASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
  }
  async send(template, subject) {
    // console.log(this.from);
    // console.log(this.to);
    // console.log(process.env.GMAILUSER);
    // console.log(process.env.GMAILPASS);

    // 2) Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      text: template,
    };
    // 3)Creat a transport and send email

    await this.newTransport().sendMail(mailOptions);
  }
  async sendWelcome(a) {
    console.log("sending mail...");
    await this.send(`Your OTP is: ${a}`, `Email Verification For Mamvo App`);
  }

  async affiliateConfirmation(a){
    console.log("sending mail affiliate...");
    await this.send(`Your password is: ${a}. You can change this password later in the settings. Note: Please do not share this password with anyone.`, `Affiliation with Mamvo App`);
  }

  async affiliateRejection(){
    console.log("sending mail affiliate...");
    await this.send(`Your Request for the affiliate user has been rejected by the admins.`, `Affiliation with Mamvo App`);
  }

  // async sendMamvoWelcome(a) {
  //   console.log("sending mail...");
  //   await this.send(
  //     `Welcome, Your Join OTP is: ${a}`,
  //     `Account Setup Verification For Mamvo App`
  //   );
  // }

  async sendPasswordReset(a) {
    await this.send(
      `Password Reset Code is:${a}`,
      "Your password reset token ! ( valid for 10 minutes)"
    );
  }
};
