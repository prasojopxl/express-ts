import { PrismaClient } from "@prisma/client";
import { Request, Response, NextFunction } from 'express';
import joi from "joi"
import bcrypt, { compareSync } from "bcryptjs"
import jwt from "jsonwebtoken"

const prisma = new PrismaClient();
export function Login(req: Request, res: Response, next: NextFunction) {
    async function main() {
        const shcema = joi.object().keys({
            username: joi.string().email().required(),
            password: joi.string().required(),
        })
        const { error } = shcema.validate(req.body)
        if (error) {
            return res.status(400).send({
                message: error.message
            })
        }

        const checkUser = await prisma.users.findUnique({
            where: {
                username: req.body.username,
                status: true
            }
        })
        if (!checkUser) {
            return res.status(400).send({
                message: "User not found or not active"
            })
        }
        const checkPassword = await bcrypt.compare(req.body.password, checkUser.password)
        console.log(checkUser)
        const token: any = jwt.sign({
            exp: Math.floor(Date.now() / 1000) + (60 * 60), //exp 1 hour
            data: {
                id: checkUser.id,
                username: checkUser.username,
                role: checkUser.role
            }
        }, `${process.env.JWT_SECRET}`)
        if (!checkPassword) {
            return res.status(400).send({
                message: "Wrong password"
            })
        }
        return res.json({
            message: "Login successfully",
            token
        })
    }
    main()
}