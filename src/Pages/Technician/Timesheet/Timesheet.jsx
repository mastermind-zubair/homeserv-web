import React, { useCallback, useEffect, useState } from "react";
import { Row, Col, Typography, Card, Button, message, Space } from 'antd';
import moment from "moment";
import { useTranslation } from "react-i18next";
import TechTimesheetService from "Services/API/Technician/TechTimesheetService";
import _ from "lodash";

const { Title } = Typography;
const TechnicianTimesheet = (props) => {

  const { t } = useTranslation();
  const dateFormat = "ddd Do MMM YYYY";
  const [dtToday, setTodayData] = useState(null);
  const [dtWeek, setWeekData] = useState(null);
  const [clockStatus, setClockStatus] = useState({});
  const [showHideClockBtn, setShowHideClockBtn] = useState("ClockIn");
  const [btnStatus, setBtnStatus] = useState(false);
  const params = {
    "entry_date": `${moment().format("YYYY-MM-DD")}`
  }
  const loadTodayData = useCallback(async () => {

    const { data } = await TechTimesheetService.GetTechTimeSheet("today", params);
    setTodayData(data);
  }, []);

  const loadWeekData = useCallback(async () => {

    const { data } = await TechTimesheetService.GetTechTimeSheet("week", params);
    setWeekData(data);

  }, []);

  const loadClockInStatus = useCallback(async () => {

    const { data } = await TechTimesheetService.GetTechClockInStatus(params);
    setClockStatus(data);
    if (_.isEmpty(data)) {
      setShowHideClockBtn("ClockIn");
    }
    else if (data.time_out === null && data.time_in !== null) {
      setShowHideClockBtn("ClockOut");
    } else if (data.time_out !== null && data.time_in !== null) {
      setShowHideClockBtn("ClockIn");
      setBtnStatus(true);
    } else if (data.time_in !== null) {
      setShowHideClockBtn("ClockOut");
    }

  }, []);

  const handleClockInOut = async (clockStatus) => {

    let { data } = await
      TechTimesheetService.updateTechClockInOut(clockStatus, params);
    setTodayData(data);

    if (data.time_out === null || data.time_out === undefined) {
      setShowHideClockBtn("ClockOut");
      message.info('Clocked In successfully.');
    } else {
      setShowHideClockBtn("ClockIn");
      setBtnStatus(true);
      message.info('Clocked Out successfully.');
      loadWeekData();
    }
  };

  useEffect(() => {
    loadTodayData();
    loadWeekData();
    loadClockInStatus();
  }, []);




  return (
    <>
      {
        dtToday && dtWeek !== null ? (

          <Row >
            <Col span={24}>

              <Row>
                <Col
                  xs={8}
                  sm={8}
                  md={8}
                  lg={8}
                  xl={8}
                  xxl={8} align="left">
                  <Title level={4}>{t("tech_app_nav_timesheet")}</Title>
                </Col>
                <Col
                  xs={8}
                  sm={8}
                  md={8}
                  lg={8}
                  xl={8}
                  xxl={8} align="center">
                  <Title level={5}>{moment().format("MMM YYYY")}</Title>

                </Col>
                <Col
                  xs={8}
                  sm={8}
                  md={8}
                  lg={8}
                  xl={8}
                  xxl={8} align="right">
                  {showHideClockBtn === 'ClockIn' ?
                    <Button type="primary" onClick={() => handleClockInOut("in")} disabled={btnStatus ? true : false} >
                      {t("tech_app_nav_time_clock_in")}
                    </Button>
                    :
                    <Button type="primary" danger onClick={() => handleClockInOut("out")}>
                      {t("tech_app_nav_time_clock_out")}
                    </Button>}
                </Col>
              </Row>
              <Space span={24} direction="vertical" size="small" style={{ display: 'flex' }}>
                <Row style={{ marginTop: 10 }}>

                  <Col span={24} align="left" >

                    <Card align="center" title={t("general_today")} extra={<b>{moment().format(dateFormat)}</b>}  >

                      <Card.Grid style={{ width: "15%", backgroundColor: "#eee" }}>{t("general_start")}</Card.Grid>
                      <Card.Grid style={{ width: "18%" }}>{dtToday.time_in_full !== undefined ? moment(dtToday?.time_in_full).utc(true).format("HH:mm") : "0:00"}</Card.Grid>
                      <Card.Grid style={{ width: "15%", backgroundColor: "#eee" }}>{t("general_end")}</Card.Grid>
                      <Card.Grid style={{ width: "18%" }}>{dtToday.time_out_full !== null && dtToday.time_out_full !== undefined ? moment(dtToday?.time_out_full).utc(true).format("HH:mm") : "0:00"}</Card.Grid>
                      <Card.Grid style={{ width: "15%", backgroundColor: "#eee" }}>{t("dashboard_job_search_total")}</Card.Grid>
                      <Card.Grid style={{ width: "19%" }}>{!isNaN(dtToday?.total_minutes) ? ('0' + Math.floor(dtToday?.total_minutes / 60)).slice(-2) + ':' + ('0' + dtToday?.total_minutes % 60).slice(-2) : "0:00"}</Card.Grid>

                    </Card>
                  </Col>

                </Row>

                <Row style={{ marginTop: 30 }}>

                  <Col span={24} align="left" >

                    <Card style={{ padding: 0, width: "100%" }} align="center" title={t("general_this_week")}  >
                      <Card.Grid style={{ width: "23%", backgroundColor: "#eee" }}>{t("general_days_date")}</Card.Grid>

                      {dtWeek.map((item, index) => {
                        return <Card.Grid key={item.day} style={{ width: "11%", backgroundColor: "#eee" }}>{moment(item.day).format("ddd D")}</Card.Grid>
                      })}

                    </Card>
                    <Card style={{ padding: 0, width: "100%" }} align="center" title=""  >
                      <Card.Grid style={{ width: "23%", paddingLeft: "5px" }}>Tot. Hours</Card.Grid>
                      {dtWeek.map((item, index) => {
                        return <Card.Grid key={item.day + index} style={{
                          width: "11%", paddingLeft: "5px"
                        }}>{!isNaN(item.total_minutes) ? ('0' + Math.floor(item.total_minutes / 60)).slice(-2) + ':' + ('0' + item.total_minutes % 60).slice(-2) : "0:00"}</Card.Grid>
                      })}

                    </Card>
                  </Col>

                </Row>
              </Space>
            </Col>
          </Row >

        ) : (
          <Row>
            <Col>
              <Typography>Wait for loading timesheet...</Typography>
            </Col>
          </Row>
        )
      }
    </>)
}


export default TechnicianTimesheet;
