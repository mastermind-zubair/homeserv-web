
import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { useHistory, useParams } from 'react-router-dom';
import { Row, Col, Typography, Card, Badge, Button, Space } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import moment from "moment";
import { notify } from "Services/ToastService";
import { trackPromise } from "react-promise-tracker";
import StaticAddressMap from "./Components/StaticAddressMap";
import TechJobService from "Services/API/Technician/TechJobService";
import DefaultService from "Services/API/DefaultService";
import { useTranslation } from "react-i18next";


const { Title, Text, Paragraph } = Typography;

const jobDateFormat = "ddd Do MMM";
const Job_View = (props) => {

  let history = useHistory();
  let { jid } = useParams();
  const { dtJob } = props.location
  const [job, setJob] = useState(dtJob);
  const { t } = useTranslation();
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

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
  }, []);

  const setStatusMoving = async () => {

    await trackPromise(
      DefaultService.PUT(`/job/f_t/moving/${job.id}`)
    );
    notify(`Technician start moving`, true);

    history.push({
      pathname: `/technician/jobs/job-start-travel/${job.id}`,
      dtJob: job
    });
  };

  const jobStatusColor = (jobStatus, tag_name) => {
    const TAG_NAME = <Badge
      count={tag_name}
      style={{ backgroundColor: '#913831', TextColor: '#000', fontWeight: "bold" }}
    />;
    switch (jobStatus) {
      case "UNASSIGNED":
        return <Badge.Ribbon text="UNASSIGNED" color="red" >
          {TAG_NAME}
        </Badge.Ribbon>
      case "NEW":
        return <Badge.Ribbon text="NEW" color="red" >
          {TAG_NAME}
        </Badge.Ribbon>;
      case "MOVING":
        return <Badge.Ribbon text="MOVING" color="red" >
          {TAG_NAME}
        </Badge.Ribbon>;
      case "ARRIVED":
        return <Badge.Ribbon text="ARRIVED" color="red" >
          {TAG_NAME}
        </Badge.Ribbon>;
      case "ESTIMATING":
        return <Badge.Ribbon text="ESTIMATING" color="red" >
          {TAG_NAME}
        </Badge.Ribbon>;
      case "ESTIMATED":
        return <Badge.Ribbon text="ESTIMATED" color="red" >
          {TAG_NAME}
        </Badge.Ribbon>;
      case "APPROVED":
        return <Badge.Ribbon text="APPROVED" color="red" >
          {TAG_NAME}
        </Badge.Ribbon>;
      case "IN PROGRESS":
        return <Badge.Ribbon text="IN PROGRESS" color="red" >
          {TAG_NAME}
        </Badge.Ribbon>;
      case "ON GOING":
        return <Badge.Ribbon text="ON GOING" color="red" >
          {TAG_NAME}
        </Badge.Ribbon>;
      case "CANCELLED":
        return <Badge.Ribbon text="CANCELLED" color="red" >
          {TAG_NAME}
        </Badge.Ribbon>;
      case "DONE":
        return <Badge.Ribbon text="DONE" color="red" >
          {TAG_NAME}
        </Badge.Ribbon>;
      case "COMPLETED":
        return <Badge.Ribbon text="COMPLETED" color="red" >
          {TAG_NAME}
        </Badge.Ribbon>;
      case "PAYMENT RECEIVED":
        return <Badge.Ribbon text="PAYMENT RECEIVED" color="red" >
          {TAG_NAME}
        </Badge.Ribbon>;
      default:
        return "No Status";
    }
  };

  const jobNextStep = (jobStatus, job) => {
    switch (jobStatus) {
      case "UNASSIGNED":
        return ""
      case "NEW":
        return ""
      case "MOVING":
        return <Link
          className="ant-btn-lg ant-col-24"
          style={{ background: "#73A973 ", borderColor: "#4f814f", color: "#fff" }}
          to={{
            pathname: `/technician/jobs/job-start-travel/${job.id}`,
            dtJob: job // your data array of objects
          }}
        >Start Travel</Link>
      case "ARRIVED":
        return <Link
          className="ant-btn-lg ant-col-24"
          style={{ background: "#73A973 ", borderColor: "#4f814f" }}
          to={{
            pathname: `/technician/jobs/job-estimate-start/${job.id}`,
            dtJob: job // your data array of objects
          }}
        >Estimation</Link>
      case "ESTIMATING":
        return <Link
          className="ant-btn-lg ant-col-24"
          style={{ background: "#73A973 ", borderColor: "#4f814f", color: "#fff" }}
          to={{
            pathname: `/technician/jobs/job-estimate-main/${job.id}`,
            dtJob: job // your data array of objects
          }}
        >Start Estimate</Link>
      case "ESTIMATED":
        return "";
      case "APPROVED":
        return <Link
          className="ant-btn-lg ant-col-24"
          style={{ background: "#73A973 ", borderColor: "#4f814f", color: "#fff" }}
          to={{
            pathname: `/technician/jobs/job-start-work/${job.id}`,
            dtJob: job // your data array of objects
          }}
        >Start Job</Link>
      case "IN PROGRESS":
        return <Link
          className="ant-btn-lg ant-col-24"
          style={{ background: "#73A973 ", borderColor: "#4f814f", color: "#fff" }}
          to={{
            pathname: `/technician/jobs/job-start-work/${job.id}`,
            dtJob: job // your data array of objects
          }}
        >In Progress</Link>
      case "ON GOING":
        return "";
      case "CANCELLED":
        return <Button type="primary" className="ant-btn-lg ant-col-24" disabled={true} >
          Start Travel to the Site
        </Button>;
      case "DONE":
        return "";
      case "COMPLETED":
        return <Link
          className="ant-btn-lg ant-col-24"
          style={{ background: "#73A973 ", borderColor: "#4f814f", color: "#fff" }}
          to={{
            pathname: `/technician/jobs/job-start-work/${job.id}`,
            dtJob: job // your data array of objects
          }}
        >Completed</Link>;
      case "PAYMENT RECEIVED":
        return <Link
          className="ant-btn-lg ant-col-24"
          style={{ background: "#73A973 ", borderColor: "#4f814f", color: "#fff" }}
          to={{
            pathname: `/technician/jobs/job-start-work/${job.id}`,
            dtJob: job // your data array of objects
          }}
        >Completed</Link>;
      default:
        return "";
    }
  };

  if (job === undefined)
    return (
      <>
        <Row>
          <Col span={24}>
            <Title level={4}>{t("general_job_details")}</Title>
          </Col>

        </Row>
        <Row>
          <Col>
            <Typography>{t("general_wait_for_loading_job_detail")}</Typography>
          </Col>
        </Row>
      </>
    );
  else
    return (
      <>
        <Row>
          <Col span={12}>
            <Title level={4}>{t("general_job_details")}</Title>
          </Col>
          <Col span={12} align="right">
            <Link
              className="ant-btn ant-btn-primary"
              to={{
                pathname: `/technician/jobs`,
              }}
            ><LeftOutlined />&nbsp;&nbsp;{t("general_back")} </Link>
          </Col>
        </Row>

        <Row gutter={5}>
          <Col span={24}>

            <Card gutter={5} key={job.id} title={<Title level={5}>{job.customer.full_name}</Title>} extra={<b>Job ID: {job.id
            }</b>}>
              <Space span={24} direction="vertical" size="small" style={{ display: 'flex' }}>
                <Row >

                  <Col span={24}>
                    {jobStatusColor(job.job_status.technician_status, job.discount_tag?.name)}

                  </Col>
                </Row>

                <Row>
                  <Col span={12}><Text strong>Scheduled For:</Text>
                    <br />{moment(job.need_at).format(jobDateFormat)}
                    <br />
                    <Text code>
                      {moment(job.need_at).format("hh:mma")}-{moment(job.need_at).add(job.job_duration_mins, 'minutes').format("hh:mma")}</Text>
                  </Col>

                  <Col span={12} align="left"> <Text strong>{t("general_billing_details")}</Text>
                    <br />
                    {job.job_site_address.full_address}</Col>
                </Row>
                <Row >
                  <Col span={8}> <Text strong>{t("side_menu_navigation_quick_setup_sub_job_tags")}:</Text>
                    <br />
                    {job?.job_tags?.map((tag) => {
                      return <Badge
                        key={tag.name}
                        count={tag.name}
                        style={{ backgroundColor: '#666', TextColor: '#000', fontWeight: "bold" }}
                      />;
                    })}
                  </Col>
                  <Col span={8} align="left"><Text strong>{t("quick_setup_service_types_grid_servie_type")}:</Text>
                    <br />
                    {job.service_type.name}
                  </Col>
                  <Col span={8} align="left"><Text strong>{t("quick_setup_customer_type_grid_heading_customer_type")}:</Text>
                    <br />
                    {job.customer?.customer_type?.name}
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <Typography>
                      <Title level={5}>{t("general_description")}</Title>
                      <Paragraph>
                        {job.job_details}
                      </Paragraph>
                    </Typography>
                  </Col>
                </Row>

                <Row>
                  <Col span={24} align="center">
                    <StaticAddressMap ZoomIn="15" Address={job.job_site_address.full_address} ></StaticAddressMap>
                  </Col>
                </Row>
                <Row>
                  <Col span={24} align="center">
                    <Text strong>{t("quick_setup_office_users_form_address")}:</Text>{job.job_site_address.full_address}
                  </Col>
                </Row>

                <Row>
                  <Col span={24} align="center">
                    {job.job_status.technician_status === 'NEW' ? <Button type="primary" className="ant-btn-lg ant-col-24" onClick={() => setStatusMoving()} disabled={job.job_status.technician_status === 'CANCELLED' || job.read_only || moment(job.need_at).utc(true).format('MM/DD/YYYY') > moment().utc(true).format('MM/DD/YYYY') ? true : false} >
                      {t("general_start_travel_to_the_site")}
                    </Button> : <Button type="primary" className="ant-btn-lg ant-col-24" disabled >
                      {t("general_start_travel_to_the_site")}
                    </Button>}

                  </Col>
                </Row>
                {/* <Row>
                <Col span={24} align="center">
                  <Button type="primary" onClick={() => {
                    history.push({
                      pathname: `/technician/jobs/job-start-work/${job.id}`,
                      dtJob: job,
                    });
                  }} className="ant-btn-lg ant-col-24">
                    Start Work
                  </Button>
                </Col>
              </Row> */}
              </Space>
            </Card>


          </Col>

        </Row>
      </>
    );
};

export default Job_View;
