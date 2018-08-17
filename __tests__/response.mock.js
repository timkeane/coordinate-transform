const mockResponse = {
  status: jest.fn(),
  json: jest.fn()
}
mockResponse.reset = () => {
  mockResponse.status.mockReset()
  mockResponse.json.mockReset()
  mockResponse.status.mockImplementation(() => {
    return mockResponse
  })
}
module.exports = mockResponse