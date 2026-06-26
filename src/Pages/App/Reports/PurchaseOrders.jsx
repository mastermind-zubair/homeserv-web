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
import { MoneyFormat } from "Lib/DevExConstants";
import environment from "Environment";

const PurchaseOrders = (props) => {
  const { t } = useTranslation();
  const ENTITY = "Purchase Order";
  const ENTITY_PLURAL = "Purchase Orders";
  const ENTITY_API_KEY = "Accounting_PurchaseOrder";
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
  useEffect(async () => {
    if (organisation) {
      setDateFormat(organisation.date_format);
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
      caption: t("general_date"),
      dataField: "createdAt",
      dataType: "date",
      format: dateFormat,
      alignment: "left",
    },
    {
      caption: t("general_job_#"),
      dataField: "job_id",
      dataType: "string",
      alignment: "left",
    },
    {
      caption: t("general_po_number"),
      dataField: "id",
      dataType: "string",
      alignment: "left",
    },
    {
      caption: t("general_supplier"),
      dataField: "supplier.name",
      dataType: "string",
      alignment: "left",
    },
    // {
    //   caption: "Customer Name",
    //   dataField: "job.customer.full_name",
    //   dataType: "string",
    //   alignment: "left",
    // },

    // {
    //   caption: "Address",
    //   dataField: "job.job_site_address.full_address",
    //   dataType: "string",
    //   alignment: "left",
    // },
    {
      caption: t("general_technician"),
      dataField: "field_technician.display_name",
      dataType: "string",
      alignment: "left",
    },

    {
      caption: t("dashboard_job_search_amount"),
      dataField: "amount",
      dataType: "number",
      alignment: "left",
      valueFormat: MoneyFormat,
    },
    {
      dataField: "status_name",
      align: "left",
      dataType: "string",
      caption: t("label_status"),
      cellRender: (item) => {
        let status = item.data.status_name.toLowerCase();
        let className = "text-info";

        if (status === "accepted") className = "text-success";
        if (status === "rejected") className = "text-danger";

        return <span className={className}>{item.data.status_name}</span>;
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

export default PurchaseOrders;
