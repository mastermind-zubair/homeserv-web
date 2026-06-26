import React, { useMemo, useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import _ from "lodash";
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import useResponsiveFontSize from "Layout/useResponsiveFontSize";
import { trackPromise } from "react-promise-tracker";
import { Row, Col, Typography, Card, Button, Tabs, InputNumber } from "antd";
import TechJobService from "Services/API/Technician/TechJobService";
import SvApiUploaderJob from "Components/Common/SvApiUploaderJob";
import environment from "Environment";
import { useTranslation } from "react-i18next";
import AuthService from "Services/AuthService";
import { notify } from "Services/ToastService";
import DefaultService from "Services/API/DefaultService";
import { formatCurrency } from "Lib/JsHelper";

const { TabPane } = Tabs;
const { Title } = Typography;
const user = AuthService.getCurrentTechnician();
const ORGANISATION_ID = user ? user.organisation_id : 0;
const TECH_ID = user ? user.id : 0;
const useOptions = () => {
  const fontSize = useResponsiveFontSize();
  const options = useMemo(
    () => ({
      style: {
        base: {
          fontSize,
          color: "#424770",
          letterSpacing: "0.025em",
          fontFamily: "Source Code Pro, monospace",
          "::placeholder": {
            color: "#aab7c4",
          },
        },
        invalid: {
          color: "#9e2146",
        },
      },
    }),
    [fontSize]
  );

  return options;
};

const CardForm = (props) => {
  let history = useHistory();
  let { jid } = useParams();
  const { t } = useTranslation();
  const stripe = useStripe();
  const elements = useElements();
  const options = useOptions();
  const [job, setJob] = useState(props.dtJob);
  const [jobAmount, setJobAmount] = useState();
  const [jobAmountPaid, setJobAmountPaid] = useState(0);
  const [buttonDisable, setButtonDisable] = useState(false);

  useEffect(() => {
    new Promise(async (resolve, reject) => {
      const { data } = await TechJobService.GetTechJob(jid);
      let jobAmountPaid = 0;
      if (props.nextStep === "close") {
        jobAmountPaid = data?.job_priority.fee;
      } else {
        jobAmountPaid = _.round(
          _.sumBy(data?.invoices[0]?.payments, function (o) {
            return o.amount;
          }),
          2
        );
      }

      setJobAmountPaid(jobAmountPaid);
      setJob(data);
      resolve(data);
    });
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      if (Number(jobAmount) <= 0) {
        return notify("Amount is too small", false);
      }
      setButtonDisable(true);
      if (
        Number(jobAmount) >
        Number((job.invoices[0]?.total - jobAmountPaid).toFixed(2))
      ) {
        return notify("Payment amount must be equal to balance due", false);
      }

      if (!stripe || !elements) {
        return;
      }

      const payload = await stripe.createPaymentMethod({
        type: "card",
        card: elements.getElement(CardNumberElement),
        billing_details: {
          name: job?.customer?.full_name,
        },
      });
      const paymentError = payload.error;

      //console.log("PaymentMethod", payload);

      if (paymentError) {
        notify(paymentError.message, false);
      } else {
        const { status, message } = await trackPromise(
          DefaultService.POST(`/job/f_t/charge`, {
            job_id: job.id,
            payment_id: payload.paymentMethod?.id,
            amount: jobAmount * 100,
          })
        );
        if (!status) {
          return notify(message, false);
        }

        if (
          Number(jobAmount) ===
          Number((job.invoices[0]?.total - jobAmountPaid).toFixed(2))
        ) {
          await trackPromise(
            DefaultService.PUT(`/job/f_t/payment_received/${job.id}`, {
              field_technician_id: TECH_ID,
            })
          );
        }

        await trackPromise(
          DefaultService.POST(`/payment`, {
            organisation_id: ORGANISATION_ID,
            job_id: job.id,
            invoice_id: job?.invoices[0]?.id,
            amount: jobAmount,
            payment_method: "CREDIT CARD",
            payment_status: "PAID",
            //"payment_image": "base64 encoded image",
            is_active: true,
          })
        );

        //console.log("props", props, props.nextStep);
        notify(`Job payment Received successfully`, true);
        if (props.nextStep === "job") {
          history.push({
            pathname: `/technician/jobs/job-start-work/${jid}`,
            //dtJob: job
          });
        } else if (props.nextStep === "close") {
          history.push({
            pathname: `/technician/jobs/job-close-notes/${jid}`,
            //dtJob: job
          });
        } else {
          history.push({
            pathname: `/technician/jobs/job-notes/${jid}`,
            dtJob: job,
          });
        }
      }
    } catch (error) {
      notify(error.message, false);
    } finally {
      setButtonDisable(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      id="form-payment"
      autoComplete="off"
      className="ant-form ant-form-vertical ant-form-middle"
    >
      <Card
        gutter={5}
        title={
          <>
            <Title level={5}>{t("general_card_details")}</Title>
          </>
        }
      >
        <Row>
          <Col span={24}>
            <span className="text-center">
              <Title level={5}>
                {t("general_balance_due")}{" "}
                <span className="text-danger ml-5">
                  <b>
                    {props.nextStep === "close"
                      ? formatCurrency(jobAmountPaid)
                      : job.invoices[0] &&
                        formatCurrency(job.invoices[0]?.total - jobAmountPaid)}
                  </b>
                </span>
              </Title>
            </span>
          </Col>

          {/* <Col span={24} style={{ marginTop: "20px", marginBottom: "20px" }}>
            Test Credit Card (4242424242424242 Expiry any future date)
          </Col> */}

          <Col span={24}>
            <div className="ant-row ant-form-item">
              <div className="ant-col ant-form-item-label">
                <label className="ant-form-item-required" title="Card Number">
                  {t("general_card_number")}
                </label>
              </div>
              <div className="ant-col ant-form-item-control">
                <div className="ant-form-item-control-input">
                  <div className="ant-form-item-control-input-content">
                    <CardNumberElement options={options} />
                  </div>
                </div>
              </div>
              <div className="ant-col ant-form-item-label">
                <label
                  className="ant-form-item-required"
                  title="Expiration Date"
                >
                  {t("general_expiration_date")}
                </label>
              </div>
              <div className="ant-col ant-form-item-control">
                <div className="ant-form-item-control-input">
                  <div className="ant-form-item-control-input-content">
                    <CardExpiryElement options={options} />
                  </div>
                </div>
              </div>
              <div className="ant-col ant-form-item-label">
                <label className="ant-form-item-required" title="CVC">
                  {t("general_cvc")}
                </label>
              </div>
              <div className="ant-col ant-form-item-control">
                <div className="ant-form-item-control-input">
                  <div className="ant-form-item-control-input-content">
                    <CardCvcElement options={options} />
                  </div>
                </div>
              </div>
            </div>
            {/* <CardElement
              options={options}
              onReady={() => {
                // console.log("CardElement [ready]");
              }}
              onChange={event => {
                //console.log("CardElement [change]", event);
              }}
              onBlur={() => {
                //console.log("CardElement [blur]");
              }}
              onFocus={() => {
                //console.log("CardElement [focus]");
              }} />*/}
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Title level={5}>{t("general_payment_amount")} </Title>{" "}
            <InputNumber
              required
              style={{ width: "100%" }}
              addonBefore="$"
              onChange={(e) => {
                setJobAmount(e);
              }}
            />
          </Col>
        </Row>
        <Row style={{ marginTop: "20px" }}>
          <Col span={12}>
            <Button
              type="primary"
              className="ant-btn-lg"
              style={{ width: "90%" }}
              htmlType="submit"
              disabled={!stripe || buttonDisable}
            >
              {t("general_charge")}
            </Button>
          </Col>{" "}
          <Col span={12}>
            <Button
              type="danger"
              className="ant-btn-lg"
              style={{ width: "90%" }}
              onClick={() => {
                if (props.nextStep === "job") {
                  history.push({
                    pathname: `/technician/jobs/job-start-work/${jid}`,
                    //dtJob: job,
                  });
                } else if (props.nextStep === "close") {
                  history.push({
                    pathname: `/technician/jobs/job-close-notes/${jid}`,
                    //dtJob: job
                  });
                } else {
                  history.push({
                    pathname: `/technician/jobs/job-notes/${job.id}`,
                    dtJob: job,
                  });
                }
              }}
            >
              {t("quick_setup_organizations_modal_button_cancel")}
            </Button>
          </Col>
        </Row>
      </Card>
    </form>
  );
};

const Job_Payment = (props) => {
  let history = useHistory();
  let { jid } = useParams();
  const { t } = useTranslation();

  const { nextStep } = props.location;
  const [job, setJob] = useState(null);
  const [jobAmountPaid, setJobAmountPaid] = useState(0);
  const [spanValue, setSpanValue] = useState("1");
  const [jobAmount, setJobAmount] = useState();
  const [paymentType, setPaymentType] = useState("CREDIT CARD");
  const [dtPaymentPic, setPaymentPic] = useState([]);
  const [stripePromise, setStripePromise] = useState();
  const [buttonDisable, setButtonDisable] = useState(false);

  function fetchData() {
    console.log("props", props);
    return new Promise(async (resolve, reject) => {
      if (!jid) {
        return history.push("/technician/jobs/");
      }
      const { data } = await TechJobService.GetTechJob(jid);
      setJob(data);
      resolve(data);
    });
  }

  useEffect(() => {
    fetchData().then(async (data) => {
      let jobAmountPaid = 0;
      if (nextStep === "close") {
        jobAmountPaid = data?.job_priority.fee;
      } else {
        jobAmountPaid = _.round(
          _.sumBy(data?.invoices[0]?.payments, function (o) {
            return o.amount;
          }),
          2
        );
      }
      setJobAmountPaid(jobAmountPaid);
      const { data: apiKeys } = await trackPromise(
        DefaultService.GET(`/payment_gateway/f_t/stripe/${ORGANISATION_ID}`)
      );
      //console.log('apiKeys', apiKeys);
      setStripePromise(loadStripe(apiKeys));
    });
    window.scrollTo(0, 0);
  }, []);

  const handleSpanChange = (e) => {
    setSpanValue(e);

    switch (e) {
      case "1":
        setPaymentType("CREDIT CARD");
        break;
      case "2":
        setPaymentType("CASH");
        break;
      case "3":
        setPaymentType("CHEQUE");
        break;
      case "4":
        setPaymentType("EFT");
        break;
      default:
        setPaymentType("CREDIT CARD");
        break;
    }
  };

  const handlePayment = async (event) => {
    event.preventDefault();

    try {
      if (Number(jobAmount) <= 0) {
        return notify("Amount is too small", false);
      }
      setButtonDisable(true);

      if (
        Number(jobAmount) >
        Number((job.invoices[0]?.total - jobAmountPaid).toFixed(2))
      ) {
        return notify("Payment amount must be equal to balance due", false);
      }

      if (dtPaymentPic.length === 0) {
        return notify(`Payment image is missing`, false);
      }

      if (
        Number(jobAmount) ===
        Number((job.invoices[0]?.total - jobAmountPaid).toFixed(2))
      ) {
        await trackPromise(
          DefaultService.PUT(`/job/f_t/payment_received/${job.id}`, {
            field_technician_id: TECH_ID,
          })
        );
      }

      await trackPromise(
        DefaultService.POST(`/payment`, {
          organisation_id: ORGANISATION_ID,
          job_id: job.id,
          invoice_id: job?.invoices[0]?.id,
          amount: jobAmount,
          payment_method: paymentType,
          payment_status: "PAID",
          payment_image: dtPaymentPic[0].file_path,
          is_active: true,
        })
      );

      notify(`Job payment Received successfully`, true);

      if (props.location.nextStep === "job") {
        history.push({
          pathname: `/technician/jobs/job-start-work/${jid}`,
          //dtJob: job
        });
      } else if (props.location.nextStep === "close") {
        history.push({
          pathname: `/technician/jobs/job-close-notes/${jid}`,
          //dtJob: job
        });
      } else {
        history.push({
          pathname: `/technician/jobs/job-notes/${jid}`,
          dtJob: job,
        });
      }
    } catch (error) {
      notify(error.message, false);
    } finally {
      setButtonDisable(true);
    }
  };

  const uploadPaymentPic = async (picture) => {
    //console.log('picture', picture);
    await TechJobService.uploadPicJobPicture(picture);
    let pictures = [];
    pictures.push({
      file_path: picture.file_path,
      url: environment.PATH_PAYMENT + "/" + picture.file_path,
      thumbUrl: environment.PATH_PAYMENT + "/" + picture.file_path,
    });
    setPaymentPic(pictures);
    notify(`Payment picture uploaded successfully`, true);
  };

  const deletePaymentPicture = async (id) => {
    setPaymentPic([]);
    notify(`Payment picture deleted successfully`, true);
  };

  if (job === null)
    return (
      <>
        <Row>
          <Col span={24}>
            <Title level={4}>{t("general_add_payment")}</Title>
          </Col>
        </Row>
        <Row>
          <Col>
            <Typography>{t("general_wait_for_job_payment_details")}</Typography>
          </Col>
        </Row>
      </>
    );
  else
    return (
      <>
        <Row>
          <Col span={24}>
            <Title level={4}>{t("general_add_payment")}</Title>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Tabs
              defaultActiveKey="1"
              size="Large"
              style={{
                marginBottom: 32,
              }}
              onChange={handleSpanChange}
            >
              <TabPane tab={<span>Credit Card</span>} key="1"></TabPane>
              <TabPane tab={<span>Cash</span>} key="2"></TabPane>
              <TabPane tab={<span>Cheque</span>} key="3"></TabPane>
              <TabPane tab={<span>EFT</span>} key="4"></TabPane>
            </Tabs>
            {spanValue === "1" && stripePromise ? (
              <Elements stripe={stripePromise}>
                <CardForm dtJob={job} nextStep={nextStep} />
              </Elements>
            ) : (
              <form onSubmit={handlePayment}>
                <Card
                  gutter={5}
                  title={
                    <>
                      <Title level={5}>{t("general_record_payment")}</Title>
                    </>
                  }
                >
                  <Row>
                    <Col span={24}>
                      <span className="text-center">
                        <Title level={5}>
                          {t("general_balance_due")}{" "}
                          <span className="text-danger ml-5">
                            <b>
                              {nextStep === "close"
                                ? formatCurrency(jobAmountPaid)
                                : job.invoices[0] &&
                                  formatCurrency(
                                    job.invoices[0]?.total - jobAmountPaid
                                  )}
                            </b>
                          </span>
                        </Title>
                      </span>
                    </Col>
                  </Row>
                  <Card
                    gutter={5}
                    title={
                      <>
                        <Title level={5}>
                          {t("general_upload_image")}
                          <span style={{ fontSize: "9px", color: "#D46874" }}>
                            (only jpeg,png,bmp allowed)
                          </span>
                        </Title>
                      </>
                    }
                  >
                    <Row>
                      <Col span={24}>
                        <SvApiUploaderJob
                          endpoint={`${environment.API.BASE_URL}${environment.API.VERSION}/upload/payment`}
                          fileType="picture"
                          fileList={dtPaymentPic}
                          multiple={false}
                          maxCount={1}
                          sizeLimit={20}
                          onFileUploaded={({ name, path, size, mimetype }) => {
                            let uploadedFile = {};
                            uploadedFile.organisation_id = ORGANISATION_ID;
                            uploadedFile.job_id = job.id;
                            uploadedFile.type = "PAYMENT";
                            uploadedFile.payment_method = paymentType;
                            uploadedFile.payment_status = "PAID";
                            uploadedFile.number = 1;
                            uploadedFile.file = name;
                            uploadedFile.file_path = path;
                            uploadedFile.file_size = size;
                            uploadedFile.mime_type = mimetype;
                            uploadedFile.is_active = true;
                            uploadedFile.invoice_id = job?.invoices[0]?.id;
                            uploadedFile.amount = 0;
                            uploadPaymentPic(uploadedFile);
                          }}
                          onRemove={(file) => {
                            deletePaymentPicture(file.id);
                          }}
                        />
                      </Col>
                    </Row>
                  </Card>
                  <Row style={{ marginTop: "20px" }}>
                    <Col span={24}>
                      <Title level={5}>{t("general_payment_amount")} </Title>{" "}
                      <InputNumber
                        required
                        style={{ width: "100%" }}
                        addonBefore="$"
                        onChange={(e) => {
                          setJobAmount(e);
                        }}
                      />
                    </Col>
                  </Row>
                  <Row style={{ marginTop: "20px" }}>
                    <Col span={12}>
                      <Button
                        type="primary"
                        className="ant-btn-lg"
                        style={{ width: "90%" }}
                        htmlType="submit"
                      >
                        {t("general_save_record")}
                      </Button>
                    </Col>{" "}
                    <Col span={12}>
                      <Button
                        type="danger"
                        className="ant-btn-lg"
                        style={{ width: "90%" }}
                        onClick={() => {
                          if (props.nextStep === "job") {
                            history.push({
                              pathname: `/technician/jobs/job-start-work/${jid}`,
                              //dtJob: job,
                            });
                          } else {
                            history.push({
                              pathname: `/technician/jobs/job-notes/${job.id}`,
                              dtJob: job,
                            });
                          }
                        }}
                      >
                        {t("quick_setup_organizations_modal_button_cancel")}
                      </Button>
                    </Col>
                  </Row>
                </Card>
              </form>
            )}
          </Col>
        </Row>
      </>
    );
};

export default Job_Payment;
