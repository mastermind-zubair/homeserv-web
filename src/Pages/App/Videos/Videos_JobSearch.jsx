import React, { useState, useEffect, useContext } from "react";

import { trackPromise } from "react-promise-tracker";

import DefaultService from "Services/API/DefaultService";
import { useTranslation } from "react-i18next";
import PageTitle from "../_Common/PageTitle";
import { Row, Space } from "antd";
import VideoBox from "./Components/VideoBox";

const Videos_JobSearch = (props) => {
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
          videoTitle={t("side_menu_navigation_job_search")}
          videoUrl="https://www.loom.com/embed/64effc1e0e5c4f36919e5749f38e24bd"
          thumbnail="job-search/job-search.png"
        />
        <VideoBox
          videoTitle={t("general_job_card")}
          videoUrl="  https://www.loom.com/embed/57ddb86be1394642b88535bf6c18b2be"
          thumbnail="job-search/job-card.png"
        />
      </div>
    </>
  );
};

export default Videos_JobSearch;
