import express from "express"
import { deleteUser, getUserID, getUsers, postUser, updateUser, getUserMe, updateUserMe } from "./controller";
import { verfyToken } from "../middleware/token";

const app = express()

app.route("/")
    .get(verfyToken, getUsers)
    .post(postUser)

app.route("/me")
    .get(getUserMe)
    .put(updateUserMe)

app.route("/:id")
    .get(verfyToken, getUserID)
    .put(verfyToken, updateUser)
    .delete(verfyToken, deleteUser)

export default app