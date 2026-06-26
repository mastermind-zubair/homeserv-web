import { Modal } from "antd";
import { CloseButton, FormButtons } from "Components/Common/FormButtons";
import { useEffect, useState } from "react";
import { notify } from "Services/ToastService";

const VideoPlayer = ({ showVideo, videoUrl, videoTitle, handleCancel }) => {
  const [url, setUrl] = useState(videoUrl);

  useEffect(() => {
    setUrl((showVideo && videoUrl) || "");
  }, [showVideo]);

  return (
    <Modal
      title={videoTitle}
      visible={showVideo}
      width={768}
      // onOk={handleSave}
      onCancel={handleCancel}
      destroyOnClose={true}
      footer={[<CloseButton {...{ handleCancel }} />]}
    >
      <div style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}>
        <iframe
          id="frmVideo"
          src={url}
          frameBorder="0"
          webkitallowfullscreen
          mozallowfullscreen
          allowFullScreen={true}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
        ></iframe>
      </div>
    </Modal>
  );
};

export default VideoPlayer;
