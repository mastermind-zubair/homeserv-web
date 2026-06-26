import React, { useState } from "react";
import { Upload, message } from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import environment from "Environment";

const FileUploader = ({ fileType, uploadLimit, multiple, onFileSelect }) => {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState();
  const files = [];

  const handleChange = (info) => {
    // if (info.file.status === "uploading") {
    //   setLoading(true);
    //   return;
    // }
    // if (info.file.status === "done") {
    // if (!validate(info.file)) return;
    // Get this url from response in real world.
    getBase64(info.file.originFileObj, (imageUrl) => {
      setImageUrl(imageUrl);
      onFileSelect(imageUrl);

      setLoading(false);
    });
    // }
  };

  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  function validate(file) {
    //const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    const isValidFormat = isValidFileFormat(file);
    if (!isValidFormat) {
      message.error(`You can only upload ${fileType} file!`);
    }
    const sizeLimit = file.size / 1024 / 1024 < uploadLimit;

    if (!sizeLimit) {
      message.error(`Uploaded file must be smaller than ${uploadLimit} MB`);
    }
    return isValidFormat && sizeLimit;
  }

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
          file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
          file.type === "application/vnd.ms-excel" ||
          file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
        break;
      }
      case "any": {
        result = true;
        break;
      }
      default:
        result = false;
        break;
    }

    return result;
  };
  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );
  return (
    <Upload
      name={multiple === true ? "files" : "file"}
      listType={fileType === "picture" ? "picture-card" : "text"}
      className="avatar-uploader"
      showUploadList={false}
      onChange={handleChange}
      action={null}
      multiple={multiple}
    >
      {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: "100%" }} /> : uploadButton}
    </Upload>
  );
};

export default FileUploader;
