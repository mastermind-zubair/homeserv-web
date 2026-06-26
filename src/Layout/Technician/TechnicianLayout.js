import React, { useState, useEffect } from "react";
import { Layout, Breadcrumb, Row, Col, Drawer } from "antd";

import NavHeader from "./NavHeader";
import Navigation from "./Navigation.js";
import Text from "antd/lib/typography/Text";

import { ProtectedRoute } from "Lib/ReactHelper";
import { Redirect, Route, useLocation } from "react-router-dom";
import _ from "lodash";
import environment from "Environment";
import { LoadingPanel } from "../LoadingPanels";
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie";
import { HandlePathChanged } from "Lib/NavigationHelper";

const { Header, Content, Footer, Sider } = Layout;
const APP_PREFIX = "technician";
const TechnicianLayout = (props) => {
  const { t } = useTranslation();

  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [layout, setLayout] = useState("full");
  const [modules, setModules] = useState(Navigation);
  const [curModule, setCurModule] = useState(Navigation.filter((n) => n.label === "Dashboard")[0]);
  const [curPage, setCurPage] = useState();
  const [curSubPage, setCurSubPage] = useState();
  const [showSideBar, setShowSideBar] = useState(false);

  const updateNavLabelsWithTranslations = (nav) => {
    nav.forEach(main => {
      if (main.items !== undefined) main.items = updateNavLabelsWithTranslations(main.items);
    });
    return nav;
  };

  useEffect(async () => {
    ////set user orgs
    //reloadOrganisations();
  }, []);

  useEffect(() => {
    setLayout(props.layout);
    console.log("layout", layout);
    if (props.layout !== "full") {
      setCollapsed(true);
    }
    handlePathChanged(window.location.pathname);
  }, [props.layout]);

  useEffect(() => {
    handlePathChanged(window.location.pathname);
  }, [window.location.pathname]);

  useEffect(() => {
    setModules(updateNavLabelsWithTranslations(modules));
    handlePathChanged(window.location.pathname);
  }, [Cookies.get("i18next")]);

  const handlePathChanged = (path) => {
    console.log("Path Changed", path);
    setCurModule(null);
    setCurPage(null);
    setCurSubPage(null);

    const { module, page, subPage } = HandlePathChanged(APP_PREFIX, path, Navigation, curModule, curPage, curSubPage);
    setCurModule(module);
    setCurPage(page);
    setCurSubPage(subPage);
  };

  function getFullSizedModule() {
    const { module } = HandlePathChanged(APP_PREFIX, window.location.pathname, Navigation);
    let isFullSized = false;
    if (!module) return false;

    switch (module.label) {
      case "Dashboard":
      case "Call Tracking":
      case "Dispatching":
      case "Payments":
        isFullSized = true;
        break;
      default:
        isFullSized = false;
        break;
    }
    return isFullSized;
  }
  return (
    <>
      {/* <NavBar menu={SideBarMenu} /> */}
      <Layout key={location.key}>
        <Header style={{ position: "fixed", zIndex: 999, width: "100%" }}>
          <NavHeader layout={layout} modules={modules} onMenuButtonClicked={setShowSideBar} curModule={curModule} />
        </Header>
        <LoadingPanel layout={layout} />
        <Content
          style={{
            padding: "24px",
            minHeight: "360px",
          }}
        >
          <div className={`site-main`}>
            <Row
              gutter={[0, 0]}
              align="top"
              justify="start"
              style={{ display: "none", position: "relative", marginBottom: "15px" }}
            >
              <Col xl={12} xs={24}>
                {/* {!removeTitle && (
                  <h2>
                    {(curSubPage && t(curSubPage.label_key)) ||
                      (curPage && t(curPage.label_key)) ||
                      (curModule && t(curModule.default_page_title_key))}
                  </h2>
                )} */}
              </Col>
              <Col xl={12} xs={24}>
                {/* BREADCRUMB --> currently disabled on Danny's demand
                <Breadcrumb className={layout === "full" ? "text-right" : ""}>
                  {curModule && (
                    <Breadcrumb.Item>
                      <a
                        href="javascript:void(0)"
                        onClick={() => handlePathChanged(curModule.path)}
                        className="text-bold"
                      >
                        {t(curModule.label_key)}
                      </a>
                    </Breadcrumb.Item>
                  )}
                  {curPage && <Breadcrumb.Item>{t(curPage.label_key)}</Breadcrumb.Item>}
                  {curSubPage && <Breadcrumb.Item>{t(curSubPage.label_key)}</Breadcrumb.Item>}
                </Breadcrumb> */}
              </Col>
            </Row>
            <Row gutter={[0, 0]} align="top" justify="start">
              <Col span={24}>
                {props.routes.map((route, i) => (
                  <ProtectedRoute
                    key={`route_${i}`}
                    i={i}
                    exact={true}
                    path={`/${route.url}`}
                    render={(props) => <route.component key={`rc_${i}`} {...props} />}
                  />
                ))}
                <Route
                  exact={true}
                  path="/technician/"
                  render={() => <Redirect to={{ pathname: "/technician/dashboard" }} />}
                />
                <Route exact={true} path="/" render={() => <Redirect to={{ pathname: "/technician/dashboard" }} />} />
              </Col>
            </Row>

            {/* <Route path="/app/" render={() => <Redirect to={{ pathname: "/app/error-404" }} />} /> */}
          </div>
          <Footer style={{ textAlign: "center", position: "relative", marginTop: "200px", bottom: "0" }}>
            <Text type="secondary">
              <small>
                {t("footer_text_trademark")}  <b>{environment.NAME !== "PRODUCTION" ? `- (${environment.NAME})` :""}</b>
              </small>
            </Text>
          </Footer>
        </Content>
      </Layout>
    </>
  );
};

export default TechnicianLayout;
