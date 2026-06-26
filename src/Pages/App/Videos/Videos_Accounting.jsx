import React, { useState, useEffect, useContext } from "react";

import { trackPromise } from "react-promise-tracker";

import DefaultService from "Services/API/DefaultService";
import { useTranslation } from "react-i18next";
import PageTitle from "../_Common/PageTitle";
import { Row, Space } from "antd";
import VideoBox from "./Components/VideoBox";

const Videos_Accounting = (props) => {
  const { t } = useTranslation();

  const ENTITY = "Dashboard";
  const ENTITY_PLURAL = "Dashboard";
  const ENTITY_API_KEY = "Videos";
  const [data, setData] = useState();
  useEffect(async () => {
    //await handleSearch();
  }, []);

  return (
    <>
      <div className="flex mb-2">
        <PageTitle suffix="Videos" />
        <h3 className="push-right text-right"></h3>
      </div>
      <div
        className="flex"
        style={{
          gap: "10px",
          height: "400px",
          flexWrap: "wrap",
          alignContent: "flex-start",
          alignItems: "center",
          justifyContent: "left",
        }}
      >
        {/* <img src="https://cdn.loom.com/sessions/thumbnails/ee91e558fac841d08a4df5f738ee1a60-1660101817391-with-play.gif" /> */}

        <VideoBox
          videoTitle={t("side_menu_navigation_reports_sub_purchase_orders")}
          videoUrl="https://www.loom.com/embed/2aff1a6bcda14ca09bce66e226893c7f"
          thumbnail="accounting/accounts-receivable.png"
        />

        <VideoBox
          videoTitle={t(
            "side_menu_navigation_accounting_sub_accounts_receivable"
          )}
          videoUrl=" https://www.loom.com/embed/04be4668c0bb41779af2fe2e58384a16"
          thumbnail="accounting/purchase-orders.png"
        />
      </div>
    </>
  );
};

export default Videos_Accounting;
