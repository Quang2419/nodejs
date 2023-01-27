const express = require('express')

const connectDB = require("./connect/mongodb")
const route = require("./app.routes")
const port = process.env.PORT

const app = express()

app.use(express.json())
app.use(route)

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`)
})
module.exports = app

 