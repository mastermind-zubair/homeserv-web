import React, { useCallback, useEffect, useState, useContext } from "react";
import { Col, Row, Statistic, Typography, Card, Radio, DatePicker, Space } from "antd";
import { DollarOutlined, FileDoneOutlined } from "@ant-design/icons";
import moment from "moment";
import AreaChart from "./Components/AreaChart";
import DoughnutChartThin from "./Components/DoughnutChartThin";
import MultipleAreaChart from "./Components/MultipleAreaChart";
import DefaultService from "Services/API/DefaultService";
import GMapArea from "./Components/GMapArea";
import { formatCurrency } from "Lib/JsHelper";
import { useTranslation } from "react-i18next";

const Dashboard = (props) => {
  const dateFormat = "DD/MM/YYYY";
  const [rangeValue, setRangeValue] = useState([]);
  const [Data, setData] = useState(null);
  const [Filter, setFilter] = useState("1");


  const loadData = useCallback(async (time_span) => {
    const { data } = await DefaultService.GetStatisticsAdmin(time_span);

    data.payment_method_wise = data.payment_method_wise.map((obj) => {
      obj.value = +obj.value.toFixed(2);
      return obj
    });

    setData(data);
  }, []);

  useEffect(() => {
    loadData(Filter);
  }, [loadData, Filter]);

  const buildFilter = (filter) => {
    switch (filter) {
      case "1":
        setRangeValue([moment(), moment()]);
        break;
      case "2":
        setRangeValue([moment().startOf("week"), moment().endOf("week")]);
        break;
      case "3":
        setRangeValue([moment().startOf("month"), moment().endOf("month")]);
        break;
      // case "3":
      //   setRangeValue([moment().startOf("quarter"), moment().endOf("quarter")]);
      //   break;
      case "4":
        setRangeValue([moment().startOf("year"), moment().endOf("year")]);
        break;
      default:
        break;
    }
  };

  const { t } = useTranslation();
  const handleFilterChange = async (e) => {
    setFilter(e.target.value);
    buildFilter(e.target.value);
  };

  if (Data === null)
    return (
      <>
        <Row>
          <Col>
            <Typography> {t("dashboard_wait_for_loading_dashboard")} </Typography>
          </Col>
        </Row>
      </>
    );
  else
    return (
      <>
        <Space direction="vertical" size="middle" style={{ display: "flex" }}>
          <Row gutter={5}>
            <Col>
              <Radio.Group value={Filter} onChange={handleFilterChange}>
                <Radio.Button value="1">{t("general_today")}</Radio.Button>
                <Radio.Button value="2">{t("general_this_week")} </Radio.Button>
                <Radio.Button value="3">{t("general_this_month")}</Radio.Button>
                {/* <Radio.Button value="3">{t("general_this_quarter")}</Radio.Button> */}
                <Radio.Button value="4">{t("general_this_year")}</Radio.Button>
              </Radio.Group>
            </Col>
            <Col>
              <DatePicker.RangePicker value={rangeValue} format={dateFormat} />
            </Col>
          </Row>
          <Row gutter={5}>
            <Col span={6}>
              <Card title="Total Organisation">
                <Row>
                  <Col span={24}>
                    {Data.total_organisations && <Statistic value={Data.total_organisations.reduce((pv, cv) => pv + (+cv.value), 0)} prefix={<FileDoneOutlined />} />}

                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <AreaChart data={Data.total_organisations || []} xField={"timePeriod"} yField={"value"} />
                  </Col>
                </Row>
              </Card>
            </Col>

            <Col span={6}>
              <Card title="Total Technicians">
                <Row>
                  <Col span={24}>
                    {Data.total_technicians && <Statistic value={Data.total_technicians.reduce((pv, cv) => Math.round(pv + (+cv.value)), 0)} prefix={<FileDoneOutlined />} suffix />}

                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    {Data.total_technicians && (
                      <AreaChart data={Data.total_technicians || []} xField={"timePeriod"} yField={"value"} />
                    )}
                  </Col>
                </Row>
              </Card>
            </Col>

            <Col span={6}>
              <Card title="Total Office Users">
                <Row>
                  <Col span={24}>
                    {Data.total_office_users && <Statistic value={Data.total_office_users.reduce((pv, cv) => Math.round(pv + (+cv.value)), 0)} prefix={<FileDoneOutlined />} suffix />}

                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    {Data.total_office_users && (
                      <AreaChart data={Data.total_office_users || []} xField={"timePeriod"} yField={"value"} />
                    )}
                  </Col>
                </Row>
              </Card>
            </Col>

            <Col span={6}>
              <Card title="Total Purchase Orders generated through Service Vault">
                <Row>
                  <Col span={24}>
                    {Data.total_purchase_orders && (<Statistic value={Data.total_purchase_orders.reduce((pv, cv) => Math.round(pv + (+cv.value)), 0)} prefix={<FileDoneOutlined />} suffix />)}

                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    {Data.total_purchase_orders && (
                      <AreaChart data={Data.total_purchase_orders || []} xField={"timePeriod"} yField={"value"} />
                    )}
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>

          <Row gutter={5}>
            <Col span={10}>
              <Row gutter={5}>
                <Col span={12}>
                  <Card title="Total Invoice generated through Service Vault">
                    <Row>
                      <Col span={24}>
                        <Statistic value={Data.total_invoices.reduce((pv, cv) => Math.round(pv + (+cv.value)), 0)} prefix={<FileDoneOutlined />} suffix />
                      </Col>
                    </Row>
                    <Row>
                      <Col span={24}>
                        {Data.total_invoices && (
                          <AreaChart data={Data.total_invoices || []} xField={"timePeriod"} yField={"value"} />
                        )}
                      </Col>
                    </Row>
                  </Card>
                </Col>


                <Col span={12}>
                  <Card title="Average Sales">
                    <Row>
                      <Col span={24}>
                        <Statistic value={Data.average_sales.reduce((pv, cv) => Math.round(pv + (+cv.value)), 0)} prefix={<FileDoneOutlined />} suffix />
                      </Col>
                    </Row>
                    <Row>
                      <Col span={24}>
                        {Data.average_sales && (
                          <AreaChart data={Data.average_sales || []} xField={"timePeriod"} yField={"value"} />
                        )}
                      </Col>
                    </Row>
                  </Card>
                </Col>
              </Row>

              <Row gutter={5} className="pt-5">
                <Col span={12}>
                  <Card title="Total Booked Jobs">
                    <Row>
                      <Col span={24}>
                        <Statistic value={Data.total_booked_jobs.reduce((pv, cv) => Math.round(pv + (+cv.value)), 0)} prefix={<FileDoneOutlined />} suffix />
                      </Col>
                    </Row>
                    <Row>
                      <Col span={24}>
                        {Data.total_booked_jobs && (
                          <AreaChart data={Data.total_booked_jobs || []} xField={"timePeriod"} yField={"value"} />
                        )}
                      </Col>
                    </Row>
                  </Card>
                </Col>

                <Col span={12}>
                  <Card title="Job Tags Distribution">
                    <Row>
                      <Col span={24}>
                        {Data.industry_wise && <DoughnutChartThin data={Data.industry_wise || []} label={Data.industry_wise.reduce((pv, cv) => pv + cv.value, 0)} />}
                        {" "}
                      </Col>
                    </Row>
                  </Card>
                </Col>
              </Row>
              <Row gutter={5} className="pt-5">
                <Col span={12}>
                  <Card title="Most Used Forms of Payment">
                    <Row>
                      <Col span={24}>
                        {Data.payment_method_wise && <DoughnutChartThin data={Data.payment_method_wise || []} label={formatCurrency(Data.payment_method_wise.reduce((pv, cv) => pv + cv.value, 0))} />}
                        {" "}
                      </Col>
                    </Row>
                  </Card>
                </Col>
              </Row>
            </Col>

            <Col span={14}>
              <Card title={t("dashboard_h_job_heat_map")}>
                <Row gutter={5}>
                  <Col span={24}>
                    <GMapArea jobs={Data.country_wise} />
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
        </Space>
      </>
    );
};

export default Dashboard;
