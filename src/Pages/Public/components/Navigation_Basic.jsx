import { NavLink, useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import environment from "Environment";
export const Navigation_Basic = (props) => {
  const [small, setSmall] = useState(false);
  const scroll_listener = () => {
    setSmall(window.pageYOffset > 200);
  };
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("scroll",scroll_listener);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("scroll", scroll_listener);
      }
    };
  }, []);
  //assigning location variable
  const location = useLocation();

  //destructuring pathname from location
  const { pathname } = location;

  return (
    <div
      className="ml-auto mr-auto text-center push-center pt-5"
      style={{ borderBottom: "1px solid #aaa", position: "sticky" }}
    >
      <a href={environment.LANDING_URL}>
        <img src="/img/retina-logo.png" />
      </a>{" "}
    </div>
  );
};
