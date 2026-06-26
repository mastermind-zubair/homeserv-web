import React, { useState, useEffect } from "react";
import { Layout, Row, Col } from "antd";
import NavHeader from "./NavHeader";
import Navigation from "Data/NavigationManagement.js";
import { ProtectedRoute } from "Lib/ReactHelper";
import { Redirect, Route, useLocation } from "react-router-dom";
import { LoadingPanel } from "../LoadingPanels";
import Cookies from "js-cookie";
import { HandlePathChanged } from "Lib/NavigationHelper";
import environment from "Environment";

const { Header, Content, Sider } = Layout;
const APP_PREFIX = "app";

const ManagementLayout = props => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [layout, setLayout] = useState("full");
  const [modules, setModules] = useState(Navigation);
  const [curModule, setCurModule] = useState(Navigation.filter(n => n.label === "Dashboard")[0]);
  const [curPage, setCurPage] = useState();
  const [curSubPage, setCurSubPage] = useState();
  const [showSideBar, setShowSideBar] = useState(false);

  const updateNavLabelsWithTranslations = nav => {
    nav.forEach(main => {
      if (main.items !== undefined) main.items = updateNavLabelsWithTranslations(main.items);
    });
    return nav;
  };

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

  const handlePathChanged = path => {
    console.log("Path Changed", path);
    setCurModule(null);
    setCurPage(null);
    setCurSubPage(null);

    const { module, page, subPage } = HandlePathChanged(APP_PREFIX, path, Navigation, curModule, curPage, curSubPage);
    setCurModule(module);
    setCurPage(page);
    setCurSubPage(subPage);

    //history.push(path);
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
      <Layout key={location.key}>
        <Header
          style={{
            position: "fixed",
            zIndex: 999,
            width: "100%",
          }}
        >
          <NavHeader layout={layout} modules={modules} onMenuButtonClicked={setShowSideBar} curModule={curModule} />{" "}
        </Header>{" "}
        <LoadingPanel layout={layout} />{" "}
        <Content
          style={{
            padding: "24px",
            minHeight: "360px",
            marginLeft: layout === "overlay" || getFullSizedModule() ? "-5px" : "0px",
          }}
        >
          <div className={`site-main`}>
            <Row
              gutter={[0, 0]}
              align="top"
              justify="start"
              style={{
                display: "none",
                position: "relative",
                marginBottom: "15px",
              }}
            ></Row>{" "}
            <Row gutter={[0, 0]} align="top" justify="start">
              <Col span={24}>
                {" "}
                {props.routes.map((route, i) => (
                  <ProtectedRoute key={`route_${i}`} i={i} exact={true} path={`/${route.url}`} render={props => <route.component key={`rc_${i}`} {...props} />} />
                ))}{" "}
                <Route
                  exact={true}
                  path="/management/"
                  render={() => (
                    <Redirect
                      to={{
                        pathname: "/management/dashboard",
                      }}
                    />
                  )}
                />{" "}
                <Route
                  exact={true}
                  path="/"
                  render={() => (
                    <Redirect
                      to={{
                        pathname: "/management/dashboard",
                      }}
                    />
                  )}
                />{" "}
              </Col>{" "}
            </Row>
          </div>{" "}
          <div
            className="flex"
            style={{
              height: "100px",
            }}
            title={environment.NAME}
          ></div>{" "}
        </Content>{" "}
      </Layout>{" "}
    </>
  );
};

export default ManagementLayout;
