import React, { useState, useEffect } from "react";
import { Layout, Row, Col, Drawer } from "antd";

import NavHeader from "./NavHeader";
import Navigation from "Data/Navigation.js";
import SideMenu from "./SideMenu";
import { ProtectedRoute } from "Lib/ReactHelper";
import { Redirect, Route, useLocation } from "react-router-dom";
import { LoadingPanel } from "../LoadingPanels";
import Cookies from "js-cookie";
import { HandlePathChanged } from "Lib/NavigationHelper";
import environment from "Environment";
import AuthService from "Services/AuthService";

const { Header, Content, Sider } = Layout;
const APP_PREFIX = "app";
const filterModules = (availModules = [], userModules = []) => {
  const safeUserModules = Array.isArray(userModules) ? userModules : [];
  if (safeUserModules.length === 0) {
    return availModules;
  }

  const module_ids = safeUserModules
    .map((r) => +r.id)
    .filter((id) => Number.isFinite(id));
  return availModules.filter((m) => module_ids.includes(+m.id));
};

const WebLayout = (props) => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [layout, setLayout] = useState("full");
  const [curModule, setCurModule] = useState(
    Navigation.filter((n) => n.label === "Dashboard")[0]
  );
  const [curPage, setCurPage] = useState();
  const [curSubPage, setCurSubPage] = useState();
  const [showSideBar, setShowSideBar] = useState(false);
  const user = AuthService.getCurrentUser() || {};

  var filtered_modules = filterModules(
    Navigation,
    user?.user_role?.rights?.modules
  );

  const [modules, setModules] = useState(filtered_modules);

  const updateNavLabelsWithTranslations = (nav) => {
    nav.forEach((main) => {
      if (main.items !== undefined)
        main.items = updateNavLabelsWithTranslations(main.items);
    });

    let mds = nav;
    let subscription = AuthService.getCurrentSubscription();
    if (subscription?.license?.name === "SV LITE") {
      mds = nav.filter(
        (m) => m.label !== "Price Book" && m.label !== "Inventory"
      );
    }
    return mds;
  };

  useEffect(() => {
    setLayout(props.layout);
    if (props.layout !== "full") {
      setCollapsed(true);
    }
    // handlePathChanged(window.location.pathname);
  }, [props.layout]);

  useEffect(() => {
    handlePathChanged(window.location.pathname);
  }, [window.location.pathname]);

  useEffect(() => {
    setModules(updateNavLabelsWithTranslations(modules));
    // handlePathChanged(window.location.pathname);
  }, [Cookies.get("i18next")]);

  const handlePathChanged = (path) => {
    setCurModule(null);
    setCurPage(null);
    setCurSubPage(null);

    const { module, page, subPage } = HandlePathChanged(
      APP_PREFIX,
      path,
      Navigation,
      curModule,
      curPage,
      curSubPage
    );
    setCurModule(module);
    setCurPage(page);
    setCurSubPage(subPage);

    //history.push(path);
  };

  function getFullSizedModule() {
    const { module } = HandlePathChanged(
      APP_PREFIX,
      window.location.pathname,
      Navigation
    );
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
        <Drawer
          title="Menu Options"
          placement="left"
          onClose={() => setShowSideBar(false)}
          visible={showSideBar}
        >
          <SideMenu
            topNav={curModule}
            collapsed={false}
            onMenuChanged={(e) => {
              handlePathChanged(e);
              setShowSideBar(false);
            }}
          />
        </Drawer>
        <Sider
          menu={null}
          className="sidebar"
          breakpoint={"md"}
          theme="light"
          collapsedWidth={0}
          trigger={null}
          width={240}
          style={{
            zIndex: 1,
            height: "100vh",
            position: "fixed",
            left: 0,
            borderRight: "dotted 1px #aaa",
            marginTop: "64px",
            paddingTop: "10px",
            display: `${getFullSizedModule() ? "none" : ""}`,
          }}
        >
          <SideMenu
            topNav={curModule}
            collapsed={collapsed}
            onMenuChanged={handlePathChanged}
          />
        </Sider>

        <Header style={{ position: "fixed", zIndex: 999, width: "100%" }}>
          <NavHeader
            layout={layout}
            modules={modules}
            onMenuButtonClicked={setShowSideBar}
            curModule={curModule}
          />
        </Header>
        <LoadingPanel layout={layout} />
        <Content
          className={`app-content ${
            layout === "overlay" || getFullSizedModule()
              ? "app-content-full"
              : "app-content-with-sidebar"
          }`}
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
                    render={(props) => (
                      <route.component key={`rc_${i}`} {...props} />
                    )}
                  />
                ))}
                <Route
                  exact={true}
                  path="/app/"
                  render={() => (
                    <Redirect to={{ pathname: "/app/dashboard" }} />
                  )}
                />
                <Route
                  exact={true}
                  path="/"
                  render={() => (
                    <Redirect to={{ pathname: "/app/dashboard" }} />
                  )}
                />
              </Col>
            </Row>

            {/* <Route path="/app/" render={() => <Redirect to={{ pathname: "/app/error-404" }} />} /> */}
          </div>
          {/* <Footer style={{ textAlign: "center", position: "relative", marginTop: "200px", bottom: "0" }}>
            <Text type="secondary">
              <small>
                {t("footer_text_trademark")} - <b>({environment.NAME})</b>
              </small>
            </Text>
          </Footer> */}
          <div
            className="flex"
            style={{ height: "100px" }}
            title={environment.NAME}
          ></div>
        </Content>
      </Layout>
    </>
  );
};

export default WebLayout;
