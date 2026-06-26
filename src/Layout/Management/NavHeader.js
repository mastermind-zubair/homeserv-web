import { Col, Dropdown, Menu, Row, Space, Tooltip } from "antd";
import { useEffect } from "react";
import { Link, useHistory } from "react-router-dom";

import logo from "assets/images/logo.png";
import logo_icon from "assets/images/logo_icon.svg";
import { useTranslation } from "react-i18next";
import { Button } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import ManagementProfile from "../ManagementProfile";

const NavHeader = ({ layout, modules, curModule, onMenuButtonClicked }) => {
  const history = useHistory();
  const { t } = useTranslation();

  const trimLabel = label => {
    var maxLength = 15;
    if (label.length > maxLength) {
      return label.substring(0, maxLength - 3) + "...";
    }
    return label;
  };

  const onTopMenuChanged = path => {
    history.push(path);
  };

  const menu = (
    <Menu onClick={e => onTopMenuChanged(e.key)}>
      {" "}
      {modules.map(nav => {
        return (
          <Menu.Item key={`${nav.path}`}>
            <div>
              <i
                className={nav.icon}
                style={{
                  fontSize: "18px",
                }}
              >
                {" "}
              </i>{" "}
              <span
                style={{
                  float: "right",
                  marginLeft: "10px",
                }}
              >
                {" "}
                {t(nav.label_key)}{" "}
              </span>{" "}
            </div>{" "}
          </Menu.Item>
        );
      })}{" "}
    </Menu>
  );

  return (
    <>
      <Row align="bottom" justify="start" wrap>
        <Col span={24}>
          <div className="flex">
            <div
              className="logo"
              style={{
                display: "flex-inline",
                width: layout === "full" ? "225px" : "70px",
                borderRight: "solid 1px #eee",
              }}
            >
              <Link to="/management/dashboard"> {(layout === "full" && <img src={logo} />) || <img src={logo_icon} style={{ width: "65%" }} />} </Link>{" "}
            </div>{" "}
            <Space size={layout === "full" ? 8 : 2}>
              {" "}
              {layout !== "overlay" &&
                modules.map(nav => {
                  return (
                    nav.show && (
                      <Tooltip key={nav.path} placement="bottomLeft" title={t(nav.label_key)}>
                        <Link
                          key={`tp-nav-${nav.label}`}
                          to={nav.path}
                          onClick={() => {
                            onTopMenuChanged(nav.path);
                          }}
                        >
                          <div
                            style={{
                              alignItems: "center",
                              textAlign: "center",
                            }}
                            className={`${layout === "mini" ? "top-menu-small" : "top-menu"}  ${nav.path === (curModule && curModule.path) ? "top-menu-active" : ""}`}
                          >
                            <i
                              className={nav.icon}
                              style={{
                                fontSize: layout === "mini" ? "16px" : "24px",
                              }}
                            >
                              {" "}
                            </i>{" "}
                            {layout === "full" && <div> {trimLabel(t(nav.label_key))} </div>}{" "}
                          </div>{" "}
                        </Link>{" "}
                      </Tooltip>
                    )
                  );
                })}{" "}
            </Space>{" "}
            {layout === "overlay" && (
              <div
                style={{
                  marginTop: "8px",
                }}
              >
                <Space size={2}>
                  <Dropdown.Button overlay={menu}> {curModule && t(curModule.label_key)} </Dropdown.Button>
                  {/* <Tooltip title="Menu Options"> */}{" "}
                  <Button className="top-menu-button bg-success ml-2" icon={<MenuOutlined />} shape="circle" onClick={() => onMenuButtonClicked(true)} size={40} /> {/* </Tooltip> */}{" "}
                </Space>{" "}
              </div>
            )}
            <div
              className="ml-auto"
              style={{
                float: "right",
                textAlign: "right",
                marginTop: "0px",
              }}
            >
              <ManagementProfile layout={layout} onLinkClicked={onTopMenuChanged} />{" "}
            </div>{" "}
          </div>{" "}
        </Col>{" "}
      </Row>{" "}
    </>
  );
};
export default NavHeader;
