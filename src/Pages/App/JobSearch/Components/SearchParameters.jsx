import { Col, Collapse, Row } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";
import CustomerSearchParameters from "./CustomerSearchParameters";
import JobSearchParameters from "./JobSearchParameters";

function SearchParameters({ data }) {
  const { t } = useTranslation();
  return (
    <>
      <Row>
        <Col span={24}>
          <Collapse defaultActiveKey={[]}>
            <Collapse.Panel header={t("general_job_details")} key={1}>
              <JobSearchParameters data={data} />
            </Collapse.Panel>
            <Collapse.Panel header={t("general_customer_details")} key={2}>
              <CustomerSearchParameters data={data} />
            </Collapse.Panel>
          </Collapse>
        </Col>
      </Row>
    </>
  );
}

export default SearchParameters;
