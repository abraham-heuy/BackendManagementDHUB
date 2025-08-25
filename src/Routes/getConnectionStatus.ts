import express from  "express"
import { testDBConection } from "@app/DB/db"

const connect = express.Router()

connect.use("/status", testDBConection)

export default connect