import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Row, Col, Typography, Card, Button, Modal, message } from "antd";
import { trackPromise } from "react-promise-tracker";
import AddressDirectionMap from "./Components/AddressDirectionMap";
import { notify } from "Services/ToastService";
import TechJobService from "Services/API/Technician/TechJobService";
import DefaultService from "Services/API/DefaultService";
import AuthService from "Services/AuthService";
import { useTranslation } from "react-i18next";

const { Title, Paragraph } = Typography;

const user = AuthService.getCurrentTechnician();

const TECH_ID = user ? user.id : 0;

const Job_Start_Travel = (props) => {
  let history = useHistory();
  let { jid } = useParams();
  const { t } = useTranslation();
  const { dtJob } = props.location
  const [job, setJob] = useState(dtJob);
  const [isModalVisible, setIsModalVisible] = useState(false);

  function fetchData() {
    return new Promise(async (resolve, reject) => {

      if (!job) {
        if (!jid) {
          return history.push("/technician/jobs/");
        }
        const { data } = await TechJobService.GetTechJob(jid);
        setJob(data);
        resolve(data);
      }
      else {
        resolve(job);
      }
    })
  }

  useEffect(() => {
    fetchData()
      .then(job => { job.job_status.technician_status === 'MOVING' ? setIsModalVisible(false) : setIsModalVisible(true); })
    window.scrollTo(0, 0);

  }, []);


  const handleOk = () => {
    sendMessagetoClient();
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const setStatusArrived = async () => {

    if (job.is_started) {
      await trackPromise(
        DefaultService.PUT(`/job/f_t/in_progress/${job.id}`, { field_technician_id: TECH_ID })
      );
      history.push({
        pathname: `/technician/jobs/job-start-work/${job.id}`,
        dtJob: job,

      })
    } else {
      await trackPromise(
        DefaultService.PUT(`/job/f_t/arrived/${job.id}`, { field_technician_id: TECH_ID })
      );
      notify(`Technician arrived successfully`, true);
      history.push({
        pathname: `/technician/jobs/job-estimate-start/${job.id}`,
        dtJob: job,
      });
    }

  };

  const sendMessagetoClient = async () => {
    await trackPromise(
      DefaultService.PUT(`/job/f_t/inform_moving/${job.id}`)
    );
    notify(`Message send successfully`, true);
  };

  return (
    <>

      <Row>
        <Col span={12}>
          <Title level={4}>{t("general_start_travel_to_site")}</Title>
        </Col>
        <Col span={12} align="right">
          {/* <Link
            className="ant-btn ant-btn-primary"
            to={{
              pathname: `/technician/jobs/job-view/${jid}`,
              dtJob: job // your data array of objects
            }}
          ><LeftOutlined />&nbsp;&nbsp;Back </Link> */}
        </Col>
      </Row>
      {job !== undefined ? (

        <Row gutter={5}>
          <Modal title="Message to Client" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} okText="Yes"
            cancelText="No">
            <Title level={5}>{t("general_do_you_want_to_advise_the_client_you_are_on_the_way?")}</Title>
          </Modal>
          <Col span={24}>
            <Card gutter={5} title={<Title level={5}>{t("general_site_location")}</Title>}>
              <Row>
                <Col span={12}>
                  <Typography>
                    <Title level={5}>{t("quick_setup_office_users_form_address")}</Title>
                    <Paragraph>{job.job_site_address.full_address}</Paragraph>
                  </Typography>
                </Col>
                <Col span={12} align="left">
                  <Button type="primary" style={{ width: '100%' }} className="ant-btn-lg ant-col-24" onClick={() => setStatusArrived()}>
                    {t("general_arrived")}
                  </Button>
                </Col>
              </Row>

              <br />
              <Row>
                <Col span={24} align="center">
                  <AddressDirectionMap ZoomIn="15" Address={job.job_site_address.full_address}></AddressDirectionMap>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      ) : (
        <Row>
          <Col>
            <Typography>{t("general_wait_for_loading_job_detail")}</Typography>
          </Col>
        </Row>
      )}
    </>
  );
};

export default Job_Start_Travel;
