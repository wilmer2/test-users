export const brokerMock = {
  connect: jest.fn(),
  createChannel: jest.fn(),
  assertExchange: jest.fn(),
  assertQueue: jest.fn(),
  bindToQueue: jest.fn(),
  publish: jest.fn(),
  receiveMessage: jest.fn(),
};
