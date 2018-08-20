require('dotenv').config()
const {Pool} = require('pg')

const transform = {
  pool: new Pool({connectionString: require('./db-uri-resolver')}),
  transform: (request, response) => {
    const params = request.params
    const fromEpsg = decodeURIComponent(params.fromEpsg).split(':')[1]
    const toEpsg = decodeURIComponent(params.toEpsg).split(':')[1]
    const x = params.x
    const y = params.y
    const sql = `SELECT ST_X(t.c) x,ST_Y(t.c) y FROM (SELECT ST_Transform(ST_SetSRID(ST_POINT(${x},${y}),${fromEpsg}),${toEpsg}) c) t`
    transform.pool.query(sql, (error, result) => {
      if (error) {
        if (error.syscall === 'connect') {
          console.error(error)
          response.status(500).json({message: 'no database'})
        } else {
          response.status(400).json({message: error.message, hint: error.hint})
        }
      } else {
        const transformed = result.rows[0]
        response.json([transformed.x, transformed.y])
      }
    })    
  }
}

module.exports = transform