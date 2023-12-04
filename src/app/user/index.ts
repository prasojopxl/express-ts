import express from "express"
import { getUsers, postUser } from "./controller";

const app = express()

app.route("/")
    .get(getUsers)
    .post(postUser)

export default app