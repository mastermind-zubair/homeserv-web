import { useEffect, useContext, useState, useMemo } from "react";
import Context from "Store/Context";
import {
  useStripe, useElements, CardNumberElement,
  CardCvcElement,
  CardExpiryElement
} from "@stripe/react-stripe-js";
import { trackPromise } from "react-promise-tracker";
import DefaultService from "Services/API/DefaultService";
import { notify } from "Services/ToastService";
import { Row, Col, Typography, Card, Button, InputNumber, Modal } from "antd";
import useResponsiveFontSize from "Layout/useResponsiveFontSize";
import { formatCurrency } from "Lib/JsHelper";
import _ from "lodash";
import { t } from "i18next";
import AuthService from "Services/AuthService";

const { Title } = Typography;
const user = AuthService.getCurrentUser();
const ADMIN_ID = user ? user.id : 0;

const Form_CreditCardPayment = ({
  form,
  showForm,
  recordToEdit,
  handleCancel,
  onFinish,
  onFinishFailed,
  onStatusChanged,
  exportToAccountingSoftware,
  dateFormat,
  ENTITY,
  data,
}) => {


  const [job, setJob] = useState();
  const [jobAmount, setJobAmount] = useState();
  const [jobAmountPaid, setJobAmountPaid] = useState(0);
  const [buttonDisable, setButtonDisable] = useState(false);
  const options = useOptions();
  const stripe = useStripe();
  const elements = useElements();
  const { curOrg: organisation } = useContext(Context);

  useEffect(() => {
    console.info('recordToEdit', recordToEdit);
    new Promise(async (resolve, reject) => {

      const { data } = await await trackPromise(
        DefaultService.GET(`/job/${recordToEdit.job_id}`));

      let jobAmountPaid = _.round(
        _.sumBy(data?.invoices[0]?.payments, function (o) {
          return o.amount;
        }),
        2
      );
      setJobAmountPaid(jobAmountPaid)
      setJob(data);
      resolve(data);
    })
  }, [recordToEdit]);

  const handleSubmit = async event => {
    event.preventDefault();

    try {

      if (Number(jobAmount) !== Number((job.invoices[0].total - jobAmountPaid).toFixed(2))) {
        return notify('Payment amount must be equal to balance due', false);
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
      }
      else {
        const { status, message } = await trackPromise(
          DefaultService.POST(`/job/charge`, {
            "job_id": job.id,
            "payment_id": payload.paymentMethod?.id,
            "amount": jobAmount * 100
          })
        );
        if (!status) {
          return notify(message, false);
        }


        await trackPromise(
          DefaultService.POST(`/payment`, {
            "user_id": ADMIN_ID,
            "organisation_id": organisation.id,
            "job_id": job.id,
            "invoice_id": job?.invoices[0].id,
            "amount": jobAmount,
            "payment_method": "CREDIT CARD",
            "payment_status": "PAID",
            "is_active": true
          })
        );

        //console.log("props", props, props.nextStep);
        notify(`Job payment Received successfully`, true);
        handleCancel();
      }

    } catch (error) {
      notify(error.message, false);
    }

  };


  return (
    job ? (
      <Modal
        title="Credit Card Details"
        visible={showForm}
        width={768}
        onOk={handleCancel}
        onCancel={handleCancel}
        footer={
          <div className="flex">
            <Button danger type="dashed" onClick={handleCancel} className="ml-auto">
              {t("quick_setup_organizations_modal_button_cancel")}
            </Button>

          </div>
        }
      >
        {job && (
          <form onSubmit={handleSubmit} id="form-payment" autoComplete="off" className="ant-form ant-form-vertical ant-form-middle">
            <Card
              gutter={5}
              title={<><Title level={5}>Credit Card Details</Title></>}
            >

              <Row >
                <Col span={24}>
                  <span className="text-center">
                    <Title level={5}>Balance Due <span className="text-danger ml-5"><b>{job.invoices[0] && formatCurrency(job.invoices[0].total - jobAmountPaid)}</b></span></Title>
                  </span>

                </Col>

                {/* <Col span={24} style={{ marginTop: "20px", marginBottom: "20px" }}>
                Test Credit Card (4242424242424242 Expiry any future date)
              </Col> */}

                <Col span={24}>
                  <div className="ant-row ant-form-item">
                    <div className="ant-col ant-form-item-label">
                      <label className="ant-form-item-required" title="Card Number">Card Number</label>
                    </div>
                    <div className="ant-col ant-form-item-control">
                      <div className="ant-form-item-control-input">
                        <div className="ant-form-item-control-input-content">
                          <CardNumberElement
                            options={options}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="ant-col ant-form-item-label">
                      <label className="ant-form-item-required" title="Expiration Date">Expiration Date</label>
                    </div>
                    <div className="ant-col ant-form-item-control">
                      <div className="ant-form-item-control-input">
                        <div className="ant-form-item-control-input-content">
                          <CardExpiryElement
                            options={options}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="ant-col ant-form-item-label">
                      <label className="ant-form-item-required" title="CVC">CVC</label>
                    </div>
                    <div className="ant-col ant-form-item-control">
                      <div className="ant-form-item-control-input">
                        <div className="ant-form-item-control-input-content">
                          <CardCvcElement
                            options={options}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <Title level={5}>Payment Amount </Title>{" "}
                  <InputNumber required style={{ width: "100%" }} addonBefore="$" onChange={(e) => { setJobAmount(e) }} />

                </Col>
              </Row>
              <Row style={{ marginTop: "20px" }}>
                <Col span={12} >
                  <Button className="bg-success ant-col ant-col-24" htmlType="submit" disabled={!stripe || buttonDisable}>
                    Charge
                  </Button>
                </Col> <Col span={12} >
                  <Button className="bg-danger ant-col ant-col-24" onClick={() => {
                    handleCancel()
                  }}>
                    Cancel
                  </Button>
                </Col>
              </Row>

            </Card>
          </form >
        )}
      </Modal>
    ) : ""
  );
};


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
            color: "#aab7c4"
          }
        },
        invalid: {
          color: "#9e2146"
        }
      }
    }),
    [fontSize]
  );

  return options;
};
export default Form_CreditCardPayment;
