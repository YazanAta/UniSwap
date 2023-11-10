// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  stripe_token: 'STRIPE_TOKEN',
  paypal_token: 'PAYPAL_TOKEN',

  firebaseConfig : {
    apiKey: "AIzaSyAezIxumoLzsyflYB_TfizYbo-pjjZZPD8",
    authDomain: "uniswap-e2525.firebaseapp.com",
    projectId: "uniswap-e2525",
    storageBucket: "uniswap-e2525.appspot.com",
    messagingSenderId: "835412634471",
    appId: "1:835412634471:web:cb1ed0da066bbb34bf1dc2"
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
