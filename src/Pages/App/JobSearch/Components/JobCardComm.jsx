import React, { useState, useContext, useEffect } from "react";
import { Card, Col, Row, List, Button, Input } from "antd";
import { useTranslation } from "react-i18next";
import Context from "Store/Context";
import DefaultService from "Services/API/DefaultService";
import AuthService from "Services/AuthService";

function JobCardComm({
  job,
  handleJobMessageChange,
  handleJobComplaintChange,
}) {
  const { t } = useTranslation();
  const [message, setMessage] = useState("");
  const [complaint, setComplaint] = useState("");
  const { curOrg: organisation } = useContext(Context);
  const user = AuthService.getCurrentUser();

  const handleSendMessage = async () => {
    const data = {
      message: message,
      job_id: job.id,
      user_id: user.id,
      organisation_id: organisation.id,
      is_active: true,
    };
    const response = await DefaultService.Entity_Add("JOB_MESSAGE", data);

    if (response.status) {
      handleJobMessageChange({ ...response.data, user: user });
    }
    setMessage("");
  };

  const handleSendComplaint = async () => {
    const data = {
      description: complaint,
      job_id: job.id,
      user_id: user.id,
      organisation_id: organisation.id,
      is_active: true,
      is_resolved: false,
    };
    const response = await DefaultService.Entity_Add("JOB_COMPLAINT", data);

    if (response.status) {
      handleJobComplaintChange({ ...response.data, user: user });
    }
    setComplaint("");
  };

  if (!job) return <h3>No Communication found</h3>;
  return (
    <>
      <Row>
        <Col span={12}>
          <Card title={t("dashboard_job_search_messages")}>
            <Row>
              <Col span={24}>
                {job.messages && (
                  <List
                    itemLayout="horizontal"
                    dataSource={job.messages}
                    renderItem={(item) => (
                      <List.Item key={`message_${item.id}`}>
                        <List.Item.Meta
                          title={item.user.display_name}
                          description={item.message}
                        />
                      </List.Item>
                    )}
                  />
                )}
              </Col>
            </Row>
            <Row>
              <Col span={21}>
                <Input
                  placeholder="Type your message here"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </Col>
              <Col span={3}>
                <Button onClick={handleSendMessage}>Send</Button>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col span={12}>
          <Card title={t("dashboard_job_search_complaints")}>
            <Row>
              <Col span={24}>
                {job.complaints && (
                  <List
                    itemLayout="horizontal"
                    dataSource={job.complaints}
                    renderItem={(item) => (
                      <List.Item key={`comp_${item.id}`}>
                        <List.Item.Meta
                          title={item.user.display_name}
                          description={item.description}
                        />
                      </List.Item>
                    )}
                  />
                )}
              </Col>
            </Row>
            <Row>
              <Col span={18}>
                <Input
                  placeholder="Type Complaint here..."
                  value={complaint}
                  onChange={(e) => setComplaint(e.target.value)}
                />
              </Col>
              <Col span={6}>
                <Button onClick={handleSendComplaint}>Send Complaint</Button>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </>
  );
}

export default JobCardComm;
