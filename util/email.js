const nodemailer = require("nodemailer");
const keys = require("../config/keys");


//Node Mailer Config
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: keys.emailAddress,
    pass: keys.emailPassword
  }
});

const sendEmail = (user1,user2,location) =>{
    const email = `
    <div><h1>Match Found</h1>
        Location:${location}<br/><br/>
        Player 1:<br/>Username:${user1.username}<br/>Phone Number${user1.phone}<br/><br/>
        Player2:<br/>Username:${user2.username}<br/>Phone Number${user2.phone}
    </div>
`
    //Email Config
    const mailOptions = {
    from: "Shakiran Sathiyanathan",
    to: '8shak.s@gmail.com',
    subject: "Match found for ballRunner",
    //Email to Be sent
    html: email,
    };
    //Send Email
    transporter.sendMail(mailOptions, function(err, info) {
    //handle email errors
    if (err) console.log(err);
    else console.log(info);
});

}
    
module.exports = sendEmail