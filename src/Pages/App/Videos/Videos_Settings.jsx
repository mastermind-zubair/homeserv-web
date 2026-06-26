import React, { useState, useEffect, useContext } from "react";

import { trackPromise } from "react-promise-tracker";

import DefaultService from "Services/API/DefaultService";
import { useTranslation } from "react-i18next";
import PageTitle from "../_Common/PageTitle";
import { Row, Space } from "antd";
import VideoBox from "./Components/VideoBox";

const Videos_Settings = (props) => {
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
            "side_menu_navigation_settings_sub_link_accounting_software"
          )}
          videoUrl=" https://www.loom.com/embed/bf9e74a2cbe64f8e8fb0b1811cd0a67c"
          thumbnail="setting/link-accounting-software.png"
        />
        <VideoBox
          videoTitle={t("general_link_payment_gateway")}
          videoUrl="https://www.loom.com/embed/cc0a4e2d18ab4cf88bcaafaefe272488"
          thumbnail="setting/link-payment-gateway.png"
        />
        <VideoBox
          videoTitle={t("side_menu_navigation_settings_sub_invoice_template")}
          videoUrl="https://www.loom.com/embed/6ede35a2dde94ad3991db14bf3d40da8"
          thumbnail="setting/invoice-templates.png"
        />
        <VideoBox
          videoTitle={t(
            "side_menu_navigation_settings_sub_commission_parameters"
          )}
          videoUrl="https://www.loom.com/embed/5473fe3cb0dd483fba31ed78386b972c"
          thumbnail="setting/commission-parameters.png"
        />
        <VideoBox
          videoTitle={t(
            "side_menu_navigation_settings_sub_discount_management"
          )}
          videoUrl="https://www.loom.com/embed/413cc3242d28476096a4a5d1462d3113"
          thumbnail="setting/rate-management-coupons.png"
        />
        <VideoBox
          videoTitle={t(
            "side_menu_navigation_settings_sub_discount_management_emergency_rate"
          )}
          videoUrl="https://www.loom.com/embed/6f09ad027ed64ca7b12ea34050b84c77"
          thumbnail="setting/rate-management-emergency-rate.png"
        />
        <VideoBox
          videoTitle={t(
            "side_menu_navigation_settings_sub_discount_management_special_rate_discount"
          )}
          videoUrl="https://www.loom.com/embed/bf4b56085d214a1a9a36b6a0af3c6d2b"
          thumbnail="setting/rate-management-special-rate-discount.png"
        />
        <VideoBox
          videoTitle={t(
            "side_menu_navigation_settings_sub_discount_management_add_price_increase"
          )}
          videoUrl="https://www.loom.com/embed/e10e8bef2fe541529a4c557c018d8819"
          thumbnail="setting/rate-management-add-price-increase.png"
        />
        <VideoBox
          videoTitle={t("side_menu_navigation_settings_sub_fleet_management")}
          videoUrl=" https://www.loom.com/embed/2dae41aab74b4e90b8a18f2d4c9c658d"
          thumbnail="setting/fleet-management-vehicles.png"
        />
      </div>
    </>
  );
};

export default Videos_Settings;
