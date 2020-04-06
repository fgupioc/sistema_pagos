// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
const URL = 'localhost';
const PORT = '9443';
export const environment = {
  production: false,
  serverUrl: `https://${URL}:${PORT}/api/`,
  loginUrl: 'https://localhost:9443/oauth/token',
  signinUrl: 'https://localhost:9443/api/signin',
  clientId: 'icollect',
  clientSecret: '$2a$10$owNcRMCTn/K.1IuVvkIpJOu6GD2/yHkQBqCCLyHw5x4ubrcc9WQNa'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
