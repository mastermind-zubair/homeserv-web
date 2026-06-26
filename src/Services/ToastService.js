import { message } from "antd";

//https://sweetalert2.github.io/
export function notify(text, status, cssClass) {
  switch (status) {
    case true:
      message.success({
        content: text || "(Success)",
        className: cssClass || "text-bold",
        style: {
          //marginTop: "9vh",
          display: "flex",
          float: "right",
        },
      });
      break;
    case false:
      message.error({
        content: text || "(Error)",
        className: cssClass || "text-bold",
        style: {
          marginTop: "9vh",
          // marginBottom: "30vh",
        },
      });
      break;
    default:
      message.info({
        content: text || "(Info)",
        className: cssClass || "text-bold",
        style: {
          marginTop: "9vh",
        },
      });
      break;
  }
}

export function alertify(text, status, timer, config) {
  const Swal = require("sweetalert2");
  const swal_config = {
    confirmButtonColor: "#1c78bc",
    ...config,
  };

  if (status === true)
    Swal.fire({ icon: "success", title: "Success", text: text, timer, ...swal_config }).then(config && config.callBack);
  else if (status === false)
    Swal.fire({ icon: "error", title: "Failure", text: text, timer, ...swal_config }).then(config && config.callBack);
  else if (status === "warning")
    Swal.fire({ icon: "warning", title: "Warning", text: text, timer, ...swal_config }).then(config && config.callBack);
  else Swal.fire({ text: text, showCloseButton: true, timer }).then(config && config.callBack);
}
