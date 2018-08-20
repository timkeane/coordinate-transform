let dbUri = process.env.VCAP_SERVICES 
if (dbUri) {
  dbUri = JSON.parse(dbUri)['user-provided'][0].credentials.uri
} else {
  dbUri = process.env.POSTGIS_URI
}

module.exports = dbUri