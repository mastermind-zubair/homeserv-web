import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AuthService from "Services/AuthService";
// import { useForm, Controller } from "react-hook-form";
import { notify } from "Services/ToastService";
import { Card, Form, Input, Button, Row, Col, Result } from "antd";
import { trackPromise } from "react-promise-tracker";
import UserService from "Services/API/UserService";

const { Meta } = Card;
const ForgotPassword = (props) => {
  const [form] = Form.useForm();
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    AuthService.logout();
    return () => {
      //cleanup
    };
  }, []);

  const onFinish = async (values) => {
    //alert("form finished");
    //console.log("form", form);
    const email = values.username;
    const { status, message } = await trackPromise(
      UserService.ResetPasswrod(email)
    );

    notify(message, status);

    if (status) {
      setCompleted(true);
    }
  };

  const onFinishFailed = () => {
    //alert("Please fill form with");
    notify("Please fill the form with your registered email", false);
  };
  return (
    <>
      {!completed && (
        <Row gutter={[5, 5]} align="middle" justify="center">
          <Col xl={8} xs={22}>
            <Card
              className="card-box"
              actions={[
                // <Link to="/register">New User? Sign up please!</Link>,
                <Link to="/login">Already registered? Please Login!</Link>,
              ]}
            >
              <div className="box-pad text-center">
                <h1>Forgot your password?</h1>
                You can reset your password by following the instructions
                received on your registered email address.
              </div>
              <div className="box-pad fill-width fill-height">
                <Form
                  form={form}
                  name="forgot-password"
                  layout="vertical"
                  initialValues={{}}
                  onFinish={onFinish}
                  onFinishFailed={onFinishFailed}
                  autoComplete="off"
                  size="large"
                >
                  <Form.Item
                    label="Your Username (email)"
                    name="username"
                    rules={[
                      { required: true, message: "Please input your email!" },
                      {
                        type: "email",
                        message: "This is not a correct email address",
                      },
                    ]}
                    hasFeedback
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item>
                    <Button type="primary" htmlType="submit">
                      Reset my password
                    </Button>{" "}
                  </Form.Item>
                </Form>
              </div>
            </Card>
          </Col>
        </Row>
      )}

      {completed && (
        <Result
          status="success"
          title="Your password has been reset."
          subTitle="We have sent you a the details of new password on your email.  Please follow the instructions from that email in order to login with new password. We recommend to change your new password on you next login."
          extra={[
            <Button
              key="btn_login"
              type="primary"
              onClick={() => {
                props.history.push("/login");
                //window.location.href = "/login";
              }}
            >
              Log in now
            </Button>,
            <Button
              key="btn_home"
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
      )}
    </>
  );
};

export default ForgotPassword;
