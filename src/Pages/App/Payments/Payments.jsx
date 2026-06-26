import React, { useEffect, useState } from "react";
import { Image } from "antd";
import environment from "Environment";

const Payments = (props) => {
  const [url, setUrl] = useState();
  useEffect(() => {
    setUrl(environment.PAYMENT_PORTAL_URL);
  }, []);

  return (
    <>
      <div class="ant-col ant-col-24" style={{ textAlign: "center" }}>
        {/* <a
        href="https://dashboard.stripe.com/login"
        target="_blank"
        rel="noreferrer"
          style={{ textAlign: "center" }}
      >
          <Image src="/img/stripe_login.png" preview={false} />
      </a> */}

        <iframe
          id="frmSportsbook"
          style={{ width: "100%", height: "1000px", overflow: "auto", border: "none" }}
          src={url}
        ></iframe>
      </div>
    </>
  );
};

export default Payments;
