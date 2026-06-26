import { useContext, useEffect, useState } from "react";
import { Col, Popover, Row } from "antd";
import Avatar from "antd/lib/avatar/avatar";
import { Link } from "react-router-dom";

import admin_pic from "assets/images/users/admin.png";
import technician_pic from "assets/images/users/technician.png";
import AuthService from "Services/AuthService";
import { useTranslation } from "react-i18next";
import UserLanguages from "Pages/App/User/UserLanguages";
import Accounts_Billing from "Pages/App/User/Accounts_Billing";
import Modal from "antd/lib/modal/Modal";
import Context from "Store/Context";
import environment from "Environment";
const ManagementProfile = ({ layout, onLinkClicked }) => {
  const { t } = useTranslation();
  const { curOrg: organisation } = useContext(Context);
  let { user, setUser, setToken } = useContext(Context);
  const auth_user = AuthService.getCurrentUser();
  const [showUserLanguages, setShowUserLanguages] = useState(false);

  useEffect(() => {});
  const text = (
    <span>
      {auth_user && auth_user.first_name} {auth_user && auth_user.last_name}
    </span>
  );
  const APP_PREFIX = AuthService.isTechnician() ? "technician" : "app";
  const content = (
    <div>
      {/* <a
        href="javascript:void(0)"
        onClick={() => onLinkClicked(`/${APP_PREFIX}/user/change-password`)}
      >
        <div>{t("header_profile_dropdown_change_password")}</div>
      </a> */}

      <a
        href
        onClick={(e) => {
          e.preventDefault();
          setShowUserLanguages(true);
        }}
      >
        <div>{t("header_profile_dropdown_change_langauge")}</div>
      </a>
      <Link
        to="#"
        onClick={() => {
          AuthService.logout();
          setUser(null);
          setToken(null);
          window.location.href = "/session-expired";
        }}
      >
        <div style={{ color: "red" }}>{t("header_profile_dropdown_logout")}</div>
      </Link>
    </div>
  );
  return (
    <>
      <Popover placement="bottomRight" title={text} content={content} trigger="click">
        <Row style={{ cursor: "pointer" }}>
          {layout === "full" && (
            <Col className="top-menu" style={{ marginTop: "10px", maxWidth: "200px" }}>
              {t("header_profile_welcome")} <br />{" "}
              <b>
                {auth_user && auth_user.first_name} {auth_user && auth_user.last_name}
              </b>
            </Col>
          )}
          <Col>
            <Avatar
              size={(layout === "full" && 52) || 32}
              style={{ marginTop: "5px" }}
              icon={
                <img
                  src="../img/super_admin.svg"
                  // src={
                  //     `${environment.PATH_PROFILE_PIC}/${
                  //         auth_user && auth_user.profile_pic
                  //       }`
                  // }
                  style={{
                    border: "dotted 1px #aaa",
                    padding: "1px",
                    width: (layout === "full" && "52px") || "32px",
                  }}
                />
              }
            />
          </Col>
        </Row>
      </Popover>

      {showUserLanguages && (
        <Modal
          visible={showUserLanguages}
          title={`Change Language`}
          width={480}
          onCancel={() => {
            setShowUserLanguages(false);
          }}
          footer={[]}
        >
          <UserLanguages />
        </Modal>
      )}
    </>
  );
};

export default ManagementProfile;
