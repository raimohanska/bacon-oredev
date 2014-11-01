var express = require('express')
var port = process.env.PORT || 3000
var app = express()

app.use(express.compress())
app.use(express.json())
app.use('/', express.static(__dirname))
app.use('/drums/', express.static(__dirname + '/node_modules/drums.js'))
app.listen(port)
