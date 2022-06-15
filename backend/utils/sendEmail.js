const nodeMailer = require('nodemailer')
// const SMPT_SERVICE="gmail"
// const SMPT_MAIL="khandelwalpratham8743@gmail.com"
// const SMPT_PASSWORD="mongoPratham0987"
// const SMPT_HOST="smtp.gmail.com"
// const SMPT_PORT="465"

const sendMailer = async(options) => {
    
    const transporter = nodeMailer.createTransport({
        host:process.env.SMPT_HOST,
        port:process.env.SMPT_PORT,
        service: process.env.SMPT_SERVICE,
        auth: {
            user: process.env.SMPT_MAIL,
            pass: process.env.SMPT_PASSWORD
        },
    });

    const mailOptions = {
        from: process.env.SMPT_MAIL,
        to: options.email,
        subject: options.subject,
        text: options.message
    }

    await transporter.sendMail(mailOptions);
};

module.exports = sendMailer;