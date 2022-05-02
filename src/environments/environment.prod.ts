const http = 'http';
const URL = '192.168.1.72';
const PORT = '8080/icollectApi';
export const environment = {
  production: true,
  serverUrl: `${http}://${URL}:${PORT}/api/`,
  loginUrl: `${http}://${URL}:${PORT}/oauth/token`,
  signinUrl: `${http}://${URL}:${PORT}/api/signin`,
  clientId: 'icollect',
  clientSecret: '$2a$10$owNcRMCTn/K.1IuVvkIpJOu6GD2/yHkQBqCCLyHw5x4ubrcc9WQNa'
};
