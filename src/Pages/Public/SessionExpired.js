import React from "react";

import { Button, Result } from "antd";
import { useTranslation } from "react-i18next";
import environment from "Environment";
import { useHistory } from "react-router-dom";

const SessionExpired = (props) => {
  const history = useHistory();
  const { t } = useTranslation();
  return (
    <div className="fill-width fill-height box-pad m-5">
      <Result
        status="403"
        title={t("session_timeout_title")}
        subTitle={t("session_timeout_text")}
        extra={[
          <Button
            key="btn_0"
            type="primary"
            onClick={() => {
              history.push("/login");
              //window.location.href = "/login";
            }}
          >
            {t("session_timeout_button_login_again")}
          </Button>,
          <Button
            key="btn_1"
            type="primary"
            className="bg-default"
            onClick={() => {
              window.location.href = environment.LANDING_URL;
            }}
          >
            {t("session_timeout_button_go_to_home_page")}
          </Button>,
        ]}
      />
    </div>
  );
};

export default SessionExpired;
