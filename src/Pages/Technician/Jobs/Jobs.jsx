import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Row, Col, Tabs, Typography, Space, Card, Badge, Button } from "antd";
import {
  CalendarOutlined,
  HomeOutlined,
  ClockCircleOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import moment from "moment";

import { notify } from "Services/ToastService";
import TechJobService from "Services/API/Technician/TechJobService";
import StaticAddressMap from "./Components/StaticAddressMap";
import AuthService from "Services/AuthService";
import { useTranslation } from "react-i18next";

const { TabPane } = Tabs;
const { Title, Text } = Typography;

const user = AuthService.getCurrentTechnician();
const organisation_id = user ? user.organisation_id : 0;
const TechnicianJobs = (props) => {
  const dateFormat = "ddd Do MMM YYYY";
  const jobDateFormat = "ddd Do MMM";
  const [spanValue, setSpanValue] = useState(1);
  const [dtJobs, setData] = useState(null);
  const [rangeValue, setRangeValue] = useState(moment().format(dateFormat));
  const { t } = useTranslation();

  const loadData = useCallback(async () => {
    let param_job = {
      order: [["need_at", "ASC"]],
      condition: {
        main: {
          organisation_id: organisation_id,
        },
      },
      time_span: parseInt(spanValue),
      utc_offset_minutes: moment().utcOffset(),
    };
    const { data } = await TechJobService.GetTechJobs(param_job);
    let filteredJob = data.filter(
      (objJob) => objJob.job_status.technician_status !== "NEW"
    );
    console.log("Filered Job", filteredJob);
    if (filteredJob.length > 0) {
      data.map((objJob) => {
        return objJob.id !== filteredJob[0]?.id
          ? (objJob.read_only = true)
          : (objJob.read_only = false);
      });
    }

    console.log("Updated Job", data);

    setData(data);
  }, [spanValue]);

  useEffect(() => {
    loadData();
  }, [loadData]);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSpanChange = (e) => {
    setSpanValue(e);
    var currentDate = moment();
    switch (e) {
      case "1":
        setRangeValue(currentDate.format(dateFormat));
        break;
      case "2":
        setRangeValue(
          `${currentDate
            .clone()
            .startOf("isoWeek")
            .format(dateFormat)}  to ${currentDate
              .endOf("week")
              .format(dateFormat)}`
        );
        break;
      case "3":
        setRangeValue(
          `${currentDate.startOf("month").format(dateFormat)} to ${currentDate
            .endOf("month")
            .format(dateFormat)}`
        );
        break;
      case "4":
        setRangeValue(
          `${currentDate.startOf("year").format(dateFormat)} to ${currentDate
            .endOf("year")
            .format(dateFormat)}`
        );
        break;
      default:
        setRangeValue(currentDate.format(dateFormat));
        break;
    }
  };

  const jobStatusColor = (jobStatus, tag_name, is_started) => {
    const TAG_NAME = (
      <Badge
        count={tag_name}
        style={{
          backgroundColor: "#913831",
          TextColor: "#000",
          fontWeight: "bold",
        }}
      />
    );

    if (is_started) {
      return (
        <Badge.Ribbon text="ON GOING" color="red">
          {TAG_NAME}
        </Badge.Ribbon>
      );
    }
    switch (jobStatus) {
      case "UNASSIGNED":
        return (
          <Badge.Ribbon text="UNASSIGNED" color="red">
            {TAG_NAME}
          </Badge.Ribbon>
        );
      case "NEW":
        return (
          <Badge.Ribbon text="NEW" color="red">
            {TAG_NAME}
          </Badge.Ribbon>
        );
      case "MOVING":
        return (
          <Badge.Ribbon text="MOVING" color="red">
            {TAG_NAME}
          </Badge.Ribbon>
        );
      case "ARRIVED":
        return (
          <Badge.Ribbon text="ARRIVED" color="red">
            {TAG_NAME}
          </Badge.Ribbon>
        );
      case "ESTIMATING":
        return (
          <Badge.Ribbon text="ESTIMATING" color="red">
            {TAG_NAME}
          </Badge.Ribbon>
        );
      case "ESTIMATED":
        return (
          <Badge.Ribbon text="ESTIMATED" color="red">
            {TAG_NAME}
          </Badge.Ribbon>
        );
      case "APPROVED":
        return (
          <Badge.Ribbon text="APPROVED" color="red">
            {TAG_NAME}
          </Badge.Ribbon>
        );
      case "IN PROGRESS":
        return (
          <Badge.Ribbon text="IN PROGRESS" color="red">
            {TAG_NAME}
          </Badge.Ribbon>
        );
      case "ON GOING":
        return (
          <Badge.Ribbon text="ON GOING" color="red">
            {TAG_NAME}
          </Badge.Ribbon>
        );
      case "CANCELLED":
        return (
          <Badge.Ribbon text="CANCELLED" color="red">
            {TAG_NAME}
          </Badge.Ribbon>
        );
      case "DONE":
        return (
          <Badge.Ribbon text="DONE" color="red">
            {TAG_NAME}
          </Badge.Ribbon>
        );
      case "COMPLETED":
        return (
          <Badge.Ribbon text="COMPLETED" color="red">
            {TAG_NAME}
          </Badge.Ribbon>
        );
      case "PAYMENT RECEIVED":
        return (
          <Badge.Ribbon text="PAYMENT RECEIVED" color="red">
            {TAG_NAME}
          </Badge.Ribbon>
        );
      default:
        return "No Status";
    }
  };

  const jobNextStep = (jobStatus, job) => {
    switch (jobStatus) {
      case "UNASSIGNED":
        return "";
      case "NEW":
        return "";
      case "MOVING":
        return (
          <Link
            className="ant-btn ant-btn-primary m-1"
            style={{ background: "#73A973 ", borderColor: "#4f814f" }}
            to={{
              pathname: `/technician/jobs/job-start-travel/${job.id}`,
              dtJob: job,
            }}
          >
            Start Travel
          </Link>
        );
      case "ARRIVED":
        return (
          <Link
            className="ant-btn ant-btn-primary m-1"
            style={{ background: "#73A973 ", borderColor: "#4f814f" }}
            to={{
              pathname: `/technician/jobs/job-estimate-start/${job.id}`,
              dtJob: job, // your data array of objects
            }}
          >
            {t("general_estimation")}
          </Link>
        );
      case "ESTIMATING":
        return (
          <Link
            className="ant-btn ant-btn-primary m-1"
            style={{ background: "#73A973 ", borderColor: "#4f814f" }}
            to={{
              pathname: `/technician/jobs/job-estimate-main/${job.id}`,
              dtJob: job, // your data array of objects
            }}
          >
            {t("general_estimate")}
          </Link>
        );
      case "ESTIMATED":
        return "";
      case "APPROVED":
        return (
          <Link
            className="ant-btn ant-btn-primary m-1"
            style={{ background: "#73A973 ", borderColor: "#4f814f" }}
            to={{
              pathname: `/technician/jobs/job-start-work/${job.id}`,
              dtJob: job, // your data array of objects
            }}
          >
            {t("general_start_job")}
          </Link>
        );
      case "IN PROGRESS":
        return (
          <Link
            className="ant-btn ant-btn-primary m-1"
            style={{ background: "#73A973 ", borderColor: "#4f814f" }}
            to={{
              pathname: `/technician/jobs/job-start-work/${job.id}`,
              dtJob: job, // your data array of objects
            }}
          >
            {t("general_in_progress")}
          </Link>
        );
      case "ON GOING":
        return "";
      case "CANCELLED":
        return "";
      case "DONE":
        return "";
      case "COMPLETED":
        return (
          <Link
            className="ant-btn ant-btn-primary m-1"
            style={{ background: "#73A973 ", borderColor: "#4f814f" }}
            to={{
              pathname: `/technician/jobs/job-start-work/${job.id}`,
              dtJob: job, // your data array of objects
            }}
          >
            {t("general_completed")}
          </Link>
        );
      case "PAYMENT RECEIVED":
        return (
          <Link
            className="ant-btn ant-btn-primary m-1"
            style={{ background: "#73A973 ", borderColor: "#4f814f" }}
            to={{
              pathname: `/technician/jobs/job-start-work/${job.id}`,
              dtJob: job, // your data array of objects
            }}
          >
            {t("general_completed")}
          </Link>
        );
      default:
        return "";
    }
  };

  if (dtJobs === null)
    return (
      <>
        <Row>
          <Col span={24}>
            <Title level={4}>{t("tech_app_nav_alljobs")}</Title>
          </Col>
        </Row>
        <Row>
          <Col>
            <Typography>{t("general_wait_for_loading_jobs")}</Typography>
          </Col>
        </Row>
      </>
    );
  else
    return (
      <>
        <Row>
          <Col span={24}>
            <Title level={4}>{t("tech_app_nav_alljobs")}</Title>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Tabs defaultActiveKey="1" onChange={handleSpanChange}>
              <TabPane
                tab={
                  <span>
                    <CalendarOutlined />
                    {t("general_today")}
                  </span>
                }
                key="1"
              ></TabPane>
              <TabPane
                tab={
                  <span>
                    <CalendarOutlined />
                    {t("general_this_week")}
                  </span>
                }
                key="2"
              ></TabPane>
              <TabPane
                tab={
                  <span>
                    <CalendarOutlined />
                    {t("general_this_month")}
                  </span>
                }
                key="3"
              ></TabPane>
              <TabPane
                tab={
                  <span>
                    <CalendarOutlined />
                    {t("general_this_year")}
                  </span>
                }
                key="4"
              ></TabPane>
            </Tabs>
            <Space
              span={24}
              direction="vertical"
              size="middle"
              style={{ display: "flex" }}
            >
              <Row>
                <Col span={12}>
                  <Title level={4}>{rangeValue}</Title>
                </Col>
                <Col span={12} className="text-right">
                  <Button
                    type="primary"
                    style={{ width: "50%" }}
                    onClick={async () => {
                      await loadData();
                      notify("Jobs loaded successfully", true);
                    }}
                  >
                    {t("general_refresh")}&nbsp;&nbsp;
                    <SyncOutlined />
                  </Button>
                  {/* <Title level={3}><SyncOutlined spin /></Title> */}
                </Col>
              </Row>
            </Space>
          </Col>
        </Row>
        <Row gutter={5}>
          <Col span={24}>
            {dtJobs.map((item, index) => {
              return (
                <Card
                  key={item.id}
                  gutter={[5, 5]}
                  title={<Title level={5}>{item.customer.full_name}</Title>}
                  extra={<b>Job ID: {item.id}</b>}
                >
                  <Row gutter={5}>
                    <Col span={8} align="left">
                      {item?.job_tags?.map((tag) => {
                        return (
                          <Badge
                            count={tag.name}
                            style={{
                              backgroundColor: "#666",
                              TextColor: "#000",
                              fontWeight: "bold",
                            }}
                          />
                        );
                      })}
                    </Col>
                    <Col span={16}>
                      {jobStatusColor(
                        item.job_status.technician_status,
                        item.discount_tag?.name,
                        item.is_started
                      )}
                    </Col>
                  </Row>

                  <Row></Row>
                  <br />
                  <Row>
                    <Col span={24} align="center">
                      <StaticAddressMap
                        ZoomIn="15"
                        Address={item.job_site_address.full_address}
                      ></StaticAddressMap>
                    </Col>
                  </Row>
                  <br />
                  <Row>
                    <Col span={8}>
                      <ClockCircleOutlined />
                      &nbsp;<Text strong>{t("general_date_&_time")}</Text>
                      <br />
                      {moment(item.need_at).format(jobDateFormat)}
                      <br />
                      <Text code>
                        {moment(item.need_at).format("hh:mma")}-
                        {moment(item.need_at)
                          .add(item.job_duration_mins, "minutes")
                          .format("h:mma")}
                      </Text>
                    </Col>
                    <Col span={10}>
                      <HomeOutlined />
                      &nbsp;<Text strong>{t("quick_setup_office_users_form_address")}</Text>
                      <br />
                      {item.job_site_address.full_address}
                    </Col>

                    <Col span={4} align="right">
                      <Link
                        className="ant-btn ant-btn-primary m-1"
                        to={{
                          pathname: `/technician/jobs/job-view/${item.id}`,
                          dtJob: item, // your data array of objects
                        }}
                      >
                        {t("general_view_job")}
                      </Link>
                      {item.read_only === true
                        ? ""
                        : jobNextStep(item.job_status.technician_status, item)}
                    </Col>
                  </Row>
                </Card>
              );
            })}
          </Col>
        </Row>
      </>
    );
};

export default TechnicianJobs;
