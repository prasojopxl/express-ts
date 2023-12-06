import { PrismaClient } from "@prisma/client";
import { Request, Response, NextFunction } from 'express';
import joi from "joi"
import nodemailer from "nodemailer"

const prisma = new PrismaClient()

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "prasojodesigner@gmail.com",
        pass: process.env.EMAIL_PASSWORD,
    },
});

export function testMail(req: Request, res: Response, next: NextFunction) {
    res.send("sendMail")
}

export function sendMail(req: Request, res: Response, next: NextFunction) {
    const shcema = joi.object().keys({
        subject: joi.string().min(3).required(),
        to: joi.string().email().required(),
        message: joi.string().min(3).required()
    })
    const { error } = shcema.validate(req.body)
    if (error) {
        return res.status(400).send({
            message: error.message
        })
    }

    const { to, subject, message } = req.body;
    const mailData = {
        from: 'noreplay@pejuangkoding.com',
        to: to,
        subject: subject,
        text: message,
        html: message,
    };

    transporter.sendMail(mailData, (error, info) => {
        if (error) {
            return console.log(error);
        }
        res.status(200).send(
            {
                message: "Email sent successfully",
                message_id: info.messageId
            });
    });
}