import express from "express"
import { Login } from "./controller"

const app = express()

app.route("/login")
    .post(Login)


export default app