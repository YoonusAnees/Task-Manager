import {createTransport} from "nodemailer";

const smtp_key=process.env.SMTP_KEY;

const sendEmail = (emailReceiver)=>{

    const transporter = createTransport({ //it is told where to fnd the server smptp server and and authntication for use it
    host: 'smtp-relay.brevo.com',
    port:'587',
    auth: {
        user:'8d117e001@smtp-brevo.com',
        pass: smtp_key
    }
});

//nodemailer // with this we can send smtp request // there have creareTranport method

const mailDetails = {
    from:"yoonusaneesniis@gmail.com",
    to:emailReceiver.receiver,
    subject:emailReceiver.subject,
    text:emailReceiver.content
} // deatils about r=the email 

//now sending the email

transporter.sendMail(mailDetails, (err, result)=>{
    if(err){
        console.log(err)}
    // }else{
    //     console.log("Email sent successfully" , result.response);
    // }
})
}


export default sendEmail;