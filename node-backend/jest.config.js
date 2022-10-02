module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/*.spec.[jt]s?(x)', '**/*.test.[jt]s?(x)'], // 테스트 파일 위치 및 형식
  globals: {
    'ts-jest': {
      useESM: true,
    },
  },
  setupFiles: [
    '<rootDir>/src/test/helpers/testLoader.ts',
  ],
  coveragePathIgnorePatterns: ['<rootDir>/src/test'],
  moduleNameMapper: { '@/(.*)$': '<rootDir>/src/$1' },
}
