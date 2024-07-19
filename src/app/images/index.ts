import express from "express"
import { createImage, getImageID, getImages } from "./controller"

const app = express()

app.route("/")
    .get(getImages)
    .post(createImage)

app.route("/:id")
    .get(getImageID)

export default app