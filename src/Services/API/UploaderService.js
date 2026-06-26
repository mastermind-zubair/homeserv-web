import FormHelper from "Lib/FormHelper";
import BaseApiService from "Services/BaseApiService";
import AuthService from "Services/AuthService";
import axios from "axios";

class UploaderService extends BaseApiService {
  //#region General

  static async UploadProfilePic(data) {
    const url = `/upload/profile_pic`;
    //const postData = {};
    let form = new FormData();

    FormHelper.convertModelToFormData(data, form);

    return await super.FORM_POST(url, form);
    //return await super.GET(url, postData);
  }

  static async GetPicture(filename) {
    const url = `/img/profile_pic/${filename}`;
    const data = await super.GET(url);
    return data;
  }

  static UploadFile = async (options, onFileUploaded) => {
    console.log("options", options);
    const { onSuccess, onError, file, action } = options;
    const fmData = new FormData();
    const config = {
      headers: { "content-type": "multipart/form-data", Authorization: AuthService.getAuthToken() },
      // onUploadProgress: (event) => {
      //   const percent = Math.floor((event.loaded / event.total) * 100);
      //   setProgress(percent);
      //   if (percent === 100) {
      //     setTimeout(() => setProgress(0), 1000);
      //   }
      //   onProgress({ percent: (event.loaded / event.total) * 100 });
      // },
    };
    fmData.append("file", file);
    try {
      const res = await axios.post(`${action}`, fmData, config);
      onSuccess("Ok");
      if (res && res.data) {
        let file = res.data.data.file;

        onFileUploaded({ name: file.name, path: file.tempFilePath, size: file.size, mimetype: file.mimetype });
      }
      console.log("server res: ", res);
    } catch (err) {
      console.log("Eroor: ", err);
      
      onError({ err });
    }
  };

  static handleDelete = async (file) => {
    //onFileUploaded({ name: null, path: null, size: 0, mimetype: null });
  };

  static beforeUpload = async (file) => {
    // //const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    // const isValidFormat = isValidFileFormat(file);
    // if (!isValidFormat) {
    //   message.error(`You can only upload ${fileType} file!`);
    // }
    // const isValidSize = file.size / 1024 / 1024 < sizeLimit;
    // if (!isValidSize) {
    //   message.error(`Uploaded file must be smaller than ${sizeLimit} MB`);
    // }
    // return isValidFormat && isValidSize;
  };

  static isValidFileFormat = (file, fileType) => {
    let result = false;
    switch (fileType) {
      case "picture": {
        result =
          file.type === "image/jpeg" ||
          file.type === "image/png" ||
          file.type === "image/bmp" ||
          file.type === "image/svg" ||
          file.type === "image/gif";
        break;
      }
      case "document": {
        result =
          file.type === "application/pdf" ||
          file.type === "application/msword" ||
          file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
          file.type === "application/vnd.ms-excel" ||
          file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
        break;
      }
      case "any": {
        result =
          file.type === "image/jpeg" ||
          file.type === "image/png" ||
          file.type === "image/bmp" ||
          file.type === "image/svg" ||
          file.type === "image/gif" ||
          file.type === "application/pdf" ||
          file.type === "application/msword" ||
          file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
          file.type === "application/vnd.ms-excel" ||
          file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
        break;
      }
      default:
        result = false;
        break;
    }

    return result;
  };
  //#endregion
}

export default UploaderService;
