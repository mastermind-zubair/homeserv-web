import React, { useState, useEffect, useContext, memo } from "react";

import { trackPromise } from "react-promise-tracker";
import { notify } from "Services/ToastService";

import { Button, Col, Form, Row, Tooltip, Space, DatePicker } from "antd";
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

const OutboundSMS = (props) => {
  const { t } = useTranslation();
  const ENTITY = "Outbound SMS";
  const ENTITY_PLURAL = "Outbound SMS";
  const ENTITY_API_KEY = "Outbound_SMS_Campaign";
  const { RangePicker } = DatePicker;
  const [form] = Form.useForm();
  const [showEditForm, setShowEditForm] = useState(false);

  const [data, setData] = useState();
  const [recordToEdit, setRecordToEdit] = useState();
  const [dateFormat, setDateFormat] = useState(environment.DEFAULT_DATE_FORMAT);
  const { curOrg: organisation } = useContext(Context);

  const [dateRange, setDateRange] = useState({
    sDate: moment().startOf("month"),
    eDate: moment(),
  });
  useEffect(() => {
    if (!organisation) return;

    setDateFormat(organisation.date_format);
    handleSearch();
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
      DefaultService.Entity_List(ENTITY_API_KEY, {
        organisation_id: organisation.id,
        createdAt: [
          moment(dateRange.sDate).format(environment.API_DATE_FORMAT),
          moment(dateRange.eDate).format(environment.API_DATE_FORMAT),
        ],
      })
    );
    !status && notify(message, status);
    setData(data);
  };

  const handleCancel = () => {
    setShowEditForm(false);
  };

  const columns = [
    {
      caption: t("general_job_#"),
      dataField: "job.id",
      dataType: "string",
      alignment: "left",
    },
    {
      caption: t("general_customer_mame"),
      dataField: "job.customer.full_name",
      dataType: "string",
      alignment: "left",
    },
    {
      caption: t("general_created_at"),
      dataField: "createdAt",
      dataType: "date",
      format: dateFormat,
      alignment: "left",
    },
    {
      caption: t("quick_setup_office_users_form_address"),
      dataField: "job.job_site_address.full_address",
      dataType: "string",
      alignment: "left",
    },
    {
      caption: t("general_technician"),
      dataField: "field_technician.display_name",
      dataType: "string",
      alignment: "left",
    },

    {
      caption: t("general_quote_amount"),
      dataType: "number",
      alignment: "left",
      cellRender: (item) => {
        let row = item.row.data;
        return (
          <ul>
            {row.options.map((opt) => {
              return (
                <Row>
                  <Col span={10}>{opt.title}: </Col>
                  <Col span={14}>${opt.amount}</Col>
                </Row>
              );
            })}
          </ul>
        );
      },
    },
    {
      caption: t("label_status"),
      dataField: "id",
      dataType: "string",
      alignment: "center",
      cellRender: (item) => {
        let row = item.row.data;

        let acceptedQuote = _.find(row.options, { is_accepted: true });
        //return "TEST";
        let isAccepted = (acceptedQuote && true) || false;
        return (
          <span
            className={`${(isAccepted && "text-success") || "text-danger"}`}
          >
            {(isAccepted && "Accepted") || "Pending"}
          </span>
        );
      },
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
      <div className="flex">
        <CustomDataGrid
          data={data}
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

export default OutboundSMS;
