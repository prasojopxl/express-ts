import express from "express"
import { createImage, getImageID } from "./controller"

const app = express()

app.route("/")
    .post(createImage)

app.route("/:id")
    .get(getImageID)

export default app