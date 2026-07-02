import React from "react";
import "./assets/styles/antd-custom.less";

import "./App.css"; //dont move it above antd css

// import "react-big-scheduler/lib/css/style.css";
// import "@ant-design/charts/dist/index.css";
import { Router, Switch } from "react-router-dom";
//import { withResizeDetector } from "react-resize-detector";
import { useEffect, useState } from "react";

import { createBrowserHistory } from "history";
import { routes } from "./Routes.js";
import PublicLayout from "./Layout/PublicLayout";
import AuthService from "./Services/AuthService";
import Context from "Store/Context";
import { LoadingPanel } from "Layout/LoadingPanels";
import TechnicianLayout from "Layout/Technician/TechnicianLayout";
import WebLayout from "Layout/Web/WebLayout";
import ManagementLayout from "Layout/Management/ManagementLayout";

const history = createBrowserHistory();

const App = ({ hideLoader }) => {
  const [layout, setLayout] = useState("full");
  /* CONTEXT STATE OBJECTS - START */
  const [user, setUser] = useState();
  const [token, setToken] = useState();
  const [userOrgs, setUserOrgs] = useState();
  const [curOrg, setCurOrg] = useState();
  const [technician, setTechnician] = useState();
  const [officer, setOfficer] = useState();

  /* CONTEXT STATE OBJECTS - END */
  useEffect(() => {
    hideLoader();
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      //cleanup;
    };
  }, []);

  const handleResize = () => {
    //console.log("APP Width", window.innerWidth);
    setLayout(window.innerWidth >= 1366 ? "full" : window.innerWidth <= 1365 && window.innerWidth >= 1024 ? "small" : window.innerWidth <= 1023 && window.innerWidth >= 768 ? "mini" : "overlay");
  };
  //setLayout(width >= 1300 ? "full" : width <= 1299 && width >= 767 ? "mini" : "overlay");
  //test
  const publicRoutes = routes.filter(r => r.auth === "public");
  const protectedRoutes = routes.filter(r => r.app && r.app.includes("website"));
  const technicianRoutes = routes.filter(r => r.app && r.app.includes("technician"));
  const managementRoutes = routes.filter(r => r.app && r.app.includes("management"));
  //const landingRoute = [{ url: "/", auth: "public", component: Landing }];
  // console.log("publicRoutes", publicRoutes);
  // console.log("protectedRoutes", protectedRoutes);
  // console.log("technicianRoutes", technicianRoutes);
  const isLoggedIn = AuthService.isLoggedIn();
  const isTechnician = AuthService.isTechnician();
  const isManagement = AuthService.isManagement();

  return (
    <>
      <Context.Provider value={{ user, setUser, token, setToken, userOrgs, setUserOrgs, curOrg, setCurOrg, technician, setTechnician, officer, setOfficer }}>
        <Router history={history} forceRefresh={true}>
          <React.Suspense fallback={<LoadingPanel />}>
            <Switch>
              {isLoggedIn && isTechnician && <TechnicianLayout layout={layout} routes={technicianRoutes} history={history} />}
              {isLoggedIn && isManagement && <ManagementLayout layout={layout} routes={managementRoutes} history={history} />}
              {isLoggedIn && !isTechnician && !isManagement && <WebLayout layout={layout} routes={protectedRoutes} history={history} />}{" "}
              <PublicLayout layout={layout} routes={publicRoutes} history={history} />
            </Switch>
          </React.Suspense>
        </Router>
      </Context.Provider>
    </>
  );
};

export default App;
