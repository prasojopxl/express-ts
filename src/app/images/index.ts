import express from "express"
import { createImage } from "./controller"

const app = express()

app.route("/")
    .post(createImage)


export default app