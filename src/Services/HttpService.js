// import Axios from "axios";
// import environment from "Environment";

// Axios.defaults.baseURL = environment.API_URL;
// // Add a request interceptor
// Axios.interceptors.request.use(function (config) {
//   //const token = configuration.defaultJwtToken;

//   const jwt = localStorage.getItem("token");

//   let authHeader = "";
//   if (jwt) authHeader = "Bearer " + jwt;
//   else authHeader = "";

//   const headers = {
//     Authorization: authHeader,
//     Accept: "application/json, text/plain, */*",
//     "Content-Type": "application/json",
//   };
//   Axios.defaults.timeout = 100000; //timeout in 10 seconds

//   //config.headers.common = headers;
//   return config;
// });
// Axios.interceptors.response.use(null, (error) => {
//   const expectedError = error.response && error.response.status >= 400 && error.response.status < 500;
//   if (!expectedError) {
//     // console.log("Logging the error", error);
//     //Logger.error("An unexpected error occurred." + error);
//     //toast.error("An unexpected error occurred." + error);
//   }
//   return Promise.reject(error);
// });

// function SetTokenInAuthHeader(token) {
//   const headers = {
//     Authorization: token,
//     Accept: "application/json, text/plain, */*",
//     "Content-Type": "application/json",
//   };
//   //Axios.defaults.headers.common = headers;
// }
// function RemoveTokenFromAuthHeader() {
//   const headers = {
//     Authorization: "",
//     Accept: "application/json, text/plain, */*",
//     "Content-Type": "application/json",
//   };
//   //Axios.defaults.headers.common = headers;
// }
// export default {
//   get: Axios.get,
//   post: Axios.post,
//   put: Axios.put,
//   delete: Axios.delete,
//   request: Axios.request,
//   SetTokenInAuthHeader,
//   RemoveTokenFromAuthHeader,
//   defaults: Axios.defaults,
// };
