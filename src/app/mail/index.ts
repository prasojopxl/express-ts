import express from "express"
import { sendMail, testMail } from "./controller"

const app = express()

app.route("/")
    .get(testMail)
    .post(sendMail)

export default app