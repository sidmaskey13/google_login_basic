require('dotenv').config()
const port = 4000

const express = require('express')
const app = express()

var cookieParser = require('cookie-parser')
app.use(cookieParser())


app.set('view engine', 'ejs');
app.set("views", __dirname + "/views");

const routes = require('./route')
app.use('/', routes)

app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`)
})
