const express = require('express')
const app = new express()
const port = 2000
app.use(express.static('public'))
app.listen(port)