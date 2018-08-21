const express = require('express')
const proj4 = require('./src/proj4')
const postgis = require('./src/postgis')

const app = express()

app.get('/proj4/:fromEpsg/:toEpsg/:x/:y/', proj4.transform)
app.get('/postgis/:fromEpsg/:toEpsg/:x/:y/', postgis.transform)

const server = app.listen(process.env.PORT || 3000)
server.postgis = postgis

module.exports = server