import { Card, Col, Descriptions, Image, Row } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";

function JobCardSigns({ job }) {
  const { t } = useTranslation();
  return (
    <>
      <Row>
        <Col span={24}>
          <Card title={t("dashboard_job_search_customer_signs")}>
            {job.quotes &&
              job.quotes.map((quote) => (
                <>
                  <Descriptions title={`Approved Estimates`}>
                    <Descriptions.Item label={quote.updatedAt}>
                      <Image src={quote.approve_customer_sign} />
                    </Descriptions.Item>
                  </Descriptions>
                </>
              ))}
            {job.job_completion_sign && (
              <>
                <Descriptions title={`Job Completion Signature`}>
                  <Descriptions.Item>
                    <Image src={job.job_completion_sign} />
                  </Descriptions.Item>
                </Descriptions>
              </>
            )}
          </Card>
        </Col>
      </Row>
    </>
  );
}

export default JobCardSigns;
