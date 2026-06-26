import React, { useState } from "react";
import { Upload, message, Progress } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import axios from "axios";
import { getAuthToken } from "Services/AuthService";
import { notify } from "Services/ToastService";

const SvApiUploader = ({
  endpoint,
  fileType,
  sizeLimit,
  multiple,
  maxCount,
  onFileUploaded,
  width,
  defaultMessage,
}) => {
  const [defaultFileList, setDefaultFileList] = useState([]);
  const [progress, setProgress] = useState(0);

  const handleOnChange = ({ file, fileList, event }) => {
    // console.log(file, fileList, event);
    //Using Hooks to update the state to the current filelist
    setDefaultFileList(fileList);
    //filelist - [{uid: "-1",url:'Some url to image'}]
  };

  const uploadImage = async (options) => {
    const { onSuccess, onError, file, onProgress } = options;

    const fmData = new FormData();
    const config = {
      headers: {
        "content-type": "multipart/form-data",
        Authorization: getAuthToken(),
      },
      onUploadProgress: (event) => {
        const percent = Math.floor((event.loaded / event.total) * 100);
        setProgress(percent);
        if (percent === 100) {
          setTimeout(() => setProgress(0), 1000);
        }
        onProgress({ percent: (event.loaded / event.total) * 100 });
      },
    };
    fmData.append("image", file);
    try {
      const res = await axios.post(`${endpoint}`, fmData, config);

      onSuccess("Ok");
      if (res && res.data) {
        let file = res.data.data.image;
        onFileUploaded({
          name: file.name,
          path: file.tempFilePath,
          size: file.size,
          mimetype: file.mimetype,
        });
      }
    } catch (err) {
      console.log("Eroor: ", err);
      notify(
        "Failed to upload picture. " + (err.response && err.response.data),
        false
      );
      onError({ err });
    }
  };

  const handleDelete = (file) => {
    onFileUploaded({ name: null, path: null, size: 0, mimetype: null });
  };

  const beforeUpload = (file) => {
    //const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    const isValidFormat = isValidFileFormat(file);
    if (!isValidFormat) {
      message.error(`You can only upload ${fileType} file!`);
    }
    const isValidSize = file.size / 1024 / 1024 < sizeLimit;

    if (!isValidSize) {
      message.error(`Uploaded file must be smaller than ${sizeLimit} MB`);
    }
    return isValidFormat && isValidSize;
  };

  const isValidFileFormat = (file) => {
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
          file.type ===
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
          file.type === "application/vnd.ms-excel" ||
          file.type ===
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
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
          file.type ===
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
          file.type === "application/vnd.ms-excel" ||
          file.type ===
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
        break;
      }
      default:
        result = false;
        break;
    }

    return result;
  };
  const uploadButton = (
    <div style={{ width: "200px" }}>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>UPLOAD</div>
      <br />
      <small>{defaultMessage || "Only JPEG, PNG, BMP images allowed"}</small>
    </div>
  );

  return (
    <div className="flex">
      <Upload
        multiple={multiple}
        accept={
          fileType === "picture"
            ? "image/*"
            : fileType === "document"
            ? "application/*"
            : "image/*;application/*"
        }
        beforeUpload={beforeUpload}
        customRequest={uploadImage}
        onChange={handleOnChange}
        onRemove={handleDelete}
        listType="picture-card"
        defaultFileList={defaultFileList}
        className="image-upload-grid"
        // onProgress={({ percent }) => {
        //   console.log("progre...", percent);
        //   if (percent === 100) {
        //     setTimeout(() => setProgress(0), 1000);
        //   }
        //   return setProgress(Math.floor(percent));
        // }}
      >
        {defaultFileList.length >= maxCount ? null : uploadButton}
      </Upload>

      {progress > 0 ? <Progress percent={progress} /> : null}
      {/*       
      <Upload
        name={multiple === true ? "files" : "file"}
        listType={fileType === "picture" ? "picture-card" : "text"}
        className="avatar-uploader"
        showUploadList={false}
        customRequest={uploadImage}
        beforeUpload={beforeUpload}
        onChange={handleChange}
      >
        {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: "100%" }} /> : uploadButton}
      </Upload> */}
    </div>
  );
};

export default SvApiUploader;
