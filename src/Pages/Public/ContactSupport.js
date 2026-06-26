import React from "react";

import { Button, Result } from "antd";

const ContactSupport = (props) => {
  return (
    <div className="fill-width fill-height box-pad">
      <Result
        status="404"
        title="Contact Support"
        subTitle="This page is under construction"
        extra={[
          <Button
            type="primary"
            onClick={() => {
              props.history.push("/login");
              //window.location.href = "/login";
            }}
          >
            Log in Again
          </Button>,
          <Button
            type="primary"
            className="bg-default"
            onClick={() => {
              props.history.push("/");
              // window.location.href = "/";
            }}
          >
            Go to Home Page
          </Button>,
        ]}
      />
    </div>
  );
};

export default ContactSupport;
