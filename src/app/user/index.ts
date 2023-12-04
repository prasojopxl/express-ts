import express from "express"
import { deleteUser, getUserID, getUsers, postUser, updateUser } from "./controller";

const app = express()

app.route("/")
    .get(getUsers)
    .post(postUser)

app.route("/:id")
    .get(getUserID)
    .put(updateUser)
    .delete(deleteUser)

export default app