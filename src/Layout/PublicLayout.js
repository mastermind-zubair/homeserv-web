import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import PublicHeader from "./PublicHeader";
import Text from "antd/lib/typography/Text";

import { Navigation } from "../Pages/Public/components/navigation";
import { Header } from "../Pages/Public/components/header";
import { Features } from "../Pages/Public/components/features";
import { FeaturesPage } from "../Pages/Public/components/featuresPage";

import { About } from "../Pages/Public/components/about";
import { Contact } from "../Pages/Public/components/contact";
import { Footer } from "../Pages/Public/components/footer";
import { IndustriesPage } from "../Pages/Public/components/IndustriesPage";
import { PricingPage } from "../Pages/Public/components/pricingPage";
import { ContactPage } from "../Pages/Public/components/contactPage";
import Login from "../Pages/Public/Login";

import environment from "Environment";
import { LoadingPanel } from "./LoadingPanels";
import { useTranslation } from "react-i18next";
import JsonData from "../Data/data.json";
import "../App.css";
import Registration from "Pages/Public/Registration";
import VerifyUser from "Pages/Public/VerifyUser";
import ForgotPassword from "Pages/Public/ForgotPassword";
import SessionExpired from "Pages/Public/SessionExpired";
import { Navigation_Basic } from "Pages/Public/components/Navigation_Basic";

//import 'font/font-awesome/css/font-awesome.min.css';
const PublicLayout = (props) => {
  const { t } = useTranslation();
  const [landingPageData, setLandingPageData] = useState({});
  const [toggle, setToggle] = useState("");
  const onMenuClick = (name) => setToggle(toggle === name ? "" : name);

  useEffect(() => {
    //AuthService.logout();
    setLandingPageData(JsonData);
    return () => {
      //cleanup
    };
  }, []);

  const handleTopMenuChanged = (nav) => {
    console.log("top menue changed");
  };

  return (
    <>
      <Navigation_Basic />
      {/* {props.routes.map((route, i) => (
        <Route
          key={`proute-${i}`}
          exact={true}
          path={`/${route.url}`}
          render={(props) => <route.component {...props} />}
        />
      ))} */}
      <Switch>
        {/* <Route path="/features">
          <Navigation />
          <FeaturesPage data={landingPageData.FeaturesPage} />
          <Footer />
        </Route>
        <Route exact path="/Industries">
          <Navigation />
          <IndustriesPage data={landingPageData.Industries} />
          <Footer />
        </Route>
        <Route exact path="/pricing">
          <Navigation />
          <PricingPage data={landingPageData.Pricing} />
          <Footer />
        </Route>
        <Route path="/contact">
          <Navigation />
          <ContactPage />
          <Footer />
        </Route> */}

        <Route path="/login">
          <Login />
        </Route>
        <Route path="/register">
          <Registration />
        </Route>

        <Route path={`/verify-user/:token`}>
          <VerifyUser />
        </Route>

        <Route path="/forgot-password">
          <ForgotPassword />
        </Route>
        <Route path="/session-expired">
          <SessionExpired />
        </Route>
        <Route path="/" exact={true}>
          <Login />
        </Route>
        {/* <Route path="/" exact={true}>
          <Navigation />
          <Header data={landingPageData.Header} />
          <Features data={landingPageData.Features} />
          <About data={landingPageData.About} />
          <Contact data={landingPageData.Contact} />
          <Footer />
        </Route> */}
      </Switch>
    </>
  );
};
export default PublicLayout;
