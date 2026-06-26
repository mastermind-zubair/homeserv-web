import SignatureCanvas from "react-signature-canvas";
import styles from "./signature.module.css";
function Signatue_Box({ sigCanvas }) {


  return (
    <>
      <SignatureCanvas
        clearOnResize={true}
        penColor="green"
        canvasProps={{ className: styles.sigPad }}
        velocityFilterWeight={0.7}
        throttle={150}
        ref={sigCanvas}
      />
    </>
  );
}

export default Signatue_Box;