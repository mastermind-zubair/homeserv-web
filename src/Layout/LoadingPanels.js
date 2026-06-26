import { ClockLoader as Loader } from "react-spinners";
import React from "react";
import { usePromiseTracker } from "react-promise-tracker";

export const LoadingPanel = (props) => {
  const backdropStyle = {
    // position: "absolute",
    // left: 0,
    // right: 0,
    // top: 0,
    // bottom: 0,
    // background: "#eee",
    // opacity: 0.5,
    position: "fixed",
    zIndex: 1000,
    width: "100vw",
    height: "100vh",
    // backgroundColor: "rgba(28, 120, 188, 0.1)",
    backgroundColor: "rgba(200, 200, 200, 0.8)",
    backgroundSize: "cover",
    marginLeft: "-20px",
    marginTop: "64px",
  };
  const loaderStyle = {
    position: "fixed",
    top: "50%",
    left: props.layout && props.layout !== "overlay" ? "57%" : "50%",
    transform: "translate(-50%, -50%)",
  };
  const boxStyle = {
    zIndex: "99999",
    border: "solid 2px #1c78bc",
    borderRadius: "50px",
    width: "80px",
    height: "80px",
    backgroundColor: "#fff",
  };
  const { promiseInProgress } = usePromiseTracker({ area: props.area });

  return (
    promiseInProgress && (
      <div style={backdropStyle}>
        <div style={loaderStyle}>
          <div style={boxStyle}>
            <Loader color={"#1c78bc"} size={80} margin={10} speedMultiplier={2} loading="Loading Contents" />
          </div>
        </div>
      </div>
    )
  );
};

export const LoadingPanelForPopup = (props) => {
  const backdropStyle = {
    // position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    position: "absolute",
    zIndex: 1000,
    width: "100%",
    height: "100%",
    // backgroundColor: "rgba(28, 120, 188, 0.1)",
    backgroundColor: "rgba(28, 120, 188, 0.2)",
    backgroundSize: "cover",
    // marginLeft: "-20px",
    // marginTop: "40px",
  };
  const loaderStyle = {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  };
  const boxStyle = {
    zIndex: "99999",
    border: "solid 2px #1c78bc",
    borderRadius: "50px",
    width: "80px",
    height: "80px",
    backgroundColor: "#fff",
  };
  const { promiseInProgress } = usePromiseTracker({ area: props.area });

  return (
    promiseInProgress && (
      <div style={backdropStyle}>
        <div style={loaderStyle}>
          <div style={boxStyle}>
            <Loader color={"#1c78bc"} size={80} margin={10} speedMultiplier={2} loading="Loading Contents" />
          </div>
        </div>
      </div>
    )
  );
};

// export default { LoadingPanel, LoadingPanelForPopup };
