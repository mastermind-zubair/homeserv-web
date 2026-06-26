import React, { useState, useEffect, useContext } from "react";

import { trackPromise } from "react-promise-tracker";

import DefaultService from "Services/API/DefaultService";
import { useTranslation } from "react-i18next";
import PageTitle from "../_Common/PageTitle";
import { Row, Space } from "antd";
import VideoBox from "./Components/VideoBox";

const Videos_Reports = (props) => {
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
          videoTitle={t("side_menu_navigation_reports_sub_jobs")}
          videoUrl="https://www.loom.com/embed/d8f22ce93db9420e8d06064d3d1409bd"
          thumbnail="reports/jobs.png"
        />
        <VideoBox
          videoTitle={t("side_menu_navigation_reports_sub_sales")}
          videoUrl="https://www.loom.com/embed/9759fccf9f544c7ebf5d20a2a1b08fd3"
          thumbnail="reports/sales.png"
        />
        <VideoBox
          videoTitle={t("side_menu_navigation_reports_sub_quotes")}
          videoUrl="https://www.loom.com/embed/7954538549784cd198f615a0d70bf1a3"
          thumbnail="reports/quotes.png"
        />
        <VideoBox
          videoTitle={t("side_menu_navigation_reports_sub_csr")}
          videoUrl="https://www.loom.com/embed/26d0891af5b54b8aa7aeb8b73f232e28"
          thumbnail="reports/csr.png"
        />
        <VideoBox
          videoTitle={t("side_menu_navigation_reports_sub_marketing")}
          videoUrl="https://www.loom.com/embed/6f9e2119a8bf4b0aaf9b039bd49e8436"
          thumbnail="reports/marketing.png"
        />
        <VideoBox
          videoTitle={t("side_menu_navigation_reports_sub_customer_types")}
          videoUrl="https://www.loom.com/embed/b3333408fe2343fea6908eb49bab49bd"
          thumbnail="reports/customer-types.png"
        />
        <VideoBox
          videoTitle={t("side_menu_navigation_reports_sub_service_types")}
          videoUrl="https://www.loom.com/embed/27de5c29d4bb4f739ac9aae82ab61dfe"
          thumbnail="reports/service-types.png"
        />
        <VideoBox
          videoTitle={t("side_menu_navigation_reports_sub_timesheets")}
          videoUrl="https://www.loom.com/embed/f02f18c8306d4005809b1e5635827f92"
          thumbnail="reports/timesheets.png"
        />
        <VideoBox
          videoTitle={t("side_menu_navigation_reports_sub_invoices")}
          videoUrl="https://www.loom.com/embed/0675d4d6284f409fbc8e229285b0b8e8"
          thumbnail="reports/invoices.png"
        />
        <VideoBox
          videoTitle={t("side_menu_navigation_reports_sub_job_priority")}
          videoUrl="https://www.loom.com/embed/52076568f7394172aeb33bea15a1b875"
          thumbnail="reports/job-priority.png"
        />

        <VideoBox
          videoTitle={t("side_menu_navigation_reports_sub_discount_coupons")}
          videoUrl="https://www.loom.com/embed/08a6b73a0cab406e8fc4088738af8edb"
          thumbnail="reports/discount-coupons.png"
        />

        <VideoBox
          videoTitle={t("side_menu_navigation_reports_sub_purchase_orders")}
          videoUrl="https://www.loom.com/embed/99c84c4433974cac82e62daa55536825"
          thumbnail="reports/purchase-orders.png"
        />

        <VideoBox
          videoTitle={t(
            "side_menu_navigation_reports_sub_technician_performance"
          )}
          videoUrl="https://www.loom.com/embed/181945b548b94af198812b5ea48a98e4"
          thumbnail="reports/technician-performance.png"
        />

        <VideoBox
          videoTitle={t("general_all_reports_videos")}
          videoUrl="https://www.loom.com/embed/b91431b1f1d649518752af317f771f51"
          thumbnail="reports/all-reports-videos.png"
        />
      </div>
    </>
  );
};

export default Videos_Reports;
