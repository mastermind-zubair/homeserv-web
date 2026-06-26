import React, { useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";

const PriceBook = (props) => {
  const history = useHistory();
  const location = useLocation();
  useEffect(() => {
    //history.replace("/app/price-book/all-services");
    // location.pathname = "/app/price-book/all-services";
  }, []);

  return <></>;
};

export default PriceBook;
