// import Raven from "raven-js";

// import { notify } from "./ToastService";
// //import * as Sentry from "@sentry/browser";
// //toast.configure();
// function init() {
//   // Sentry.init({
//   //   dsn: "https://96cf26a2696d437d915a1443ef689c9b@sentry.io/1545576"
//   // });

//   Raven.config("https://96cf26a2696d437d915a1443ef689c9b@sentry.io/1545576", {
//     release: "1-0-0",
//     environment: "development-test",
//   }).install();
// }

// //this function is requred for Raven to register errorts to Sentry, so don't remove it
// function error(msg) {
//   //disable Raven + sentry error logging for the time being
//   //Raven.captureException(error);

//   console.error(msg);
//   //notify(msg, false);
// }

// function log(msg) {
//   console.log(msg);
//   //notify(msg);
// }

// function info(msg) {
//   // console.info(msg);
//   //notify(msg);
// }

// function success(msg) {
//   // console.log(msg);
//   //notify(msg, true);
// }

// export default {
//   init,
//   log,
//   info,
//   error,
//   success,
// };
