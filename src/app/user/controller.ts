import { PrismaClient } from "@prisma/client";
import { Request, Response, NextFunction } from 'express';
import joi from "joi"
import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken";

const prisma = new PrismaClient()

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
            await prisma.users.create({
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

export function getUserID(req: Request, res: Response, next: NextFunction) {
    async function main() {
        try {
            const user = await prisma.users.findUnique({
                where: {
                    id: req.params.id
                },
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
            if (!user) {
                return res.status(400).send({
                    message: "User not found"
                })
            }
            res.json(user)
        } catch (error) {
            console.log(error)
        }
    }
    main()
}

export function getUserMe(req: Request, res: Response, next: NextFunction) {
    const token = req.headers ? req.headers?.authorization : null
    if (!token || token === undefined) {
        return res.status(401).send({
            message: "Forbidden Access"
        });
    }
    const jwtToken = token?.split(" ").pop();
    const dataJwt: any = jwt.verify(`${jwtToken}`, `${process.env.JWT_SECRET}`);

    async function main() {
        try {
            const user = await prisma.users.findUnique({
                where: {
                    id: dataJwt.data.id
                }
            })
            if (!user) {
                return res.status(400).json({
                    message: "User not found",
                });
            }
            res.json(user)
        } catch (error) {
            res.status(401).send({
                message: "Unauthorized"
            });
        }
    }
    main()
}

export function updateUserMe(req: Request, res: Response, next: NextFunction) {
    const token = req.headers ? req.headers?.authorization : null
    if (!token || token === undefined) {
        return res.status(401).send({
            message: "Forbidden Access"
        });
    }
    const jwtToken = token?.split(" ").pop();
    const dataJwt: any = jwt.verify(`${jwtToken}`, `${process.env.JWT_SECRET}`);

    async function main() {
        const checkUser = await prisma.users.findUnique({
            where: {
                id: dataJwt.data.id
            }
        })
        const password = req.body.password ? await bcryptjs.hash(req.body.password, 10) : dataJwt.data.password
        try {
            const updateUser = await prisma.users.update({
                where: {
                    id: dataJwt.data.id
                },
                data: {
                    name: req.body.name,
                    password: password
                }
            })
            res.json({
                message: "User updated successfully",
            })
        } catch (error) {
            res.status(401).send({
                message: "Unauthorized"
            });
        }

    }
    main()
}



export function updateUser(req: Request, res: Response, next: NextFunction) {
    async function main() {
        const checkUser = await prisma.users.findUnique({
            where: {
                id: req.params.id
            }
        })
        if (!checkUser) {
            return res.status(400).send({
                message: "User not found"
            })
        }
        const user = await prisma.users.update({
            where: {
                id: req.params.id
            },
            data: {
                name: req.body.name,
                username: req.body.username,
                role: req.body.role,
                status: req.body.status,
            }
        })
        return res.json(user)
    }
    main()
}

export function deleteUser(req: Request, res: Response, next: NextFunction) {
    const main = async () => {
        const checkUser = await prisma.users.findUnique({
            where: {
                id: req.params.id
            }
        })
        if (!checkUser) {
            return res.status(400).send({
                message: "User not found"
            })
        }
        const user = await prisma.users.delete({
            where: {
                id: req.params.id
            }
        })
        return {
            res: res.json({
                message: `User ${req.params.id} deleted successfully`,
            }),
        }
    }
    main()
}