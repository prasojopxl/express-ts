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
        console.log(info)
        res.status(200).send(
            {
                message: "Email sent successfully",
                message_id: info.messageId
            });
    });
}