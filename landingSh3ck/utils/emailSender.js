const nodemailer = require('nodemailer')
const logger = require('./logger')

const emailSenderModule = (typeOfUser, email, rawPIN) => {
    const interestedUsersMessage = `Hola ${email}. Gracias por estar interesado en sh3ck`
    const usersMessage = `Hola ${email}. Gracias por registrarte en sh3ck. 
    Hemos generado el #PIN: ${rawPIN} para que ppuedas entrar. 
    `
    const checkersMessage = `Hola ${email}. Gracias por registrarte como chequeador en Sh3ck. 
    Hemos generado el #PIN: ${rawPIN} para que puedas entrar para ver tus chequeos asignados. 
    `

   
        
    const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth:{
                user: 'alvarez.arnoldo@gmail.com',
                pass: '26171241111'
            }
        })
    
        // switch (typeOfUser) {
        //     case 'interestedUser': 
        //         const mailOptions = {
        //         from: 'alvarez.arnoldo@gmail.com',
        //         to: `${email}`,
        //         subject: 'Testing emails from BackEnd',
        //         text: interestedUserMessage
        //         }  
        //         return 
        //     case 'users':
        //         const mailOptions = {
        //         from: 'alvarez.arnoldo@gmail.com',
        //         to: `${email}`,
        //         subject: 'Testing emails from BackEnd',
        //         text: userMessage
        //         }  
        //     case 'checker':
        //         const mailOptions = {
        //         from: 'alvarez.arnoldo@gmail.com',
        //         to: `${email}`,
        //         subject: 'Testing emails from BackEnd',
        //         text: checkerMessage
        //         }   
                
        
        //     default:
        //         break;
        // }

        if (typeOfUser === 'users'){
            const mailOptions = {
            from: 'alvarez.arnoldo@gmail.com',
            to: `${email}`,
            subject: 'Bienvenido nuevo usuario',
            text: usersMessage
            }
            transporter.sendMail(mailOptions, function(error, info) {
                if(error) {
                    logger.error(error)
                }else{
                    logger.info(`Email was sent with this response: [${info.response}]`)
                }
            })
            return 
        }
        if (typeOfUser === 'checkers'){
            const mailOptions = {
            from: 'alvarez.arnoldo@gmail.com',
            to: `${email}`,
            subject: 'Bienvenido nuevo chequeador',
            text: checkersMessage
            }
            transporter.sendMail(mailOptions, function(error, info) {
                if(error) {
                    logger.error(error)
                }else{
                    logger.info(`Email was sent with this response: [${info.response}]`)
                }
            })
            return 
        }
        if (typeOfUser === 'interestedUsers'){
            const mailOptions = {
            from: 'alvarez.arnoldo@gmail.com',
            to: `${email}`,
            subject: 'Que bueno que estás interesado...',
            text: interestedUsersMessage
            }
            transporter.sendMail(mailOptions, function(error, info) {
                if(error) {
                    logger.error(error)
                }else{
                    logger.info(`Email was sent with this response: [${info.response}]`)
                }
            })
            return 
        }
        // const mailOptions = {
        //     from: 'alvarez.arnoldo@gmail.com',
        //     to: `${email}`,
        //     subject: 'Testing emails from BackEnd',
        //     text: `${source === 'interestedUsers' ? interestedUserMessage : userMessage}`
        // }
    
//         transporter.sendMail(mailOptions, function(error, info) {
//             if(error) {
//                 logger.error(error)
//             }else{
//                 logger.info(`Email was sent with this response: [${info.response}]`)
//             }
//         })
// }
}
module.exports = {
    emailSenderModule
}

