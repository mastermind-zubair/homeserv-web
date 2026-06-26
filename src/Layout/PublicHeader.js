import { Col, Dropdown, Menu, Row } from "antd";
import { useEffect } from "react";
// import Context from "Store/Context";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import logo from "assets/images/logo.png";
import cookies from "js-cookie";

import logo_icon from "assets/images/logo_icon.svg";

import Navigation from "Data/Navigation.js";
import { DownOutlined, UserOutlined } from "@ant-design/icons";
import Profile from "./Profile";
import environment from "Environment";
import languages from "../Data/languages.json";

const industries = [
  "Plumbing",
  "Electrical",
  "HVAC",
  "Appliance Repair",
  "Flooring",
  "Construction",
  "Handyman",
  "Landscaping",
  "Property Maintenance",
  "Roofing",
  "Carpet Cleaning",
  "Garage Door Services",
  "Lawn Services",
  "Painting",
  "Pool and SPA Services",
  "Window Cleaning",
  "Locksmith Services",
  "Pest Control",
  "Pressure Washing",
  "Tree Care",
  "Commercial Cleaning",
  "Scaffolding",
];

const PublicHeader = ({ layout, onMenuChanged }) => {
  const currentLanguageCode = cookies.get("i18next") || "en";
  const currentLangauge = languages.find(
    (v) => v.code === ((currentLanguageCode === "app" ? "en" : currentLanguageCode) || "en")
  );
  const { t } = useTranslation();

  // const context = useContext(Context);

  useEffect(() => {
    //document.body.dir = currentLangauge.dir || 'ltr';
  }, [currentLangauge]);

  const handleButtonClick = (e) => {
    // message.info(`Selected module is ${curNavItem.label}`);
  };
  const handleMenuClick = (e) => {
    // let cm = e.key;
    // let cnav = Navigation.filter((n) => n.path === cm)[0];
    // setCurNavItem(cnav);
    // onMenuChanged(cnav);
  };
  const handleLangaugeClick = (e) => {
    i18next.changeLanguage(e.key);
  };
  const menu_features = (
    <Menu onClick={handleMenuClick}>
      {Navigation.map((nav) => {
        return (
          <Menu.Item key={`${nav.path}`}>
            <div>
              <i className={nav.icon} style={{ fontSize: "18px" }}></i>
              <span style={{ float: "right", marginLeft: "10px" }}>{nav.label}</span>
            </div>
          </Menu.Item>
        );
      })}
    </Menu>
  );
  const menu_industries = (
    <Menu onClick={handleMenuClick}>
      {industries.map((ind) => {
        return (
          <Menu.Item key={`${ind}`}>
            <div>
              {/* <i className={nav.icon} style={{ fontSize: "18px" }}></i> */}
              <span style={{ float: "left", marginLeft: "10px", marginRight: "10px" }}>{ind}</span>
            </div>
          </Menu.Item>
        );
      })}
    </Menu>
  );

  const menu_languages = (
    <Menu onClick={handleLangaugeClick}>
      {languages.map(({ code, name, country_code }) => {
        return (
          <Menu.Item key={code}>
            <div style={{ padding: "10px" }}>
              <span className={`flag-icon flag-icon-${country_code}`}></span>
              <span style={{ marginLeft: "4px" }}>{name}</span>
            </div>
          </Menu.Item>
        );
      })}
    </Menu>
  );
  return (
    <>
      <Row align="start" justify="start" wrap>
        <Col span={24}>
          {/* <Space size={layout === "full" ? 8 : 2}> */}
          <div className="flex">
            <div
              className="logo"
              style={{
                display: "flex-inline",
                width: layout === "full" ? "225px" : "70px",
                borderRight: "solid 1px #eee",
              }}
            >
              <Link to="/">
                {(layout === "full" && <img src={logo} />) || (
                  <img src={logo_icon} style={{ width: "65%" }} title={environment.NAME} />
                )}
              </Link>
            </div>

            <div style={{ marginTop: "8px", marginLeft: "15px" }}>
              <Dropdown.Button onClick={handleButtonClick} overlay={menu_features}>
                {/* {curNavItem && curNavItem.label} */}
                {t("header_menu_features")}
              </Dropdown.Button>
            </div>
            <div style={{ marginTop: "8px" }}>
              <Dropdown.Button onClick={handleButtonClick} overlay={menu_industries}>
                {t("header_menu_industries")}
              </Dropdown.Button>
            </div>
            <div style={{ marginTop: "8px" }}>
              <Dropdown.Button overlay={menu_languages}>{t("header_menu_languages")}</Dropdown.Button>
            </div>

            <div className="ml-auto" style={{ textAlign: "right", marginTop: "8px" }}>
              <Link to="/login">
                <h4> Login</h4>
              </Link>
            </div>
          </div>
        </Col>
      </Row>
    </>
  );
};
export default PublicHeader;
