require('isomorphic-fetch')

const server = require('../index')

afterEach(() => {
  try {
    server.close() // in case of failure before reaching close statement
  }catch (e) {}
})

test('proj4 integration test', done => {
  expect.assertions(2)
  fetch('http://localhost:3000/proj4/EPSG:2263/EPSG:4326/988217/192020')
    .then(respose => {
      return respose.json()
    }).then(coordinate => {
      expect(coordinate[0]).toBe(-73.9856945509795)
      expect(coordinate[1]).toBe(40.69372638702077)
      server.close(done)
    }).catch(() => {
      server.close(done)
    })
})