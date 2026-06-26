import React, { useEffect, useCallback, useState } from "react";
import { Tabs } from "antd";
import DefaultService from "Services/API/DefaultService";
import JobCardSummary from "./JobCardSummary";
import JobCardMaterial from "./JobCardMaterial";
import JobCardInvoices from "./JobCardInvoices";
import JobCardQuotes from "./JobCardQuotes";
import JobCardMedia from "./JobCardMedia";
import JobCardTimeline from "./JobCardTimeline";
import JobCardNotes from "./JobCardNotes";
import { useTranslation } from "react-i18next";
import JobCardSigns from "./JobCardSigns";
import JobCardComm from "./JobCardComm";
import JobCardJSA from "./JobCardJSA";

const { TabPane } = Tabs;

function JobCard({ selectedJobId, dateFormat }) {
  const ENTITY_API_KEY = "JOB";
  const [job, setJob] = useState(null);

  const queryJob = useCallback(async (job_id) => {
    let { data, status } = await DefaultService.Entity_Get(
      ENTITY_API_KEY,
      job_id
    );

    if (status) setJob(data);
  }, []);

  useEffect(() => {
    if (
      selectedJobId === null ||
      selectedJobId === undefined ||
      isNaN(selectedJobId)
    )
      return;
    queryJob(selectedJobId);
  }, [selectedJobId, queryJob]);

  const handleJobMessageChange = (item) => {
    setJob({ ...job, messages: [...job.messages, item] });
  };
  const handleJobComplaintChange = (item) => {
    setJob({ ...job, complaints: [...job.complaints, item] });
  };
  const { t } = useTranslation();
  return (
    <>
      <Tabs>
        <TabPane tab={t("dashboard_job_search_job_card")} key="1">
          <JobCardSummary job={job} dateFormat={dateFormat} />
        </TabPane>

        <TabPane tab={t("dashboard_job_search_materials")} key="2">
          <JobCardMaterial job={job} />
        </TabPane>

        <TabPane tab={t("dashboard_job_search_invoice")} key="3">
          <JobCardInvoices job={job} />
        </TabPane>

        <TabPane tab={t("side_menu_navigation_reports_sub_quotes")} key="4">
          <JobCardQuotes job={job} />
        </TabPane>

        <TabPane tab={t("dashboard_job_search_media")} key="5">
          <JobCardMedia job={job} />
        </TabPane>
        <TabPane tab={t("dashboard_job_search_notes")} key="6">
          <JobCardNotes job={job} />
          <JobCardJSA job={job} />
        </TabPane>
        <TabPane tab={t("dashboard_job_search_signature")} key="7">
          <JobCardSigns job={job} />
        </TabPane>
        <TabPane tab={t("dashboard_job_search_communication")} key="8">
          <JobCardComm
            job={job}
            handleJobMessageChange={handleJobMessageChange}
            handleJobComplaintChange={handleJobComplaintChange}
          />
        </TabPane>
        <TabPane tab={t("dashboard_job_search_timeline")} key="9">
          <JobCardTimeline job={job} />
        </TabPane>
      </Tabs>
    </>
  );
}

export default JobCard;
