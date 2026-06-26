import { Button, Result } from "antd";
import React from "react";

const Error404 = () => {
  return (
    <div className="fill-width fill-height box-pad">
      <Result
        status="404"
        title="Page Not Found"
        subTitle="Sorry, the page you just requested does not exist."
        extra={[
          <Button
            type="primary"
            onClick={() => {
              window.location.href = "/app/dashboard";
            }}
          >
            Back to Dashboard
          </Button>,
          <Button
            type="default"
            onClick={() => {
              window.location.href = "/";
            }}
          >
            Back to Home Page
          </Button>,
        ]}
      />
    </div>
  );
};

export default Error404;
