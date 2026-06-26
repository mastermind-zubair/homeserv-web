import React, { useCallback, useEffect, useState } from "react";
import { Row, Col, Tabs, Typography, Space, Card, Empty } from "antd";
import { CalendarOutlined } from "@ant-design/icons";
import moment from "moment";
import { useTranslation } from "react-i18next";
import TechDashboardService from "Services/API/Technician/TechDashboardService";
import DoughnutChartThinMobile from "./Components/DoughnutChartThinMobile";
import PlotChart from "./Components/PlotChart";
import AuthService from "Services/AuthService";



const { TabPane } = Tabs;
const { Title, Text } = Typography;

const TechnicianDashboard = (props) => {
  const { t } = useTranslation();
  const dateFormat = "ddd Do MMM YYYY";
  const [spanValue, setSpanValue] = useState(1);
  const [dtStatistic, setData] = useState(null);
  const [rangeValue, setRangeValue] = useState(moment().format(dateFormat));
  const metricStyle = { padding: "10px 0 0 0", fontSize: "15px", fontWeight: "bold" };

  const [technician, setTechnician] = useState();

  const loadData = useCallback(async () => {
    const { data } = await TechDashboardService.GetTechStatistics(spanValue);

    setData(data);
  }, [spanValue]);

  useEffect(() => {
    setTechnician(AuthService.getCurrentTechnician());
    loadData();
  }, [loadData]);

  const handleSpanChange = (e) => {
    setSpanValue(e);
    var currentDate = moment();
    switch (e) {
      case "1":
        setRangeValue(currentDate.format(dateFormat));
        break;
      case "2":
        setRangeValue(
          `${currentDate.clone().startOf("isoWeek").format(dateFormat)}  to ${currentDate
            .endOf("week")
            .format(dateFormat)}`
        );
        break;
      case "3":
        setRangeValue(
          `${currentDate.startOf("month").format(dateFormat)} to ${currentDate.endOf("month").format(dateFormat)}`
        );
        break;
      case "4":
        setRangeValue(
          `${currentDate.startOf("year").format(dateFormat)} to ${currentDate.endOf("year").format(dateFormat)}`
        );
        break;
      default:
        setRangeValue(currentDate.format(dateFormat));
        break;
    }
  };

  if (technician && !technician.is_show_figures)
    return <h3 className="text-primary">You dont have permissions to see revenue statistics</h3>;
  else if (dtStatistic === null)
    return (
      <>
        <Row>
          <Col>
            <Typography>Wait for loading dashboard...</Typography>
          </Col>
        </Row>
      </>
    );
  else
    return (
      <>
        <Row>
          <Col span={24}>
            <Tabs defaultActiveKey="1" onChange={handleSpanChange}>
              <TabPane
                tab={
                  <span>
                    <CalendarOutlined />
                    {t("general_today")}
                  </span>
                }
                key="1"
              ></TabPane>
              <TabPane
                tab={
                  <span>
                    <CalendarOutlined />
                    {t("general_this_week")}
                  </span>
                }
                key="2"
              ></TabPane>
              <TabPane
                tab={
                  <span>
                    <CalendarOutlined />
                    {t("general_this_month")}
                  </span>
                }
                key="3"
              ></TabPane>
              <TabPane
                tab={
                  <span>
                    <CalendarOutlined />
                    {t("general_this_year")}
                  </span>
                }
                key="4"
              ></TabPane>
            </Tabs>
            <Space direction="vertical" size="middle" style={{ display: "flex" }}>
              <Row>
                <Col span={24}>
                  <Title level={4}>{rangeValue}</Title>
                </Col>
              </Row>
              <Row gutter={3}>
                <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12} align="left">
                  <Title level={5}>{t("general_revenue")}</Title>
                  {dtStatistic && dtStatistic.revenue !== undefined ? <PlotChart data={dtStatistic.revenue} /> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}

                </Col>
                <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12} align="left">
                  <Title level={5}>{t("general_total_conver_rate")}</Title>
                  {dtStatistic && dtStatistic.total_converted !== undefined ? <DoughnutChartThinMobile
                    data={dtStatistic.total_converted || []}
                    label={dtStatistic.total_converted || [] ? dtStatistic.total_converted[0].value + "%" : "0%"}
                  /> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}

                </Col>
              </Row>
              <Row>
                <Col span={24} align="center">
                  <Title level={4}>{t("general_employee_metrics")}</Title>
                </Col>
              </Row>
              <Row gutter={3}>
                <Col xs={6} sm={6} md={6} lg={6} xl={6} xxl={6}>
                  <Card align="center" title={t("general_total_jobs")}>
                    <Card.Grid style={{ padding: "0", width: "100%" }}>
                      <Title style={metricStyle}>{dtStatistic?.total_jobs_won}</Title>
                    </Card.Grid>
                  </Card>
                </Col>

                <Col xs={6} sm={6} md={6} lg={6} xl={6} xxl={6}>
                  <Card align="center" title={t("general_total_revenue")}>
                    <Card.Grid style={{ padding: "0", width: "100%" }}>
                      <Title style={metricStyle}>{dtStatistic?.total_sales.toLocaleString('en-AU', { style: "currency", currency: "AUD" })}</Title>
                    </Card.Grid>
                  </Card>
                </Col>

                <Col xs={6} sm={6} md={6} lg={6} xl={6} xxl={6}>
                  <Card align="center" title={t("dashboard_h_average_sales")}>
                    <Card.Grid style={{ padding: "0", width: "100%" }}>
                      <Title style={metricStyle}>{dtStatistic?.average_sales.toLocaleString('en-AU', { style: "currency", currency: "AUD" })}</Title>
                    </Card.Grid>
                  </Card>
                </Col>

                <Col xs={6} sm={6} md={6} lg={6} xl={6} xxl={6}>
                  <Card align="center" title={t("dashboard_job_search_complaints")}>
                    <Card.Grid style={{ padding: "0", width: "100%" }}>
                      <Title style={metricStyle}>{dtStatistic?.total_complaints}</Title>
                    </Card.Grid>
                  </Card>
                </Col>
              </Row>
            </Space>
          </Col>
        </Row>
      </>
    );
};

export default TechnicianDashboard;
