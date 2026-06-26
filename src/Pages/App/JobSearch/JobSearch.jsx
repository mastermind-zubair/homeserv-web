import { Button, Col, Form, Row, Space, Modal } from "antd";
import React, { useCallback, useContext, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import DefaultService from "Services/API/DefaultService";
import { notify } from "Services/ToastService";
import Context from "Store/Context";
import PageTitle from "../_Common/PageTitle";
import SearchParameters from "./Components/SearchParameters";
import SearchResults from "./Components/SearchResults";
import JobCard from "./Components/JobCard";

const JobSearch = (props) => {
  const { curOrg: organisation } = useContext(Context);
  const [dateFormat, setDateFormat] = useState("YYYY-MM-dd");

  const ENTITY = "Job";
  const ENTITY_PLURAL = "Jobs";
  const ENTITY_API_KEY = "JOB";

  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [jobCardVisible, setJobCardVisible] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [SupportData, setSupportData] = useState({
    job_statuses: [],
    customer_types: [],
    job_priorities: [],
    job_tags: [],
  });
  const handleSubmitQuery = (values) => {
    const filter = {
      main: {
        organisation_id: organisation.id,
        id: values.job_id,
        job_status_id: values.job_status_id,
        job_priority_id: values.job_priority_id,
      },
      sub: {
        industry: { organisation_id: organisation.id },
        service_type: { organisation_id: organisation.id },
        discount_tag: { organisation_id: organisation.id },
        job_priority: { organisation_id: organisation.id },
        job_tag: { organisation_id: organisation.id, id: values.job_tag_id },
        product: { organisation_id: organisation.id },
        job_status: {},
        customer: {
          organisation_id: organisation.id,
          customer_type_id: values.customer_type_id,
          first_name: values.first_name,
          last_name: values.last_name,
          email: values.email,
        },
        address: {
          organisation_id: organisation.id,
          phone: values.phone,
          line_1: values.address,
          line_2: values.address,
          suburb: values.address,
          city: values.address,
          state: values.address,
          country: values.address,
        },
      },
    };
    handleSearch(filter);
  };
  const handleJobCardOk = () => {
    setJobCardVisible(false);
  }
  const handleSearch = useCallback(async (filter) => {
    let { data, status, message } = await DefaultService.Entity_List(ENTITY_API_KEY, filter);
    notify(message, status);
    setData(data);
  }, []);

  const handleJobCard = job_id => {
    setSelectedJobId(job_id);
    setJobCardVisible(true);
  };
  const queryData = useCallback(async (organisation_id) => {
    const { data: support_data } = await DefaultService.Entity_Query(
      "Query_Data",
      ["job_status", "job_priority", "job_tag", "customer_type"],
      { organisation_id }
    );

    const { job_status, job_priority, job_tag, customer_type } = support_data;
    setSupportData({
      job_statuses: job_status,
      customer_types: customer_type,
      job_priorities: job_priority,
      job_tags: job_tag,
    });
  }, []);

  useEffect(() => {
    if (!organisation) return;
    queryData(organisation.id);
    setDateFormat(organisation.date_format);
  }, [organisation, queryData]);
  const { t } = useTranslation();
  return (
    <>
      <div className="flex mb-2">
        <PageTitle />
        <h3 className="push-right text-right"></h3>
      </div>
      <Form layout="vertical" form={form} onFinish={handleSubmitQuery}>
        <Row>
          <Col span={24}>
            <SearchParameters data={SupportData} />
          </Col>
        </Row>
        <Row justify="end">
          <Col>
            <br />
            <Space>
              <Button htmlType="reset">{t("general_reset")}</Button>
              <Button htmlType="submit" type="primary">
                {t("general_submit")}
              </Button>
            </Space>
          </Col>
        </Row>
      </Form>
      <Row>
        <Col span={24}>
          <SearchResults
            ENTITY={ENTITY}
            ENTITY_PLURAL={ENTITY_PLURAL}
            data={data}
            handleJobCard={handleJobCard}
            dateFormat={dateFormat}
          />
        </Col>
      </Row>
      <Modal
        title={t("dashboard_job_search_job_card")}
        visible={jobCardVisible}
        onOk={handleJobCardOk}
        onCancel={handleJobCardOk}
        width={1000}
      >
        <JobCard selectedJobId={selectedJobId} dateFormat={dateFormat} />
      </Modal>
    </>
  );
};

export default JobSearch;
