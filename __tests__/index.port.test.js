const app = {
  get: jest.fn(),
  listen: jest.fn()
}
jest.doMock('express', () => {
  return () => {
    return app
  }
})

const postgis = require('../src/postgis')
const proj4 = require('../src/proj4')
beforeEach(() => {
  app.get.mockReset()
  app.listen.mockReset()
})

test('app created and configured on specified port', () => {
  expect.assertions(7)

  process.env.PORT = 8080

  require('../index')

  expect(app.get).toHaveBeenCalledTimes(2)
  expect(app.get.mock.calls[0][0]).toBe('/proj4/:fromEpsg/:toEpsg/:x/:y/')
  expect(app.get.mock.calls[0][1]).toBe(proj4.transform)
  expect(app.get.mock.calls[1][0]).toBe('/postgis/:fromEpsg/:toEpsg/:x/:y/')
  expect(app.get.mock.calls[1][1]).toBe(postgis.transform)

  expect(app.listen).toHaveBeenCalledTimes(1)
  expect(app.listen.mock.calls[0][0]).toBe('8080')
})