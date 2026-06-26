import React, { useState, useEffect, useContext } from "react";

import { trackPromise } from "react-promise-tracker";

import DefaultService from "Services/API/DefaultService";
import { useTranslation } from "react-i18next";
import PageTitle from "../_Common/PageTitle";
import { Row, Space } from "antd";
import VideoBox from "./Components/VideoBox";

const Videos_QuickSetup = (props) => {
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
          videoTitle={t("side_menu_dropdown_organization_title")}
          videoUrl="https://www.loom.com/embed/ee91e558fac841d08a4df5f738ee1a60"
          thumbnail="quick-setup/organisation.png"
        />
        <VideoBox
          videoTitle={t("side_menu_navigation_quick_setup_sub_industries")}
          videoUrl="https://www.loom.com/embed/782bbf0bbe5543e9a2503238efb572c2"
          thumbnail="quick-setup/industries.png"
        />
        <VideoBox
          videoTitle={t("side_menu_navigation_quick_setup_sub_job_tags")}
          videoUrl="https://www.loom.com/embed/cc6e121809a84f9cb87c81a5c8b92a99"
          thumbnail="quick-setup/job-tags.png"
        />
        <VideoBox
          videoTitle={t("side_menu_navigation_quick_setup_sub_job_priorities")}
          videoUrl="https://www.loom.com/embed/ff6bafe94a024079b2d9b683ae51554d"
          thumbnail="quick-setup/job-priorities.png"
        />
        <VideoBox
          videoTitle={t("side_menu_navigation_quick_setup_sub_discount_tags")}
          videoUrl="https://www.loom.com/embed/924cf65a86444d2fa312f5e2f45f25a7"
          thumbnail="quick-setup/discount-tags.png"
        />
        <VideoBox
          videoTitle={t("side_menu_navigation_quick_setup_sub_service_types")}
          videoUrl=" https://www.loom.com/embed/bd3eca1094f44684bcf8e72ce33220e5"
          thumbnail="quick-setup/service-type.png"
        />
        <VideoBox
          videoTitle={t(
            "side_menu_navigation_quick_setup_sub_technician_roles"
          )}
          videoUrl="https://www.loom.com/embed/3471e37f8a4340f6bca5104a3553a429"
          thumbnail="quick-setup/technician-roles.png"
        />
        <VideoBox
          videoTitle={t("side_menu_navigation_quick_setup_sub_customer_types")}
          videoUrl="https://www.loom.com/embed/f3000569df7143e0a183594a14d8feda"
          thumbnail="quick-setup/customer-types.png"
        />
        <VideoBox
          videoTitle={t("side_menu_navigation_quick_setup_sub_office_users")}
          videoUrl="https://www.loom.com/embed/83370c9639734f77ad16ff840dde78cc"
          thumbnail="quick-setup/office-users.png"
        />
        <VideoBox
          videoTitle={t(
            "side_menu_navigation_quick_setup_sub_field_technicians"
          )}
          videoUrl="https://www.loom.com/embed/9dd020de3e9f4a1cb52b4e3119841dd1"
          thumbnail="quick-setup/field-technicians.png"
        />
        <VideoBox
          videoTitle={t("side_menu_navigation_quick_setup_sub_project_teams")}
          videoUrl="https://www.loom.com/embed/e278abe0cadb436ab944b18e3a22e2a5"
          thumbnail="quick-setup/project-teams.png"
        />
      </div>
    </>
  );
};

export default Videos_QuickSetup;
