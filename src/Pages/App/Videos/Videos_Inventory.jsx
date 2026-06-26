import React, { useState, useEffect, useContext } from "react";

import { trackPromise } from "react-promise-tracker";

import DefaultService from "Services/API/DefaultService";
import { useTranslation } from "react-i18next";
import PageTitle from "../_Common/PageTitle";
import { Row, Space } from "antd";
import VideoBox from "./Components/VideoBox";

const Videos_Inventory = (props) => {
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
          videoTitle={t("side_menu_navigation_inventory_sub_categories")}
          videoUrl="https://www.loom.com/embed/8facbd066dda45e08e677efdc3fd0152"
          thumbnail="inventory/categories.png"
        />
        <VideoBox
          videoTitle={t("side_menu_navigation_inventory_sub_suppliers")}
          videoUrl="https://www.loom.com/embed/2134d72ce8f24cf2bf558843188fde3f"
          thumbnail="inventory/suppliers.png"
        />
        <VideoBox
          videoTitle={t("side_menu_navigation_inventory_sub_products")}
          videoUrl="https://www.loom.com/embed/eb57428bcf5b46e9bfa3a3f2297d9abc"
          thumbnail="inventory/products.png"
        />
        <VideoBox
          videoTitle={t("side_menu_navigation_inventory_sub_templates")}
          videoUrl="https://www.loom.com/embed/96bed0c9edf5449ba9ab4e9743ab539d"
          thumbnail="inventory/templates.png"
        />
        <VideoBox
          videoTitle={t("side_menu_navigation_inventory_sub_trucks")}
          videoUrl="https://www.loom.com/embed/961b6a02350541ea89c917b24c206b17"
          thumbnail="inventory/trucks.png"
        />
      </div>
    </>
  );
};

export default Videos_Inventory;
