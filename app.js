import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import connectDB from './DB/connection.js'
import * as indexRouter from './modules/index.router.js'
import { sendPdf } from './modules/user/controller/user.js'
// import moment from 'moment-timezone'
// console.log(moment.tz(Date.now(), "Egypt"));
const app = express()
const port = 3000
const baseUrl = process.env.BASEURL
app.use(express.json())
app.use(`${baseUrl}/uploads`, express.static("./uploads"))
app.use(`${baseUrl}/auth`, indexRouter.authRouter)
app.use(`${baseUrl}/user`, indexRouter.userRouter)
app.use(`${baseUrl}/post`, indexRouter.postRouter)
app.use(`${baseUrl}/comment`, indexRouter.commentRouter)
app.use('*', (req, res) => res.send('In-valid Routing'))
sendPdf()
connectDB()
app.listen(port, () => console.log(`Example app listening on port ${port}!`))