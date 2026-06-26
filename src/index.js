import React from "react";
import ReactDOM from "react-dom";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpApi from "i18next-http-backend";

import "./index.css";
import "flag-icon-css/css/flag-icon.min.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
// import { usePromiseTracker } from "react-promise-tracker";
// import Spinner from "./lib/Spinner";

const loader = document.querySelector(".loader");

// if you want to show the loader when React loads data again
const showLoader = () => loader.classList.remove("loader--hide");
const hideLoader = () => loader.classList.add("loader--hide");

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .use(LanguageDetector)
  .use(HttpApi)
  .init({
    fallbackLng: "en",
    detection: {
      order: ["cookie"],
      caches: ["cookie"],
    },
    backend: {
      loadPath: "/assets/locales/{{lng}}.json",
    },
  });

// const LoadingIndicator = (props) => {
//   const { promiseInProgress } = usePromiseTracker();
//   return promiseInProgress && <Spinner isFetching="Loading in progress" />;
// };
// the setTimeout simulates the time it takes react to load, and is not part of the solution
setTimeout(
  () =>
    // the show/hide functions are passed as props
    ReactDOM.render(
      <React.StrictMode>
        <App hideLoader={hideLoader} showLoader={showLoader} />
        {/* <Spinner /> */}
      </React.StrictMode>,
      document.getElementById("root")
    ),
  2000
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
