import React, { useCallback, useEffect, useState } from "react";
import { Row, Col, Typography, Descriptions, Button, Space } from 'antd';
import AuthService from "Services/AuthService";
import TechFleet from "Services/API/Technician/TechFleet";
import TechOrg from "Services/API/Technician/TechOrganisation";
import moment from "moment";
import environment from "Environment";

const { Title } = Typography;
const ObjUser = AuthService.getCurrentTechnician();

const TECH_ID = ObjUser ? ObjUser.id : 0;
const ORG_ID = ObjUser ? ObjUser.organisation_id : 0;

const TechnicianFleet = (props) => {
  const [dtFleet, setData] = useState(null);
  const [dtOrg, setOrgData] = useState(null);

  const loadData = async () => {
    const { data } = await TechFleet.GetTechFleet(TECH_ID);
    const dtOrg = await TechOrg.GetTechOrganisation(ORG_ID);
    setData(data);
    setOrgData(dtOrg);

  }

  useEffect(() => {
    loadData();

  }, []);
  if (dtFleet === null)
    return (
      <>
        <Row>
          <Col>
            <Title level={4}>Technician Fleet</Title>
          </Col>
        </Row>
        <Row>
          <Col>
            <Typography>Wait for loading fleet...</Typography>
          </Col>
        </Row>
      </>
    );
  else
    if (dtFleet.vehicle === undefined) {
      return (
        <><Row>
          <Col>
            <Title level={4}>Technician Fleet</Title>
          </Col>
        </Row>
          <Row>
            <Col>
              <Typography>No associated fleet</Typography>
            </Col>
          </Row></>
      )
    }
    else
    return (
      <>

        <Row>
          <Col>
          <Descriptions
            title={<Title level={4}>Technician Fleet</Title>}
            bordered
            layout="vertical"
            size="small"
            column={{ xxl: 2, xl: 3, lg: 4, md: 4, sm: 4, xs: 2 }}
          >
              <Descriptions.Item label="Company Name"><b>{dtOrg?.name}</b></Descriptions.Item>
              <Descriptions.Item label="Company Address"><b>{dtOrg?.address}</b></Descriptions.Item>
              <Descriptions.Item label="Logo" span={3}> <img src={`data:image/png;base64,${dtOrg?.business_logo}`} width="120px" alt="logo" /></Descriptions.Item>
              <Descriptions.Item label="Company ACN/ABN"><b>{dtOrg?.acn_abn}</b></Descriptions.Item>
              <Descriptions.Item label="Image" span={3}>
                <img src={`${environment.PATH_VEHICLE_PIC}/${dtFleet.vehicle?.vehicle_image}`} width="350" height="120" alt="Fleet" />
              </Descriptions.Item>
              <Descriptions.Item label="Vehicle Type"><b>{dtFleet.vehicle?.vehicle_type}</b></Descriptions.Item>
              <Descriptions.Item label="Insurance Policy #"><b>{dtFleet.vehicle?.policy_number}</b></Descriptions.Item>
              <Descriptions.Item label="Insurance Policy Expiry"><b>{moment(dtFleet?.vehicle?.policy_expiry).format("ddd Do MMM YYYY")}</b></Descriptions.Item>
              <Descriptions.Item label="Vehicle Registration Expiry"><b>{moment(dtFleet?.vehicle?.registration_expiry).format("ddd Do MMM YYYY")}</b></Descriptions.Item>
              <Descriptions.Item label="Vehicle Next Service"><b>{moment(dtFleet?.vehicle?.next_vehicle_service).format("ddd Do MMM YYYY")}</b></Descriptions.Item>
              <Descriptions.Item label="Vehicle Insurance Company"><b>{dtFleet.vehicle?.insurance_company}</b></Descriptions.Item>
              <Descriptions.Item label="Plant ID #"><b>{dtFleet.vehicle?.plant_number}</b></Descriptions.Item>

          </Descriptions>
        </Col>
      </Row>
        <Row className="mt-5 text-center">
          <Space direction="horizontal" size="middle" >
            <Col>
              <Button type="danger" className="fl" size="large" onClick={() => {
            console.log('first')
          }}>
            Close
              </Button>
            </Col>
            <Col>
              <Button type="primary" size="large" onClick={() => {
                console.log('first')
              }}>
                Email
              </Button>
            </Col>
          </Space>
      </Row>
    </>
  );
};

export default TechnicianFleet;
