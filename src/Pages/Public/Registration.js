import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AuthService from "Services/AuthService";
// import { useForm, Controller } from "react-hook-form";
import { notify } from "Services/ToastService";
import { Card, Form, Input, Button, Row, Col, Result } from "antd";
import { trackPromise } from "react-promise-tracker";
import UserService from "Services/API/UserService";

const Registration = (props) => {
  const [form] = Form.useForm();
  const [completed, setCompleted] = useState(false);
  useEffect(() => {
    AuthService.logout();
    return () => {
      //cleanup
    };
  }, []);

  const onFinish = async (values) => {
    debugger;
    //alert("form finished");
    //console.log("form", form);
    console.log("form", values);

    const authUser = {
      username: values.email,
      password: values.password,
      first_name: values.first_name,
      last_name: values.last_name,
      role: "owner",
    };

    console.log("user", authUser);
    const { status, message } = await trackPromise(UserService.Register(authUser));
    notify(message, status);

    if (status) {
      setCompleted(true);
    }
  };

  const onFinishFailed = () => {
    notify("To complete registration process, please fix all the errors on the input form.", false);
  };
  return (
    <>
      {!completed && (
        <Row gutter={[5, 5]} align="middle" justify="center">
          <Col xl={8} xs={22}>
            <Card className="card-box" actions={[<Link to="/login">Already registered? Please Login!</Link>]}>
              <div className="box-pad text-center">
                <h1>New Registration</h1>
                Please provide credentials and other account information to start a new account.
              </div>
              <div className="fill-width fill-height box-pad">
                <Form
                  form={form}
                  name="registration"
                  layout="vertical"
                  initialValues={{}}
                  onFinish={onFinish}
                  onFinishFailed={onFinishFailed}
                  autoComplete="off"
                  size="large"
                >
                  <Form.Item label="Name" style={{ marginBottom: 0 }}>
                    <Form.Item
                      name="first_name"
                      rules={[{ required: true, message: "First name is required" }]}
                      style={{ display: "inline-block", width: "calc(50% - 1px)" }}
                    >
                      <Input placeholder="First Name" />
                    </Form.Item>
                    <Form.Item
                      name="last_name"
                      rules={[{ required: true, message: "Last name is required" }]}
                      style={{ display: "inline-block", width: "calc(50% - 1px)", margin: "0 1px" }}
                    >
                      <Input placeholder="Last Name" />
                    </Form.Item>
                  </Form.Item>
                  <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                      { required: true, message: "Please input your email!" },
                      { type: "email", message: "This is not a correct email address" },
                    ]}
                    hasFeedback
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: "Please input your password!" }]}
                    hasFeedback
                  >
                    <Input.Password />
                  </Form.Item>

                  <Form.Item
                    label="Confirm Password"
                    name="confirmed_password"
                    dependencies={["password"]}
                    hasFeedback
                    rules={[
                      { required: true, message: "Please confirm your password!" },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue("password") === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(new Error("The confirmed password should match your password!"));
                        },
                      }),
                    ]}
                    hasFeedback
                  >
                    <Input.Password />
                  </Form.Item>
                  {/* <Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 6 }}>
                <Checkbox>Remember me</Checkbox>
              </Form.Item> */}

                  <Form.Item wrapperCol={{}}>
                    <Button type="primary" htmlType="submit" className="btn">
                      Register Now
                    </Button>{" "}
                  </Form.Item>
                </Form>
              </div>
            </Card>
          </Col>
        </Row>
      )}
      {completed && (
        <div className="fill-width fill-height box-pad">
          <br />
          <br />
          <br />
          <Result
            status="success"
            title="Thanks for completing registration"
            subTitle="A confirmation email has been sent to your email address. Please follow instructions on that email to verify &amp; activate your account."
            extra={[
              <Button
                type="primary"
                onClick={() => {
                  props.history.push("/login");
                  //window.location.href = "/login";
                }}
              >
                Already verified? Log in now
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
      )}
    </>
  );
};

export default Registration;
