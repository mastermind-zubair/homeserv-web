import { Button, Col } from "antd";
import { useState } from "react";
import { notify } from "Services/ToastService";
import VideoPlayer from "./VideoPlayer";

const VideoBox = ({ thumbnail, videoUrl, videoTitle }) => {
  const [showVideo, setShowVideo] = useState(false);

  const handleCancel = () => {
    setShowVideo(false);
    var frm = document.getElementById("frmVideo");
    frm.src = "";
  };
  return (
    <div
      className="bg-grey grey-box"
      style={{
        width: "206px",
        maxWidth: "206px",
        height: "fit-content",
        // fontSize: "1.5rem",
        display: "inline-block",
        justifyContent: "center",
        alignItems: "flex-start",
        display: "flex",
        flexWrap: "wrap",
        flex: "1 1 10%",
        padding: "3px",
        textAlign: "center",
        top: 0,
      }}
    >
      {videoUrl && (
        <Button
          type="link"
          title={videoTitle}
          onClick={() => setShowVideo(true)}
          style={{
            width: "206px",
            height: "fit-content",
            margin: "0px",
            padding: "0px",
          }}
        >
          <img
            //src={`/assets/video-thumbs/${thumbnail}`}
            src={
              thumbnail && thumbnail.startsWith("http")
                ? thumbnail
                : `/assets/video-thumbs-default/${thumbnail}`
            }
            style={{ width: "200px" }}
          />
          <h5 className="pt-2 text-center"> {videoTitle}</h5>
        </Button>
      )}

      <VideoPlayer
        showVideo={showVideo}
        videoUrl={videoUrl}
        videoTitle={videoTitle}
        handleCancel={handleCancel}
      />
      {/* <h6 style={{ textAlign: "center" }}>Video here</h6>
      <h1 className="mt-2" style={{ textAlign: "center" }}>
        <i className="fas fa-play-circle"></i>
      </h1> */}
    </div>
  );
};

export default VideoBox;
