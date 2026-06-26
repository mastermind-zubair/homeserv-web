import React, { useState, useEffect, useContext } from "react";

import { trackPromise } from "react-promise-tracker";

import DefaultService from "Services/API/DefaultService";
import { useTranslation } from "react-i18next";
import PageTitle from "../_Common/PageTitle";
import { Row, Space } from "antd";
import VideoBox from "./Components/VideoBox";

const Videos_TechnicianApp = (props) => {
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
          videoTitle="All Technician app videos"
          videoUrl="https://www.loom.com/embed/93c914ac151441129d0558bb7bdafa30"
          thumbnail="technician-app/material-used.png"
        />

        <VideoBox
          videoTitle="Dashboard "
          videoUrl="https://www.loom.com/embed/5feac9f453d24e759a0f64ef847477ed"
          thumbnail="technician-app/dashboard.png"
        />

        <VideoBox
          videoTitle="Timesheet "
          videoUrl="https://www.loom.com/embed/f80dc9c10c9f448c92d4f8a49d973849"
          thumbnail="technician-app/timesheet.png"
        />

        <VideoBox
          videoTitle="All Jobs / View Job Page "
          videoUrl="https://www.loom.com/embed/ceadd1ed512345bbb02b169693013e15"
          thumbnail="technician-app/jobs.png"
        />

        <VideoBox
          videoTitle="Start Travel Page "
          videoUrl="https://www.loom.com/embed/b8a7a832db094efaa454e9b914630187"
          thumbnail="technician-app/start-travel-page.png"
        />

        <VideoBox
          videoTitle="Estimate Page "
          videoUrl="https://www.loom.com/embed/56abd704c4ec439a99222ef20ded7a80"
          thumbnail="technician-app/estimate-page.png"
        />
        <VideoBox
          videoTitle="Approve Estimate Page "
          videoUrl="https://www.loom.com/embed/f52ac6b8001f463fb45a389bc870775f"
          thumbnail="technician-app/approved-estimate-page.png"
        />
      </div>
    </>
  );
};

export default Videos_TechnicianApp;
