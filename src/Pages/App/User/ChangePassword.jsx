import React, { useEffect, useState } from "react";
import AuthService from "Services/AuthService";
// import { useForm, Controller } from "react-hook-form";
import { notify } from "Services/ToastService";
import { Card, Form, Input, Button, Row, Col, Result, Steps } from "antd";
import { trackPromise } from "react-promise-tracker";
import UserService from "Services/API/UserService";

const { Step } = Steps;

const ChangePassword = (props) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    return () => {
      //cleanup
    };
  }, []);

  const steps = [
    {
      title: "Verification",
      content: <OldPassword onStepCompleted={() => setCurrent(1)} />,
    },
    {
      title: "Change password",
      content: <NewPassword onStepCompleted={() => setCurrent(2)} />,
    },
    {
      title: "Completed",
      content: <SuccessContents {...props} />,
    },
  ];

  return (
    <>
      <Steps current={current} responsive={true}>
        {steps.map((item) => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>
      <div className="steps-content">{steps[current].content}</div>
    </>
  );
};

export default ChangePassword;

const OldPassword = ({ onStepCompleted }) => {
  const [form] = Form.useForm();
  const [username, setUsername] = useState(AuthService.getCurrentUser().username);

  const onFinish = async (values) => {
    const authUser = { username, password: values.password };
    const { status } = await trackPromise(UserService.Login(authUser));

    if (status) {
      onStepCompleted();
    } else {
      notify("Your provided existing password is incorrect", false);
    }
  };

  const onFinishFailed = () => {
    //alert("Please fill form with");
    notify("Please provide required information", false);
  };
  return (
    <>
      <Row gutter={[5, 5]} align="middle" justify="center">
        <Col xl={8} xs={24}>
          <Card className="card-box">
            <div className="p-2 text-center">
              <h3>Please provide your existing password</h3>
            </div>
            <div className="fill-width fill-height p-2">
              <Form
                form={form}
                name="old-password"
                layout="vertical"
                labelCol={{}}
                wrapperCol={{}}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
                size="large"
              >
                <Form.Item label="Your Username" name="username">
                  <div className="text-bold text-primary">{AuthService.getCurrentUser().username}</div>
                </Form.Item>
                <Form.Item
                  label="Your current password"
                  name="password"
                  rules={[{ required: true, message: "Please input your existing password!" }]}
                  hasFeedback
                >
                  <Input.Password />
                </Form.Item>

                <Form.Item wrapperCol={{}}>
                  <Button type="primary" htmlType="submit">
                    Next
                  </Button>{" "}
                </Form.Item>
              </Form>
            </div>
          </Card>
        </Col>
      </Row>
    </>
  );
};

const NewPassword = ({ onStepCompleted }) => {
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    const { status } = await trackPromise(UserService.ChangePassword(values.password));

    if (status) {
      onStepCompleted();
    } else {
      notify("Failed to change your password at this time. Please try again or contact support", false);
    }
  };

  const onFinishFailed = () => {
    notify("Please provide required information", false);
  };
  return (
    <>
      <Row gutter={[5, 5]} align="middle" justify="center">
        <Col xl={8} xs={24}>
          <Card className="card-box">
            <div className="p-3 text-center">
              <h3>Please set a new password</h3>
            </div>
            <div className="p-3 fill-width fill-height">
              <Form
                form={form}
                name="old-password"
                layout="vertical"
                labelCol={{}}
                wrapperCol={{}}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
                size="large"
              >
                <Form.Item
                  label="Your new password"
                  name="password"
                  rules={[{ required: true, message: "Please input your new password!" }]}
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
                        return Promise.reject(new Error("The confirmed password should match your new password!"));
                      },
                    }),
                  ]}
                  hasFeedback
                >
                  <Input.Password />
                </Form.Item>
                <Form.Item wrapperCol={{}}>
                  <Button type="primary" htmlType="submit">
                    Next
                  </Button>{" "}
                </Form.Item>
              </Form>
            </div>
          </Card>
        </Col>
      </Row>
    </>
  );
};
function SuccessContents(props) {
  return (
    <Result
      status="success"
      title="Credentials Updated"
      subTitle="You have successfully changed your password"
      extra={[
        <Button
          type="primary"
          onClick={() => {
            props.history.push("/app/dashboard");
            //window.location.href = "/login";
          }}
        >
          Go to Dashboard
        </Button>,
      ]}
    />
  );
}
