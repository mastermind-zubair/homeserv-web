import { Button, Result } from "antd";
import environment from "Environment";
import React, { useState, useEffect, useCallback } from "react";
import { trackPromise } from "react-promise-tracker";
import { useHistory, useLocation, useParams } from "react-router-dom";
import UserService from "Services/API/UserService";
import { notify } from "Services/ToastService";

function VerifyUser(props) {
  const history = useHistory();
  const location = useLocation();
  console.log("VerifyUser", props);
  let { token } = useParams();
  const [verified, setVerified] = useState(false);
  const verifyRequest = useCallback(async () => {
    const { data, status, message } = await trackPromise(
      UserService.Verify(token)
    );
    notify(message, status);
    if (status && data) {
      setVerified(true);
    }
  }, [token]);
  useEffect(() => {
    verifyRequest();
  }, [verifyRequest]);
  return (
    <>
      <br />
      <br />
      <Result
        status={verified ? "success" : "warning"}
        title={
          verified
            ? "You have successfully verified your Service Vault account"
            : "ٰFailed to verify your registration"
        }
        subTitle={
          verified
            ? "You can now proceed to the login process with your credentials"
            : "Please contact our support about your problem"
        }
        extra={[
          verified ? (
            <Button
              type="primary"
              onClick={() => {
                history.push("/login");
              }}
            >
              Log in now
            </Button>
          ) : (
            <Button
              type="primary"
              onClick={() => {
                history.push("/contact-support");
              }}
            >
              Contact Support
            </Button>
          ),
          <Button
            type="primary"
            className="bg-default"
            onClick={() => {
              //history.location = environment.LANDING_URL;
              window.location.href = environment.LANDING_URL;
            }}
          >
            Go to Home Page
          </Button>,
        ]}
      />
      <h2></h2>
    </>
  );
}
export default VerifyUser;
