import React, { useCallback, useEffect, useState, useContext } from "react";
import {
  Col,
  Row,
  Statistic,
  Typography,
  Card,
  Radio,
  DatePicker,
  Space,
  Button,
} from "antd";
import { DollarOutlined, FileDoneOutlined } from "@ant-design/icons";
import moment from "moment";
import AreaChart from "./Components/AreaChart";
import DoughnutChartThin from "./Components/DoughnutChartThin";
import MultipleAreaChart from "./Components/MultipleAreaChart";
import DefaultService from "Services/API/DefaultService";
import GMapArea from "./Components/GMapArea";
import Context from "Store/Context";
import { useTranslation } from "react-i18next";
import environment from "../../../Environment";

const Dashboard = (props) => {
  const dateFormat = "DD/MM/YYYY";
  const [rangeValue, setRangeValue] = useState([moment(), moment()]);
  const [Data, setData] = useState(null);
  const [Filter, setFilter] = useState("1");
  const [enableCustom, setEnableCustom] = useState(false);
  const { curOrg: organisation } = useContext(Context);

  const loadData = useCallback(async (organisation_id, time_span, range) => {
    const { data } = await DefaultService.GetStatistics(
      organisation_id,
      time_span,
      range[0].format(environment.API_DATE_FORMAT),
      range[1].format(environment.API_DATE_FORMAT)
    );
    setData(data);
  }, []);

  useEffect(() => {
    if (organisation) {
      loadData(organisation.id, Filter, rangeValue);
    }
  }, [loadData, organisation]);

  const handleSearch = async () => {
    console.log("handleSearch");
    if (organisation) {
      loadData(organisation.id, Filter, rangeValue);
    }
  }

  const handleRangeChange = (value) => {
    setRangeValue(value);
  };
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
      case "4":
        var start_day = moment(organisation.financial_year_start).format('DD-MM');
        var start_year = moment().format('YYYY');        
        
        var start = moment(`${start_day}-${start_year}`, 'DD-MM-YYYY');
        var end = moment(`${start_day}-${start_year}`, 'DD-MM-YYYY').add(1, 'years');
        var diff = moment().diff(start, 'days');

        if(diff < 0){
          start = start.add(-1, 'years');
          end = end.add(-1, 'years').add(-1, 'days');
        }
        setRangeValue([start, end]);
        break;
      default:
        break;
    }
  };
  const { t } = useTranslation();
  const handleFilterChange = async (e) => {
    setFilter(e.target.value);
    buildFilter(e.target.value);
    setEnableCustom(e.target.value === "5");
  };
  if (Data === null)
    return (
      <>
        <Row>
          <Col>
            <Typography>
              {" "}
              {t("dashboard_wait_for_loading_dashboard")}{" "}
            </Typography>
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
                <Radio.Button value="5">{t("general_custom_dates")}</Radio.Button>
              </Radio.Group>
            </Col>
            {enableCustom && (
            <Col>
              <DatePicker.RangePicker disabled={!enableCustom} value={rangeValue} format={dateFormat} onChange={handleRangeChange} />
            </Col>
            )}
            <Col>
              <Button onClick={handleSearch}>Search</Button>
            </Col>
          </Row>
          <Row gutter={5}>
            <Col span={6}>
              <Card title={t("dashboard_h_total_booked_jobs")}>
                <Row>
                  <Col span={24}>
                    <Statistic
                      value={Data.total_booked_jobs.reduce(
                        (pv, cv) => pv + +cv.value,
                        0
                      )}
                      prefix={<FileDoneOutlined />}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <AreaChart
                      data={Data.total_booked_jobs || []}
                      xField={"timePeriod"}
                      yField={"value"}
                    />
                  </Col>
                </Row>
              </Card>
            </Col>
            <Col span={6}>
              <Card title={t("dashboard_h_average_sales")}>
                <Row>
                  <Col span={24}>
                    <Statistic
                      value={Data.average_sales.reduce(
                        (pv, cv) => Math.round(pv + +cv.value),
                        0
                      )}
                      prefix={<DollarOutlined />}
                      suffix
                    />
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    {Data.average_sales && (
                      <AreaChart
                        data={Data.average_sales || []}
                        xField={"timePeriod"}
                        yField={"value"}
                      />
                    )}
                  </Col>
                </Row>
              </Card>
            </Col>
            <Col span={4}>
              <Card title={t("dashboard_h_total_jobs_won")}>
                <Row>
                  <Col span={24}>
                    <DoughnutChartThin
                      data={Data.total_jobs_won || []}
                      label={
                        Data.total_jobs_won.length === 0
                          ? 0
                          : Data.total_jobs_won[0].value
                      }
                    />
                  </Col>
                </Row>
              </Card>
            </Col>
            <Col span={4}>
              <Card title={t("dashboard_h_total_conversion")}>
                <Row>
                  <Col span={24}>
                    <DoughnutChartThin
                      data={Data.total_converted || []}
                      label={`${
                        Data.total_converted.length === 0
                          ? 0
                          : Data.total_converted[0].value
                      }%`}
                    />
                  </Col>
                </Row>
              </Card>
            </Col>
            <Col span={4}>
              <Card title={t("dashboard_h_job_tags_distribution")}>
                <Row>
                  <Col span={24}>
                    <DoughnutChartThin
                      data={Data.industry_wise || []}
                      label={Data.industry_wise.reduce(
                        (pv, cv) => pv + cv.value,
                        0
                      )}
                    />{" "}
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
          <Row gutter={5}>
            <Col span={12}>
              <Card title={t("dashboard_h_expense_and_revenue")}>
                <Row gutter={5}>
                  <Col span={24}>
                    <MultipleAreaChart data={Data.expense_revenue || []} />
                  </Col>
                </Row>
              </Card>
            </Col>
            <Col span={12}>
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
