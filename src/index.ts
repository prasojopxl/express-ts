import express from "express"
import dotenv from "dotenv";
import cors from "cors";
import routeUsers from "./app/user/index"
import routeImages from "./app/images/index"
import multer from "multer";
import path from "path"


dotenv.config()
const port = process.env.PORT || 7001 || 7002
const app = express()
let whitelist = ["http://localhost:3000", "http://localhost:5173"]

const corsOptions = {
    origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
        if (!origin || whitelist.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
};


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/images/");
    },
    filename: function (req, file, cb: any) {
        if (!file.originalname) {
            cb(new Error("File not found"), null);
        } else {
            const ext = path.extname(file.originalname);
            cb(null, "image" + Date.now() + ext);
        }
    }
});

app.use(cors(corsOptions))
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}))

app.get("/", (req, res) => {
    console.log(path.dirname(__dirname))
    res.status(200).send({
        message: "Welcome APP !!!"
    })
})
app.use("/public", express.static(path.join(path.dirname(__dirname), "uploads/images")))
app.use("/users", routeUsers)
app.use("/images", multer({ storage: storage }).any(), routeImages)
// app.use("/uploads/images", express.static(join(__dirname, "/uploads/images")))


app.listen(port, () => {
    console.log(`server is running on port ${port}`)
})