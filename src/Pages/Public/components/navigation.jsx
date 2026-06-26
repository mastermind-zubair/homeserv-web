import { NavLink, useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
export const Navigation = (props) => {
  const [small, setSmall] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", () =>
        setSmall(window.pageYOffset > 200)
      );
    }
  }, []);
  //assigning location variable
  const location = useLocation();

  //destructuring pathname from location
  const { pathname } = location;

  //Javascript split method to get the name of the path in array
  const splitLocation = pathname.split("/");

  return (
    <nav
      id="menu"
      className={`navbar navbar-default navbar-fixed-top navbar-expand-lg ${
        small ? "small" : ""
      }`}
    >
      <div className="container">
        <div className="navbar-header">
          <button
            type="button"
            className="navbar-toggle collapsed"
            data-toggle="collapse"
            data-target="#bs-example-navbar-collapse-1"
          >
            {" "}
            <span className="sr-only">Toggle navigation</span>{" "}
            <span className="icon-bar"></span>{" "}
            <span className="icon-bar"></span>{" "}
            <span className="icon-bar"></span>{" "}
          </button>
          <a
            className="navbar-brand page-scroll"
            href="https://www.servicevault.com"
          >
            <img src="/img/retina-logo.png" className="img-responsive" />
          </a>{" "}
        </div>
        {!props?.hideMenu && (
          <div
            className="collapse navbar-collapse"
            id="bs-example-navbar-collapse-1"
          >
            <ul className="nav navbar-nav navbar-right">
              <li className={splitLocation[1] === "" ? "active" : ""}>
                <NavLink
                  to="/"
                  className="page-scroll"
                  activeClassName="active"
                >
                  {" "}
                  <span>Home</span>{" "}
                </NavLink>
              </li>
              <li className={splitLocation[1] === "features" ? "active" : ""}>
                <NavLink
                  to="/features"
                  className="page-scroll"
                  activeClassName="active"
                >
                  {" "}
                  <span>Features</span>{" "}
                </NavLink>
              </li>
              <li className={splitLocation[1] === "Industries" ? "active" : ""}>
                <NavLink
                  to="/Industries"
                  className="page-scroll"
                  activeClassName="active"
                >
                  {" "}
                  <span>Industries</span>{" "}
                </NavLink>
              </li>
              <li className={splitLocation[1] === "pricing" ? "active" : ""}>
                <NavLink
                  to="/pricing"
                  className="page-scroll"
                  activeClassName="active"
                >
                  {" "}
                  <span>Pricing</span>{" "}
                </NavLink>
              </li>
              <li>
                <a
                  href="https://call-tracking.servicevault.com/"
                  target="_blank"
                  className="page-scroll"
                >
                  Call Tracking
                </a>
              </li>
              <li className={splitLocation[1] === "contact" ? "active" : ""}>
                <NavLink
                  to="/contact"
                  className="page-scroll"
                  activeClassName="active"
                >
                  {" "}
                  <span>Contact</span>{" "}
                </NavLink>
              </li>

              <li className={splitLocation[1] === "login" ? "active" : ""}>
                <NavLink to="/login" className="page-scroll">
                  {" "}
                  <span>Members Login</span>{" "}
                </NavLink>
              </li>

              {/* <li >
              <a href="" >
                <i className="fa fa-user-o fa-lg" aria-hidden="true"></i>
              </a>
            </li> */}
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};
