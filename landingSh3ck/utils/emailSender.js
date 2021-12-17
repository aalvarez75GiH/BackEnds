const nodemailer = require('nodemailer')
const logger = require('./logger')

const emailSenderModule = (source, email, rawPIN) => {
    const interestedUserMessage = `Hola ${email}. Gracias por estar interesado en sh3ck`
    const userMessage = `Hola ${email}. Gracias por registrarte en sh3ck. 
    Hemos generado el #PIN: ${rawPIN} para que ppuedas entrar. 
    `
        
    const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth:{
                user: 'alvarez.arnoldo@gmail.com',
                pass: '261712411'
            }
        })
    
        const mailOptions = {
            from: 'alvarez.arnoldo@gmail.com',
            to: `${email}`,
            subject: 'Testing emails from BackEnd',
            text: `${source === 'interestedUsers' ? interestedUserMessage : userMessage}`
        }
    
        transporter.sendMail(mailOptions, function(error, info) {
            if(error) {
                logger.error(error)
            }else{
                logger.info(`Email was sent with this response: [${info.response}]`)
            }
        })
}


module.exports = {
    emailSenderModule
}

