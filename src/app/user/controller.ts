import { PrismaClient } from "@prisma/client";
import { Request, Response, NextFunction } from 'express';
import joi from "joi"
import bcryptjs from "bcryptjs"

const prisma = new PrismaClient()
export function getUsers(req: Request, res: Response, next: NextFunction) {
    async function main() {
        try {
            const users = await prisma.users.findMany({
                select: {
                    id: true,
                    username: true,
                    name: true,
                    role: true,
                    status: true,
                    created_at: true,
                    updated_at: true,
                    posts: true,

                }
            })
            res.json(users)
        } catch (error) {
            console.log(error)
        }
    }
    main()
}

export function postUser(req: Request, res: Response, next: NextFunction) {
    const shcema = joi.object().keys({
        name: joi.string().min(3).required(),
        username: joi.string().email().required(),
        password: joi.string().required()
    })
    const { error } = shcema.validate(req.body)
    if (error) {
        return res.status(400).send({
            message: error.message
        })
    }
    const checkUser = async () => {
        const user = await prisma.users.findUnique({
            where: {
                username: req.body.username
            }
        })
        return user
    }
    checkUser()
        .then((user) => {
            if (user) {
                return res.status(400).send({
                    message: "User already exists"
                })
            }
        })
    async function main() {
        try {
            const password = await bcryptjs.hash(req.body.password, 10)
            const addUser = await prisma.users.create({
                data: {
                    name: req.body.name,
                    username: req.body.username,
                    password: password
                }
            })
            res.send({
                message: `User ${req.body.name} created successfully`,
            })

        } catch (error) {
            console.log(error)
        }
    }
    main()
}