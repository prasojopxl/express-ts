import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client'
import multer from "multer";
import fs from "fs"
const path = require('path');

const prisma = new PrismaClient()

export function createImage(req: Request, res: Response, next: NextFunction) {
    const files = req.files
    async function main() {
        // const image = await prisma.images.create({
        //     data: {
        //         title: files?.data.originalname,
        //     }
        // })
        console.log(files)
        res.status(201).send({
            message: "Image upload successfully",
            data: files
        })

    }
    main()
}

export function getImage(req: Request, res: Response, next: NextFunction) {

}