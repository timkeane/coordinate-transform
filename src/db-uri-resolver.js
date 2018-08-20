let dbUri = process.env.VCAP_SERVICES 

console.log('process.env.VCAP_SERVICES=', process.env.VCAP_SERVICES)

if (dbUri) {

  console.log('Parsed', JSON.parse(dbUri))

  dbUri = JSON.parse(dbUri)['user-provided'].credentials.uri
} else {
  dbUri = process.env.POSTGIS_URI
}

module.exports = dbUri