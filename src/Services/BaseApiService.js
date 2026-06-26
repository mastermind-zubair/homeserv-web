import _ from "lodash";
// import md5 from "md5";
// import moment from "moment";
import environment from "Environment";
import { getAuthToken } from "./AuthService";
import StatusCodes from "./StatusCodes";
//import axios from "axios";

const API_BASE_URL = environment.API.BASE_URL;
const API_DEFAULT_VERSION = environment.API.VERSION;
const API_TIMEOUT = environment.API.API_TIMEOUT;

export function ApiResponse({ data, status, statusText, headers }) {
  let defaultStatus = _.find(StatusCodes, { status: status });
  return {
    data: (data && data.data) || [],
    status: status >= 400 ? false : true,
    message:
      (data && data.message) ||
      statusText ||
      (defaultStatus && defaultStatus.statusText),
    headers,
  };
}

export function BadResponse(ex) {
  if (ex.response) {
    return ApiResponse(ex.response);
  } else {
    return ApiResponse({
      data: [],
      status: false,
      message: ex.message || "Issues with server connection",
      headers: {},
    });
  }
}

class BaseApiService {
  static async ApiRequest(webMethod, apiUrl, postData, apiVersion) {
    const axios = require("axios");
    const authToken = getAuthToken();
    try {
      let status = false;
      //const axios = require("axios").default;
      const axios_config = {
        method: webMethod === "post-form" ? "post" : webMethod,
        baseURL: API_BASE_URL,
        url: `${apiVersion || API_DEFAULT_VERSION}${apiUrl}`,
        data: postData,
        //params: postData,
        timeout: API_TIMEOUT,
        responseType: "json",
        crossDomain: true,
        contentType: "application/json",
        headers: {
          "Content-Type":
            webMethod === "post-form"
              ? "multipart/form-data"
              : "application/json",
          Authorization: `${authToken}`,
        },
      };

      const httpResponse = await axios(axios_config)
        .then((res) => {
          status = true;
          //sconsole.log("AXIOS Call Success", { ...axios_config });
          return res;
        })
        .catch((err) => {
          status = false;
          console.log("AXIOS Call Failure", err, err.config);
          return err;
        });

      //const { response } = httpResponse;
      let response = status
        ? ApiResponse(httpResponse)
        : BadResponse(httpResponse);
      return response;
    } catch (ex) {
      let response = ApiResponse({
        data: [],
        status: false,
        message: ex.message,
        headers: {},
      });
      return response;
    }
  }

  static async RawRequest(webMethod, baseUrl, apiUrl, postData, headers) {
    const axios = require("axios");
    //const authToken = getAuthToken();
    try {
      let status = false;
      //const axios = require("axios").default;
      const axios_config = {
        method:
          webMethod === "post-form" || webMethod === "post-form-urlencoded"
            ? "post"
            : webMethod,
        baseURL: baseUrl,
        url: apiUrl,
        data: postData,
        //params: postData,
        timeout: API_TIMEOUT,
        responseType: "json",
        crossDomain: true,
        contentType: "application/json",
        headers: {
          "Content-Type":
            webMethod === "post-form"
              ? "multipart/form-data"
              : webMethod === "post-form-urlencoded"
              ? "application/x-www-form-urlencoded"
              : "application/json",
          ...headers,
        },
      };

      const httpResponse = await axios(axios_config)
        .then((res) => {
          status = true;
          //sconsole.log("AXIOS Call Success", { ...axios_config });
          return res;
        })
        .catch((err) => {
          status = false;
          console.log("AXIOS Call Failure", err, err.config);
          return err;
        });

      return status ? httpResponse : BadResponse(httpResponse);
    } catch (ex) {
      return ApiResponse({
        data: [],
        status: false,
        message: ex.message,
        headers: {},
      });
    }
  }

  static async DownloadFile(webMethod, apiUrl, postData, isFile, apiVersion) {
    const axios = require("axios");
    const authToken = getAuthToken();
    try {
      let status = false;
      //const axios = require("axios").default;
      const axios_config = {
        method: webMethod,
        baseURL: API_BASE_URL,
        url: `${apiVersion || API_DEFAULT_VERSION}${apiUrl}`,
        data: postData,
        params: postData,
        timeout: API_TIMEOUT,
        responseType: isFile ? "blob" : "json",
        crossDomain: true,
        contentType: "application/json",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${authToken}`,
        },
      };

      const response = await axios(axios_config)
        .then((res) => {
          status = true;
          //extract file name from Content-Disposition header
          //var filename = ExtractFileName(res.headers["content-disposition"]);
          //console.log("File name", filename || 'default.pdf');
          //invoke 'Save As' dialog
          //saveAs(res.data, filename);

          let filename = res.headers["x-filename"];

          filename =
            (filename &&
              filename.substring(filename.indexOf("=") + 1).trim()) ||
            "downloaded_file";
          return {
            data: res.data,
            status: true,
            message: "file retrieved successfully",
            filename: filename,
          };
        })
        .catch((err) => {
          status = false;
          console.log("AXIOS Call Failure", err, err.config);
          return {
            data: [],
            status: false,
            message: "Failed to reach the server to download requested file",
          };
        });

      return response;
    } catch (ex) {
      return ApiResponse({
        data: [],
        status: false,
        message: ex.message,
        headers: {},
      });
    }
  }

  static async GET(url, postData, apiVersion) {
    return await this.ApiRequest("get", url, postData, apiVersion);
  }
  static async POST(url, postData, apiVersion) {
    return await this.ApiRequest("post", url, postData, apiVersion);
  }
  static async PUT(url, postData, apiVersion) {
    return await this.ApiRequest("put", url, postData, apiVersion);
  }
  static async DELETE(url, postData, apiVersion) {
    return await this.ApiRequest("delete", url, postData, apiVersion);
  }
  static async FORM_POST(url, postData, apiVersion) {
    return await this.ApiRequest("form-post", url, postData, apiVersion);
  }
}

export default BaseApiService;
