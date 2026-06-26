import React, { useState, useEffect } from "react";
import { useHistory, useParams, Link } from "react-router-dom";
import { Row, Col, Typography, Card, Button, Badge, Space } from "antd";
import { LeftOutlined } from '@ant-design/icons';
import moment from "moment";
import { notify } from "Services/ToastService";
import { trackPromise } from "react-promise-tracker";
import TechJobService from "Services/API/Technician/TechJobService";
import DefaultService from "Services/API/DefaultService";
import AuthService from "Services/AuthService";
import { useTranslation } from "react-i18next";

const { Title, Text, Paragraph } = Typography;

const jobDateFormat = "ddd Do MMM";
const user = AuthService.getCurrentTechnician();
const TECH_ID = user ? user.id : 0;

const Job_Estimate_Start = (props) => {
  let history = useHistory();
  let { jid } = useParams();
  const { dtJob } = props.location
  const [job, setJob] = useState(dtJob);
  const { t } = useTranslation();
  useEffect(() => {
    async function fetchData() {
      if (!job) {
        if (!jid) {
          return history.push("/technician/jobs/");
        }
        const { data } = await TechJobService.GetTechJob(jid);
        setJob(data);
      }
    }
    fetchData();
  }, [jid]);

  const setStatusEstimate = async () => {
    await trackPromise(
      DefaultService.PUT(`/job/f_t/estimating/${job.id}`, { field_technician_id: TECH_ID })
    );
    notify(`Job estimate started successfully`, true);
    history.push({
      pathname: `/technician/jobs/job-estimate-main/${job.id}`,
      job: job,
    });
  };
  if (job === undefined)

    return (
      <>
        <Row>
          <Col>
            <Typography>Wait for loading job detail...</Typography>
          </Col>
        </Row>
      </>
    );
  else
    return (
      <>
        <Row>
          <Col span={12}>
            <Title level={4}>{t("general_start_estimation")}</Title>
          </Col>
          <Col span={12} align="right">
            <Link
              className="ant-btn ant-btn-primary"
              to={{
                pathname: `/technician/jobs/job-start-travel/${jid}`,
                dtJob: job // your data array of objects
              }}
            ><LeftOutlined />&nbsp;&nbsp;{t("general_back")} </Link>
          </Col>
        </Row>

        <Row gutter={5}>
          <Col span={24}>
            <Card
              gutter={5}
              title={<Title level={5}>{job.customer.full_name}</Title>}
              extra={<b>{t("general_job_id")}: {job.id}</b>}
            >
              <Space span={24} direction="vertical" size="small" style={{ display: 'flex' }}>
                <Row>
                  <Col span={12}>
                    <Text strong>{t("general_scheduled_for")}</Text>
                    <br />
                    {moment(job.need_at).format(jobDateFormat)}
                    <br />
                    <Text code>
                      {moment(job.need_at).format("hh:mma")}-
                      {moment(job.need_at).add(job.job_duration_mins, "minutes").format("hh:mma")}
                    </Text>
                  </Col>

                  <Col span={12} align="left">
                    {" "}
                    <Text strong>{t("general_billing_details")}</Text>
                    <br />
                    {job.job_site_address.full_address}
                  </Col>
                </Row>
                <Row>
                  <Col span={8}>
                    {" "}
                    <Text strong>Job Tags:</Text>
                    <br />
                    {job?.job_tags?.map((tag) => {
                      return <Badge count={tag.name} style={{ backgroundColor: "#666", TextColor: "#000", fontWeight: "bold" }} />;
                    })}
                  </Col>
                  <Col span={8} align="left">
                    <Text strong>Service Type:</Text>
                    <br />
                    {job.service_type.name}
                  </Col>
                  <Col span={8} align="left">
                    <Text strong>{t("quick_setup_customer_type_grid_heading_customer_type")}:</Text>
                    <br />
                    {job.customer.customer_type.name}
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <Typography>
                      <Title level={5}>{t("general_description")}</Title>
                      <Paragraph>{job.job_details}</Paragraph>
                    </Typography>
                  </Col>
                </Row>


                <Row>
                  <Col span={24} align="center">
                    <Button type="primary" onClick={() => setStatusEstimate()} className="ant-btn-lg ant-col-24">
                      {t("general_start_estimation")}
                    </Button>
                  </Col>
                </Row>

              </Space>
            </Card>
          </Col>
        </Row>
      </>
    );
};

export default Job_Estimate_Start;
