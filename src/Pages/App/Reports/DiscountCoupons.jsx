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

const DiscountCoupons = (props) => {
  const { t } = useTranslation();
  const ENTITY = "Discount Coupon";
  const ENTITY_PLURAL = "Discount Coupons";
  //const ENTITY_API_KEY = "Reports_Jobs";
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
      console.log(organisation);
    }
  }, [organisation]);

  useEffect(() => {
    if (recordToEdit && recordToEdit.id === 0) {
      //recordToEdit.ranges = [];
    }
    form.resetFields();
  }, [recordToEdit]);

  const dateRangeChanged = (e) => {
    console.log(`dateformat: ${dateFormat}`);
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
      DefaultService.POST("/report/discount_coupon", {
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
      caption: t("general_coupon_code"),
      dataField: "code",
      dataType: "string",
      alignment: "left",
    },
    {
      caption: t("general_title"),
      dataField: "title",
      dataType: "string",
      alignment: "left",
    },

    {
      caption: t("dashboard_job_search_amount"),
      dataField: "amount",
      dataType: "number",
      format: MoneyFormat,
      alignment: "left",
    },

    {
      caption: t("general_redeemed"),
      dataType: "string",
      alignment: "left",
      cellRender: (item) => {
        return item.data.redeemed ? "Yes" : "No";
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
      {/* <Row gutter={(10, 10)}>
        {data &&
          data.total_customer_type_stats &&
          data.total_customer_type_stats.map((d) => {
            return (
              <Col xl={6} md={12} xs={24}>
                <Card title={d.name} bordered={false} style={{ minWidth: "200px" }} className="box mb-3">
                  <h4>
                    <Row className="flex">
                      <Col>Total Jobs:</Col>
                      <Col className="text-primary text-center">{d.total_jobs}</Col>
                    </Row>
                    <Row className="flex">
                      <Col>Total Sales:</Col>
                      <Col className="text-success text-center">
                        {" "}
                        {_.round(d.total_sales, 2)} {organisation.currency.symbol}
                      </Col>
                    </Row>
                  </h4>
                </Card>
              </Col>
            );
          })}
      </Row> */}
      <div className="flex mt-3">
        <CustomDataGrid
          data={
            data &&
            data.total_discount_coupon_stats &&
            data.total_discount_coupon_stats
          }
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

export default DiscountCoupons;
