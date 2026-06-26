import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import dashSnapshot from "assets/images/landing/dash-snapshot.png";
import aws_logo from "assets/images/landing/aws.png";
import xero_logo from "assets/images/landing/xero.png";
import myob_logo from "assets/images/landing/myob.png";
import quickbooks_logo from "assets/images/landing/quickbooks.png";
import AuthService from "Services/AuthService";
import { Row, Col, Image, Card, Typography } from "antd";

import Search from "antd/lib/input/Search";
import DefaultService from "Services/API/DefaultService";
import { notify } from "Services/ToastService";
import { trackPromise } from "react-promise-tracker";
import { validateEmail } from "Lib/JsHelper";
const { Title } = Typography;

// const { Header, Content, Footer } = Layout;

const Landing = () => {
  const { t } = useTranslation();
  // const onMenuClick = (name) => setToggle(toggle === name ? "" : name);

  useEffect(() => {
    AuthService.logout();
    return () => {
      //cleanup
    };
  }, []);

  const handleEarlyAccess = async (email) => {
    console.log(email);
    let msg = "";
    let isValid = true;

    if (!email) {
      isValid = false;
      msg = "Please provide your email";
    }
    if (!validateEmail(email)) {
      isValid = false;
      msg = "Email is not in correct format. Please provide a valid email address";
    }

    if (!isValid) {
      notify(msg, isValid);
    }

    if (isValid) {
      const { status } = await trackPromise(DefaultService.Subscribe(email));
      notify("Your request for an early access has been submitted. We will contact you soon", status, 4000);
    }
  };
  return (
    <>
      <Row>
        <Col xl={24} xs={24}>
          <div className="">
            <Card className="box bg-grey" style={{ width: "100%", textAlign: "center" }}>
              <Title level={1} style={{ fontWeight: "bold", color: "#888" }}>
                { t('landing_launching_soon') }
              </Title>

              <Title level={2}> { t('landing_streamlined_operations') }</Title>

              <Title level={4}> { t('landing_main_text_line_1') }</Title>

              <Title level={4}>
                { t('landing_main_text_line_2') }
              </Title>
            </Card>
          </div>
          ,
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xl={12} xs={24}>
          <Image src={dashSnapshot} className="box" />
        </Col>

        <Col xl={12} xs={24}>
          <Row wrap justify gutter={[16, 24]}>
            <Col span={12}>
              <Card title={ t('landing_panel_multi_language_title') } className="box fill-height">
                { t('landing_panel_multi_language_message') }
              </Card>
            </Col>

            <Col span={12}>
              <Card title={ t('landing_panel_price_book_title') } className="box fill-height">
                { t('landing_panel_price_book_message') }
              </Card>
            </Col>

            <Col span={12}>
              <Card title={ t('landing_panel_reporting_title') } className="box fill-height">
                { t('landing_panel_reporting_message') }
              </Card>
            </Col>

            <Col span={12}>
              <Card title={ t('landing_panel_inventory_title') } className="box fill-height">
                { t('landing_panel_inventory_message') }
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>

      <Row gutter={[16, 16]} align="middle" style={{ marginTop: "15px" }}>
        <Col xl={12} xs={24}>
          <Search
            placeholder={ t('landing_early_access_placeholder') }
            enterButton={ t('landing_early_access_enter') }
            size="large"
            onSearch={handleEarlyAccess}
          />
        </Col>

        <Col xl={12} xs={24}>
          <Row gutter={[16, 16]}>
            <Col span={6}>
              <img alt='aws_logo' src={aws_logo} style={{ width: "75%", marginTop: "20px" }} />
            </Col>
            <Col span={6}>
              <img alt='xero_logo' src={xero_logo} style={{ width: "75%", marginTop: "20px" }} />
            </Col>
            <Col span={6}>
              <img alt='myob_logo' src={myob_logo} style={{ width: "75%", marginTop: "20px" }} />
            </Col>
            <Col span={6}>
              <img alt='quickbooks_logo' src={quickbooks_logo} style={{ width: "75%", marginTop: "20px" }} />
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
};
export default Landing;
