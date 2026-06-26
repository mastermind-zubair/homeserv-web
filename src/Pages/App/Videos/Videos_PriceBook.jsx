import React, { useState, useEffect, useContext } from "react";

import { trackPromise } from "react-promise-tracker";

import DefaultService from "Services/API/DefaultService";
import { useTranslation } from "react-i18next";
import PageTitle from "../_Common/PageTitle";
import { Row, Space } from "antd";
import VideoBox from "./Components/VideoBox";

const Videos_PriceBook = (props) => {
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
        <VideoBox
          videoTitle={t(
            "side_menu_navigation_price_book_sub_billable_hourly_rate"
          )}
          videoUrl="https://www.loom.com/embed/7289b4bd0e8443d285a2f8d4ffa5323a"
          thumbnail="pricebook/billable-hourly-rate.png"
        />

        <VideoBox
          videoTitle={t("side_menu_navigation_price_book_sub_all_categories")}
          videoUrl=" https://www.loom.com/embed/8b1dc8fb62024076b99ac63d6acc31bb"
          thumbnail="pricebook/all-categories.png"
        />

        <VideoBox
          videoTitle={t("side_menu_navigation_price_book_sub_all_tasks")}
          videoUrl="https://www.loom.com/embed/614f30809b7948b982e0574ce826b0f1"
          thumbnail="pricebook/all-tasks.png"
        />

        <VideoBox
          videoTitle={t("side_menu_navigation_price_book_sub_all_utilities")}
          videoUrl="https://www.loom.com/embed/19a3b1f300df4d008326d55e0a1128c5"
          thumbnail="pricebook/all-utilities.png"
        />

        <VideoBox
          videoTitle={t(
            "side_menu_navigation_price_book_sub_material_margin_matrix"
          )}
          videoUrl="https://www.loom.com/embed/dbedbff5c2ac4cdfbf2c140ec7cf19f5"
          thumbnail="pricebook/material-margin-matrix.png"
        />

        <VideoBox
          videoTitle={t("side_menu_navigation_price_book_sub_all_services")}
          videoUrl="https://www.loom.com/embed/dec1a59a31de4d96ae4efc39c2a5d038"
          thumbnail="pricebook/all-services.png"
        />
      </div>
    </>
  );
};

export default Videos_PriceBook;
