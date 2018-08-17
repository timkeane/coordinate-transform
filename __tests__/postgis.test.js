const mockResponse = require('./response.mock')

const {Pool} = require('pg')

jest.mock('pg')

process.env.POSTGIS_URI = 'postgresql://user:password@localhost:5432/dbname'

const transform = require('../src/postgis')

let error = false
beforeEach(() => {
  mockResponse.reset()
  transform.pool.query = jest.fn((sql, callback) => {
    if (error) {
      callback(error)
    } else {
      callback(undefined, {rows: [{x: 'transformed-x', y: 'transformed-y'}]})
    }
  })
})
  
test('transform success', () => {
  expect.assertions(6)
  const params = {
    fromEpsg: 'EPSG:from',
    toEpsg: 'EPSG:to',
    x: 100,
    y: 200
  }

  transform.transform({params: params}, mockResponse)

  expect(Pool).toHaveBeenCalledTimes(1)
  expect(Pool.mock.calls[0][0]).toEqual({connectionString: process.env.POSTGIS_URI})

  expect(transform.pool.query).toHaveBeenCalledTimes(1)
  expect(transform.pool.query.mock.calls[0][0]).toBe(`SELECT ST_X(t.c) x,ST_Y(t.c) y FROM (SELECT ST_Transform(ST_GeomFromText('POINT(${params.x} ${params.y})',${params.fromEpsg.split(':')[1]}),${params.toEpsg.split(':')[1]}) c) t`)
  
  expect(mockResponse.json).toHaveBeenCalledTimes(1)
  expect(mockResponse.json.mock.calls[0][0]).toEqual(['transformed-x', 'transformed-y'])
})

test('transform bad request', () => {
  expect.assertions(8)

  const params = {
    fromEpsg: 'EPSG:from',
    toEpsg: 'EPSG:to',
    x: 100,
    y: 200
  }
  error = {message: 'sol', hint: 'good luck'}

  transform.transform({params: params}, mockResponse)

  expect(Pool).toHaveBeenCalledTimes(1)
  expect(Pool.mock.calls[0][0]).toEqual({connectionString: process.env.POSTGIS_URI})

  expect(transform.pool.query).toHaveBeenCalledTimes(1)
  expect(transform.pool.query.mock.calls[0][0]).toBe(`SELECT ST_X(t.c) x,ST_Y(t.c) y FROM (SELECT ST_Transform(ST_GeomFromText('POINT(${params.x} ${params.y})',${params.fromEpsg.split(':')[1]}),${params.toEpsg.split(':')[1]}) c) t`)
  
  expect(mockResponse.status).toHaveBeenCalledTimes(1)
  expect(mockResponse.status.mock.calls[0][0]).toBe(400)
  
  expect(mockResponse.json).toHaveBeenCalledTimes(1)
  expect(mockResponse.json.mock.calls[0][0]).toEqual(error)
})

test('transform no database', () => {
  expect.assertions(8)

  const params = {
    fromEpsg: 'EPSG:from',
    toEpsg: 'EPSG:to',
    x: 100,
    y: 200
  }
  error = {syscall: 'connect'}

  transform.transform({params: params}, mockResponse)

  expect(Pool).toHaveBeenCalledTimes(1)
  expect(Pool.mock.calls[0][0]).toEqual({connectionString: process.env.POSTGIS_URI})

  expect(transform.pool.query).toHaveBeenCalledTimes(1)
  expect(transform.pool.query.mock.calls[0][0]).toBe(`SELECT ST_X(t.c) x,ST_Y(t.c) y FROM (SELECT ST_Transform(ST_GeomFromText('POINT(${params.x} ${params.y})',${params.fromEpsg.split(':')[1]}),${params.toEpsg.split(':')[1]}) c) t`)
  
  expect(mockResponse.status).toHaveBeenCalledTimes(1)
  expect(mockResponse.status.mock.calls[0][0]).toBe(500)
  
  expect(mockResponse.json).toHaveBeenCalledTimes(1)
  expect(mockResponse.json.mock.calls[0][0]).toEqual({message: 'no database', hint: undefined})
})