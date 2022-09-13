export const mockQueryRunner = {
  connect: jest.fn(async (): Promise<any> => {}),
  startTransaction: jest.fn(async () => {}),
  commitTransaction: jest.fn(async () => {}),
  rollbackTransaction: jest.fn(async () => {}),
  release: jest.fn(async () => {}),
  manager: {
    getRepository: jest.fn(),
  },
}
