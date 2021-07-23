import sendgridMail from '@sendgrid/mail';
import Movie from '../../models/movie';

export function sendSgMail(subject: string, text: string, html: string) {
    let SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;

    if(SENDGRID_API_KEY !== undefined) {
        sendgridMail.setApiKey(SENDGRID_API_KEY);

        let msg = {
            to: process.env.RECEIVER_EMAIL!, // Change to your recipient
            from: process.env.SENDER_EMAIL!, // Change to your verified sender
            subject: subject,
            text: text,
            html: html
        }
        
            sendgridMail.send(msg)
                .then(() => {
                    console.log('Email sent')
                })
                .catch((error: any) => {
                    console.error(error)
                })
    }
}

export function sendSgMailWithTemplate( movie : Movie, templateId: string) {
    let SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;

    if(SENDGRID_API_KEY !== undefined) {
        sendgridMail.setApiKey(SENDGRID_API_KEY);

        let msg = {
            to: process.env.RECEIVER_EMAIL!, // Change to your recipient
            from: process.env.SENDER_EMAIL!, // Change to your verified sender
            templateId: templateId,
            dynamicTemplateData: {
                movie: movie.name,
                description: movie.description
            }
        };

        sendgridMail.send(msg)
            .then(() => {
                //console.log('Email sent with template')
            })
            .catch((error: any) => {
                //console.error(error)
            })
        }
}