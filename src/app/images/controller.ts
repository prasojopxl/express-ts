import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client'
import imageSize from "image-size";
import joi from "joi"


const path = require('path');
const prisma = new PrismaClient()

export function createImage(req: Request, res: Response, next: NextFunction) {
    const files: any = req.files
    const schema = joi.object().keys({
        files: joi.array().items(joi.object({
            fieldname: joi.string().required(),
            originalname: joi.string().required(),
            encoding: joi.string().required(),
            mimetype: joi.string().required(),
            destination: joi.string().required(),
            filename: joi.string().required(),
            path: joi.string().required(),
            size: joi.number().max(1000000).required(),
        })).required(),
    })
    const { error } = schema.validate({ files })
    if (error) {
        return res.status(400).send({
            message: error.details[0].message
        })
    }

    async function main() {
        try {
            const image = await prisma.images.create({
                data: {
                    title: files[0].originalname,
                    url: `/${files[0].path}`,
                    size: parseInt(files[0].size),
                    width: parseInt(`${imageSize(files[0].path).width}`),
                    height: parseInt(`${imageSize(files[0].path).height}`),
                    mimetype: files[0].mimetype
                }
            })
            // console.log(files ? files[0].path : "no files")
            res.status(201).send({
                message: "Image upload successfully",
                data: {
                    title: files[0].originalname,
                    url: `/${files[0].path}`,
                    mimetype: files[0].mimetype
                }
            })
        } catch (error) {
            console.log(error)
        }

    }
    main()
}

export function getImageID(req: Request, res: Response, next: NextFunction) {
    async function main() {
        try {

            const image = await prisma.images.findUnique({
                where: {
                    id: req.params.id
                }
            })
            if (!image) {
                return res.status(400).send({
                    message: "Image not found"
                })
            }
            res.json(image)
        } catch (error) {
            console.log(error)
        }
    }
    main()
}