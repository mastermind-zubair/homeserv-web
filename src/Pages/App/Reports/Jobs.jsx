import React, { useState, useEffect, useContext, memo } from "react";

import { trackPromise } from "react-promise-tracker";
import { notify } from "Services/ToastService";

import {
  Button,
  Col,
  Form,
  Row,
  Tooltip,
  Space,
  DatePicker,
  Badge,
  Card,
} from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";

import CustomDataGrid from "Components/DevEx/CustomDataGrid";
import moment from "moment";
import LookupService from "Services/API/LookupService";
import DefaultService from "Services/API/DefaultService";
import Context from "Store/Context";
import PageTitle from "../_Common/PageTitle";

import { useTranslation } from "react-i18next";
import _ from "lodash";
import environment from "Environment";
import { MoneyFormat } from "Lib/DevExConstants";

const Jobs = (props) => {
  const { t } = useTranslation();
  const ENTITY = "Job";
  const ENTITY_PLURAL = "Jobs";
  const ENTITY_API_KEY = "Reports_Jobs";
  const { RangePicker } = DatePicker;
  const [form] = Form.useForm();
  const [showEditForm, setShowEditForm] = useState(false);

  const [data, setData] = useState();
  const [recordToEdit, setRecordToEdit] = useState();
  const [dateFormat, setDateFormat] = useState(environment.DEFAULT_DATE_FORMAT);
  const { curOrg: organisation } = useContext(Context);
  const [templates, setTemplates] = useState();
  const [dateRange, setDateRange] = useState({
    sDate: moment().startOf("month"),
    eDate: moment(),
  });
  useEffect(async () => {
    if (organisation) {
      setDateFormat(organisation.date_format);
      setTemplates(environment.SENDGRID.templates);
      await handleSearch();
    }
  }, [organisation]);

  useEffect(() => {
    if (recordToEdit && recordToEdit.id === 0) {
      //recordToEdit.ranges = [];
    }
    form.resetFields();
  }, [recordToEdit]);

  const dateRangeChanged = (e) => {
    const sDate = e && e.length > 0 && moment(e[0]);
    const eDate = e && e.length > 1 && moment(e[1]);
    setDateRange({ sDate, eDate });
  };
  const handleSearch = async () => {
    console.log(dateRange);
    if (!dateRange.sDate || !dateRange.eDate) {
      notify("Please select correct date range for the report");
      return;
    }

    let { data, status, message } = await trackPromise(
      DefaultService.POST("/report/job", {
        condition: {
          organisation_id: organisation.id,
          createdAt: [
            moment(dateRange.sDate).format(environment.API_DATE_FORMAT),
            moment(dateRange.eDate).format(environment.API_DATE_FORMAT),
          ],
        },
      })
    );
    console.log("fetched data", data);
    !status && notify(message, status);
    setData(data);
  };

  const handleCancel = () => {
    setShowEditForm(false);
  };

  const columns = [
    {
      caption: t("general_customer_mame"),
      dataField: "customer.full_name",
      dataType: "string",
      alignment: "left",
    },
    {
      caption: t("quick_setup_service_types_grid_servie_type"),
      dataField: "service_type.name",
      dataType: "string",
      alignment: "left",
    },

    {
      caption: t("quick_setup_customer_type_grid_heading_customer_type"),
      dataField: "customer.customer_type.name",
      dataType: "string",
      alignment: "left",
    },

    {
      caption: t("quick_setup_job_tags_grid_job_tag"),
      dataType: "string",
      alignment: "left",
      cellRender: (item) => {
        let jtags = item.data.job_tags;
        console.log(jtags);
        return jtags.map((jt) => {
          return <li>{jt && jt.name}</li>;
        });
      },
    },

    {
      caption: t("general_industry"),
      dataField: "industry.name",
      dataType: "string",
      alignment: "left",
    },

    {
      caption: t("general_revenue"),
      dataField: "sales",
      dataType: "number",
      alignment: "center",
      format: MoneyFormat,
    },
  ];

  return (
    <>
      <div className="flex mb-2">
        <PageTitle />

        <p className="ml-auto">
          <Space direction="horizontal" size={12}>
            {t("general_select_a_date_range:")}
            <RangePicker
              format={dateFormat.toUpperCase()}
              allowClear={true}
              allowEmpty={[true, true]}
              showToday={true}
              onChange={dateRangeChanged}
              defaultValue={[moment(dateRange.sDate), moment(dateRange.eDate)]}
            />
            <Button onClick={handleSearch}>{t("general_search")}</Button>
          </Space>
        </p>
      </div>
      <Row gutter={(10, 10)}>
        <Col xl={6} md={12} xs={24}>
          <Card
            title={t("general_total_jobs")}
            bordered={false}
            style={{ minWidth: "200px" }}
            className="box mb-3"
          >
            <h3 className="text-success">{data?.total_jobs?.value}</h3>
          </Card>
        </Col>
        <Col xl={6} md={12} xs={24}>
          <Card
            title={t("general_most_selected_job_tag")}
            bordered={false}
            style={{ minWidth: "200px" }}
            className="box mb-3"
          >
            <h3 className="text-success">
              {data?.most_selected_job_tags_stats?.name}
            </h3>
          </Card>
        </Col>
        <Col xl={6} md={12} xs={24}>
          <Card
            title={t("general_most_selected_service_type")}
            bordered={false}
            style={{ minWidth: "200px" }}
            className="box mb-3"
          >
            <h3 className="text-success">
              {data?.most_selected_service_type_stats?.name}
            </h3>
          </Card>
        </Col>
        <Col xl={6} md={12} xs={24}>
          <Card
            title={t("general_most_selected_customer_type")}
            bordered={false}
            style={{ minWidth: "200px" }}
            className="box mb-3"
          >
            <h3 className="text-success">
              {data?.most_selected_customer_type_stats?.name}
            </h3>
          </Card>
        </Col>
      </Row>
      <div className="flex mt-3">
        <CustomDataGrid
          data={data && data.list && data.list.items}
          columns={columns}
          ENTITY={ENTITY}
          ENTITY_PLURAL={ENTITY_PLURAL}
          canDelete={false}
          canEdit={false}
        />
      </div>
    </>
  );
};

export default Jobs;
