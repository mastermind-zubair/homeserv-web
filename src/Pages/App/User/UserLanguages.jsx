import i18next from "i18next";
import React from "react";
import languages from "Data/languages.json";
import { Button, Col, Dropdown, Menu, Row } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie";

const UserLanguages = (props) => {
  const { t } = useTranslation();
  const currentLanguageCode = Cookies.get("i18next") || "en";

  const currentLangauge = languages.find((v) => v.code === (currentLanguageCode || "en"));

  const handleLangaugeClick = (e) => {
    i18next.changeLanguage(e.key);
    //return false;
  };

  const menu_language = (
    <Menu onClick={handleLangaugeClick}>
      {languages.map(({ code, name, country_code }) => (
        <Menu.Item key={code}>
          <div style={{ padding: "10px" }}>
            <span className={`flag-icon flag-icon-${country_code}`}></span>
            <span style={{ marginLeft: "4px" }}>{name}</span>
          </div>
        </Menu.Item>
      ))}
    </Menu>
  );

  return (
    <>
      {menu_language && (
        <Row className="ml-3 mr-3 mb-2">
          <Col xs={8} xl={8}>
            <div className="text-primary push-left mr-auto text-smaller">{t("side_menu_dropdown_language_title")}</div>
          </Col>
          <Col xs={16} xl={16}>
            <Dropdown
              overlay={menu_language}
              className="ml-auto text-bold text-right push-right"
              width={150}
              style={{ minWidth: "150px" }}
            >
              <Button>
                {(currentLangauge && currentLangauge.name) || "English"} <DownOutlined />
              </Button>
            </Dropdown>
          </Col>
        </Row>
      )}
    </>
  );
};

export default UserLanguages;
