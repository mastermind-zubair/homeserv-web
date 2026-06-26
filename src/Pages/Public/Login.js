import React, { useEffect, useState, useContext } from "react";
// import Context from "Store/Context";
import { useTranslation } from "react-i18next";
import { Link, useHistory } from "react-router-dom";
import AuthService from "Services/AuthService";
// import { useForm, Controller } from "react-hook-form";
import { notify } from "Services/ToastService";
import { Card, Form, Checkbox, Input, Button, Row, Col } from "antd";
import { trackPromise } from "react-promise-tracker";
import UserService from "Services/API/UserService";
import Context from "Store/Context";
import DefaultService from "Services/API/DefaultService";
import Navigations from "Data/Navigation";

const Login = (props) => {
  const { t } = useTranslation();
  let history = useHistory();
  let { setUser, setToken, setTechnician, setOfficer, setUserOrgs, setCurOrg } =
    useContext(Context);
  const [form] = Form.useForm();

  useEffect(() => {
    AuthService.logout();
    return () => {
      //cleanup
    };
  }, []);

  const NavigateToModule = (module_id) => {
    var module = Navigations.find((m) => +m.id === module_id);
    if (module) {
      history
        .push(module.path);
        // .then(() => {
        //   console.log("Navigation successful");
        // })
        // .catch((err) => {
        //   console.log("Navigation failed", err);
        // });
    } else {
      console.log("Module not found");
    }
  };

  const onFinish = async (values) => {
    const authUser = { username: values.username, password: values.password };
    const { data, status, message } = await trackPromise(
      UserService.Login(authUser)
    );

    if (status) {
      data.username = authUser.username;

      //No Workspace check for Super Admin

      if (!data.workspace && data.user.role.toLowerCase() !== "super_admin") {
        notify("Login failed: No internet connection", false);
        return;
      }

      AuthService.loginWithJwt(
        data.token,
        data.user,
        data.field_technician,
        data.office_user,
        data.workspace
      );

      setUser(data.user);
      setToken(data.token);
      setTechnician(data.field_technician || null);
      setOfficer(data.office_user || null);
      if (AuthService.isOfficer()) {
        const { data: org } = await trackPromise(
          DefaultService.Entity_Get(
            "QS_Organisation",
            data.office_user.organisation_id
          )
        );

        setCurOrg(org);
        setUserOrgs([org]);
      }
    }
    //const { status, message } = await AuthServicte.dummyLogin(authUser);

    notify(message, status);

    if (AuthService.isLoggedIn()) {
      //props.history.push("/app/dashboard");
      var first_module_id = data.user.user_role.rights.modules[0].id;

      if (data.field_technician) {
        //window.location.href = "/technician/dashboard";
        history.push("/technician/dashboard");
      } else if (data.user.role.toLowerCase() === "super_admin") {
        //window.location.href = "/management/dashboard";
        history.push("/management/dashboard");
      } else {
        NavigateToModule(first_module_id);
      }
    }
  };

  const onFinishFailed = () => {
    //message.error("Please fill the input form with required information");
    notify("Please fill the input form with required information", false);
  };
  return (
    <Row align="middle" justify="center">
      <Col xl={8} xs={22}>
        <Card
          className="card-box"
          actions={[
            // <Link to="/register">{t("login_button_new_user")}</Link>,
            <Link to="/forgot-password">
              {t("login_button_forgot_password")}
            </Link>,
          ]}
        >
          <div className="p-3 text-center">
            <h1>{t("login_title")}</h1>
            {t("login_message")}
          </div>
          <div className="p-3 fill-width fill-height">
            <Form
              form={form}
              name="login"
              labelCol={{}}
              wrapperCol={{}}
              layout="vertical"
              initialValues={{ remember: true, username: "", password: "" }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
              size="large"
            >
              <Form.Item
                label={t("login_label_username")}
                name="username"
                rules={[
                  {
                    required: true,
                    message: t("login_required_username_message"),
                  },
                  { type: "email", message: t("login_valid_email_message") },
                ]}
                hasFeedback
              >
                <Input placeholder="Enter UserName" />
              </Form.Item>

              <Form.Item
                label={t("login_label_password")}
                name="password"
                rules={[
                  {
                    required: true,
                    message: t("login_required_password_message"),
                  },
                ]}
                hasFeedback
              >
                <Input.Password placeholder="Enter Password" />
              </Form.Item>

              <Form.Item
                name="remember"
                valuePropName="checked"
                wrapperCol={{}}
              >
                <Checkbox>{t("login_checkbox_remember_me")}</Checkbox>
              </Form.Item>

              <Form.Item wrapperCol={{}}>
                <Button type="primary" htmlType="submit">
                  {t("login_button_login")}
                </Button>
              </Form.Item>
            </Form>
          </div>
        </Card>
      </Col>
    </Row>
  );
};

export default Login;
