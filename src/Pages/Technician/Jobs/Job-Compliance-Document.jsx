/* eslint-disable react/jsx-pascal-case */
import React, { useEffect, useState } from "react";
import { trackPromise } from "react-promise-tracker";
import { Row, Col, Typography, Card, Space, Button } from "antd";
import AuthService from "Services/AuthService";
import DefaultService from "Services/API/DefaultService";
import environment from "Environment";
import { useTranslation } from "react-i18next";

const { Title } = Typography;
const user = AuthService.getCurrentTechnician();
const ORGANISATION_ID = user ? user.organisation_id : 0;


const Job_Compliance_Document = (props) => {

  const [dtJobComDoc, setJobComDoc] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    console.log('useEffect');
    getCompliancePDF();
  }, []);


  const getCompliancePDF = async () => {

    const _COM_DOC_PARAM = {
      "condition": { "organisation_id": ORGANISATION_ID, "anchor": "JOB_START", "is_active": true, "is_pdf": true }
    }
    const { data: jobComDoc } = await trackPromise(
      DefaultService.POST(`/compliance_document/list/`, _COM_DOC_PARAM)
    );
    setJobComDoc(jobComDoc);
  }
  const { t } = useTranslation();
  const downloadCompliancePDF = async (pdf_path) => {
    window.open(`${environment.PATH_COMPLIANCE_DOC}/${pdf_path}`, '_blank');
  }

  if (dtJobComDoc === undefined)

    return (
      <>
        <Row>
          <Col span={24}>
            <Title level={4}>{t("side_menu_navigation_settings_sub_compliance_documents")}</Title>

          </Col>
        </Row>
        <Row>
          <Col>
            <Typography>Wait for loading job compliance documents...</Typography>
          </Col>
        </Row>
      </>
    );
  else
    return (
      <>
        <Row>
          <Col span={24}>
            <Title level={4}>{t("side_menu_navigation_settings_sub_compliance_documents")}</Title>
          </Col>
        </Row>

        <Row>
          <Col span={24}>
            <Card>
              {dtJobComDoc !== null ?
                <Row>
                  <Space span={24} direction="vertical" size="small" style={{ display: 'flex', width: "100%" }}>
                    {dtJobComDoc.map((item, index) => {
                      return <Col span={24}>
                        <Button size="large" style={{ width: "100%", backgroundColor: item.flag ? "green" : "" }} key={`${item.id}_${item.title}`} onClick={() => { downloadCompliancePDF(item.pdf_path) }}>
                          {item.title}
                        </Button>
                      </Col>
                    })}

                  </Space>
                </Row>
                : ""}

            </Card>
          </Col>
        </Row>

      </>
    );
};

export default Job_Compliance_Document;
