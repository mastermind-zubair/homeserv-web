import { Badge, Button, Card, Col, Modal, Row, Space, Typography } from "antd";
import _ from "lodash";
import { useEffect, useState, useRef } from "react";
import { trackPromise } from "react-promise-tracker";
import { useHistory, useParams } from "react-router-dom";
import DefaultService from "Services/API/DefaultService";
import AuthService from "Services/AuthService";
import { alertify, notify } from "Services/ToastService";
import moment from "moment";
import Signatue_Box from "../../../Technician/Jobs/Components/Signatue_Box";
import { formatCurrency, pascalCaseToTitle } from "Lib/JsHelper";
const { Title } = Typography;

const Job_Estimate_Present = ({ jid, qid, jobSelected, quotePresented }) => {
  const sigCanvas = useRef();
  const dtJob = null;
  const dtQuote = null;
  const [job, setJob] = useState(dtJob);
  const [quote, setQuote] = useState(dtQuote);
  const [selOption, setSelOption] = useState();

  const [showEmailPopup, setShowEmailPopup] = useState(false);
  const [showJobCompletionPupup, setShowJobCompletionPupup] = useState(false);
  const [showJobNotes, setShowJobNotes] = useState(false);
  const [showApproveEstimate, setShowApproveEstimate] = useState(false);
  const [showPerformJob, setShowPerformJob] = useState(false);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [couponCode, setCouponCode] = useState();
  const [signature, setSignature] = useState(null);
  const [couponApply, setCouponApply] = useState(false);

  useEffect(async () => {
    if (!jid || !qid) {
      // history.push("/technician/jobs/");
      alertify("There is a system error. No job/quote selected", false);
      return;
    }

    const { data: q } = await trackPromise(
      DefaultService.Entity_Get("Outbound_Quote", qid)
    );
    const { data: j } = await trackPromise(
      DefaultService.Entity_Get("JOB", jid)
    );

    setQuote(q);
    setJob(j);

    if (j && q && q.special_rate_discount == 1) {
      setCouponApply(true);
    }

    //console.log("JOB", j);
    //console.log("JOB", q);
  }, []);

  const sendEmail = async () => {
    let ft_id = null; // AuthService.getCurrentTechnician().id;
    const { data, status, message } = await trackPromise(
      DefaultService.PUT(
        `/quote/f_t/send_to_customer/${quote.id}/${selOption.id}`,
        { field_technician_id: ft_id }
      )
    );

    notify(
      status
        ? "Email sent to the customer successfully"
        : "Failed to send an email to the customer",
      status
    );

    if (status) {
      setShowEmailPopup(false);
      setShowJobCompletionPupup(true);
    }
  };

  const saveAndCloseJobEstimationCard = async () => {
    //set job status to 'Estimated'
    let ft_id = null; // AuthService.getCurrentTechnician().id;
    const { data, status, message } = await trackPromise(
      DefaultService.PUT(`/job/f_t/estimated/${job.id}`, {
        field_technician_id: ft_id,
      })
    );

    notify(
      status
        ? "Estimation marked completed"
        : "Failed to complete the estimation",
      status
    );

    if (status) {
      setShowJobNotes(false);
    }
  };

  const applyCouponCode = async () => {
    //set job status to 'Estimated'
    let ft_id = AuthService.getCurrentTechnician().id;
    if (!couponCode) {
      notify("Please provide a valid coupon code", false);
      return;
    }

    const { data, status, message } = await trackPromise(
      DefaultService.PUT(`/quote/f_t/apply_coupon/${quote.id}`, {
        coupon_code: couponCode,
      })
    );
    if (status) {
      console.info(
        "Number(selOption.amount) - Number(data.amount)",
        Number(selOption.amount) - Number(data.amount)
      );
      selOption.amount = Number(selOption.amount) - Number(data.amount);
      selOption.discount = Number(selOption.discount) + Number(data.amount);

      setCouponApply(true);
    }

    notify(status ? "Coupon code applied successfully" : message, status);
  };

  const approveJob = async () => {
    //set job status to 'Estimated'
    let ft_id = null; //AuthService.getCurrentTechnician().id;

    if (sigCanvas.current.isEmpty()) {
      return notify("Signature is required", false);
    }
    // console.log('Signature', sigCanvas.current.getTrimmedCanvas().toDataURL("image/svg+xml"))
    let sigantureImg = sigCanvas.current
      .getTrimmedCanvas()
      .toDataURL("image/svg+xml");
    const { status: qStatus, message: qMessage } = await trackPromise(
      DefaultService.PUT(`/quote/f_t/approved/${selOption.id}`, {
        field_technician_id: ft_id,
        customer_sign: sigantureImg,
      })
    );
    notify(
      qStatus
        ? `${selOption.title} quote  approved successfully for this job`
        : "Failed to approve the selected quote option",
      qStatus
    );
    job.job_status.technician_status = "APPROVED";
    if (qStatus) {
      const { status: jStatus, message: jMessage } = await trackPromise(
        DefaultService.PUT(`/job/f_t/approved_estimate/${job.id}`, {
          field_technician_id: ft_id,
        })
      );

      notify(
        jStatus
          ? "Job estimation approved successfully"
          : "Failed to approve this job estimate",
        jStatus
      );

      if (jStatus) {
        //setShowPerformJob(true);
        //setShowApproveEstimate(false);

        quotePresented(job, quote);
      }
    }
  };

  const handleClear = () => {
    sigCanvas.current.clear();
    setSignature(null);
  };

  const calculateDiscountPrice = (jobOption) => {
    try {
      let jobPriorityFee =
        (job && job.job_priority && job.job_priority.fee) || 0.0;

      var active_discount = job.discount_tag?.special_rate_discounts.filter(
        (v) => moment(v.expiry_date) > moment.utc()
      );
      //console.info('active_discount', active_discount);
      let discountTagRate =
        (job &&
          quote &&
          quote.special_rate_discount == 1 &&
          job.discount_tag &&
          job.discount_tag.special_rate_discounts &&
          active_discount.length > 0 &&
          active_discount[0].rate_discount) ||
        0.0;

      //console.info('discountTagRate', discountTagRate);

      let basicPrice = _.round(
        _.sumBy(jobOption.items, function (o) {
          return o.price;
        }),
        2
      );

      // let netPrice = basicPrice > 0 ? basicPrice - (basicPrice * discountTagRate) / 100 + jobPriorityFee : 0;
      let netPrice = basicPrice > 0 ? basicPrice + jobPriorityFee : 0;
      let discountedPrice = (basicPrice * discountTagRate) / 100;
      //console.log("Option Price", discountedPrice);
      jobOption.discount = discountedPrice;
    } catch (error) {
      console.error("calculateDiscountPrice", error);
    }
  };

  return (
    <>
      <div className="flex">
        <Title level={4}>Present Estimates</Title>
        <div className="ml-auto mb-2">
          <Button
            size="large"
            style={{ width: "80px" }}
            onClick={() => {
              // history.push({
              //   pathname: `/technician/jobs/job-estimate-main/${job.id}/${quote.id}`,
              //   dtJob: job,
              //   dtQuote: quote,
              // });
              jobSelected(job, quote);
            }}
          >
            Edit
          </Button>
        </div>
      </div>

      {quote &&
        quote.options &&
        quote.options.map((opt) => {
          return (
            <>
              <Card
                size="default"
                className={`mb-2 ${
                  opt.is_recommended && "box-orange box-double bg-orange"
                }`}
                title={`${opt.title} ${(opt.is_recommended && "✪") || ""}`}
                headStyle={{
                  fontSize: "18px",
                  borderLeft: `solid 3px ${
                    opt.is_recommended ? "orange" : "#cadeff"
                  }`,
                  color: `${opt.is_recommended ? "#dd6633" : "#555"}`,
                  backgroundColor: `${opt.is_recommended ? "gold" : "#ccc"}`,
                }}
                bodyStyle={{
                  borderLeft: `solid 3px ${
                    opt.is_recommended ? "orange" : "#cadeff"
                  }`,
                }}
                extra={
                  <h4
                    style={{
                      color: `${opt.is_recommended ? "#dd6633" : "#555"}`,
                    }}
                  >
                    ${_.round(opt.amount, 2)}
                  </h4>
                }
                style={{ width: "100%" }}
              >
                <ViewItems {...{ jobOption: opt }} />
                <Row className="mt-5 mb-5">
                  <Col span={24} className="text-center">
                    <Space size={10}>
                      <Button
                        size="large"
                        style={{ width: "80px" }}
                        className="bg-info"
                        onClick={() => {
                          setSelOption(opt);
                          setShowEmailPopup(true);
                        }}
                      >
                        Email
                      </Button>
                      <Button
                        size="large"
                        style={{ width: "80px", display: "none" }}
                        className="bg-success"
                        onClick={() => {
                          setSelOption(opt);
                          setShowApproveEstimate(true);
                          calculateDiscountPrice(opt);
                        }}
                      >
                        Select
                      </Button>
                    </Space>
                  </Col>
                </Row>
              </Card>
            </>
          );
        })}

      {showEmailPopup && (
        <Modal
          centered={true}
          visible={showEmailPopup}
          onCancel={() => setShowEmailPopup(false)}
          title={`Email "${selOption.title}" option to customer`}
          footer={[]}
        >
          <Row>
            <Col span={8} className="text-right mr-3">
              Customer Name:
            </Col>
            <Col span={12}>
              <h3> {job.customer.full_name} </h3>
            </Col>
          </Row>
          <Row>
            <Col span={8} className="text-right mr-3">
              Customer Email:
            </Col>
            <Col span={12}>
              <h3>{job.customer.email}</h3>
            </Col>
          </Row>
          <Row>
            <Col span={24} className="text-center">
              <Space size={8}>
                {/* <Button
                  type="dashed"
                  danger
                  onClick={() => {
                    notify("Downloading PDF", true);
                  }}
                >
                  View PDF
                </Button> */}
                <Button
                  onClick={() => {
                    sendEmail();
                    //alert("Email sent successfully");
                  }}
                >
                  Send Email
                </Button>
              </Space>
            </Col>
          </Row>
        </Modal>
      )}

      {showJobCompletionPupup && (
        <Modal
          centered={true}
          visible={showJobCompletionPupup}
          onCancel={() => setShowJobCompletionPupup(false)}
          title={`Is this job now complete?`}
          footer={[]}
        >
          <Row className="mt-5 mb-5">
            <Col span={24} className="text-center">
              <Space size={10}>
                <Button
                  size="large"
                  style={{ width: "80px" }}
                  onClick={() => {
                    setShowJobNotes(true);
                    setShowJobCompletionPupup(false);
                    // history.push({
                    //   pathname: `/technician/jobs/job-close-notes/${jid}`,
                    //   dtJob: job,
                    // });
                    quotePresented(job, quote, true);
                  }}
                >
                  Yes
                </Button>
                <Button
                  size="large"
                  style={{ width: "80px" }}
                  className="bg-info"
                  onClick={() => {
                    setShowJobCompletionPupup(false);
                    //history.push("/technician/jobs");
                    quotePresented(job, quote, false);
                  }}
                >
                  No
                </Button>
              </Space>
            </Col>
          </Row>
        </Modal>
      )}

      {showJobNotes && (
        <Modal
          centered={true}
          visible={showJobNotes}
          onCancel={() => setShowJobNotes(false)}
          title={`Job Notes`}
          bodyStyle={{ height: "400px" }}
          footer={[]}
        >
          <Row className="mb-5">
            <Col span={24} className="text-center">
              <textarea style={{ height: "310px", width: "100%" }}>
                {job.job_details}
              </textarea>
            </Col>
          </Row>
          <Row className="mt-5">
            <Col span={24} className="text-center">
              <Button
                size="large"
                style={{ width: "100%" }}
                className="bg-primary"
                onClick={() => {
                  saveAndCloseJobEstimationCard();
                }}
              >
                Save and close job estimation card
              </Button>
            </Col>
          </Row>
        </Modal>
      )}

      {showApproveEstimate && job && (
        <Modal
          centered={true}
          visible={showApproveEstimate}
          onCancel={() => setShowApproveEstimate(false)}
          title={`Approve Estimate`}
          bodyStyle={{}}
          footer={[
            <Button
              danger
              type="dashed"
              size="large"
              style={{ width: "48%" }}
              onClick={() => setShowApproveEstimate(false)}
            >
              Cancel
            </Button>,
            <Button
              className="bg-success"
              size="large"
              style={{ width: "48%" }}
              onClick={approveJob}
            >
              Approve
            </Button>,
          ]}
        >
          <Row className="">
            <Col span={24} className="">
              <h3 className="flex">
                Customer: {"  "}{" "}
                <span className="text-primary">
                  {job.customer && job.customer.full_name}
                </span>
                <span className="ml-auto">
                  Job# <span className="text-warning">{job.id}</span>
                </span>
              </h3>
            </Col>
          </Row>
          <div className="box box-grey bg-blue p-1">
            <Row gutter={8}>
              <Col span={8}>
                <b>Scheduled for:</b>
                <br />
                {moment(job.need_at).utc(false).format("YYYY-MM-DD HH:mm")}
              </Col>
              <Col span={8}>
                {job.discount_tag && (
                  <Badge
                    count={job.discount_tag.name}
                    key={job.discount_tag.name}
                  />
                )}
              </Col>
              <Col span={8}>
                <b>Billing Details:</b>
                <br />
                {job.billing_address && job.billing_address.full_address}
              </Col>
            </Row>
            <hr />
            <Row gutter={8}>
              <Col span={8}>
                <b>Job Tags:</b>
                <br />
                {job.job_tags &&
                  job.job_tags.map((jt) => {
                    return <Badge count={jt.name} key={jt.name} />;
                  })}
              </Col>
              <Col span={8}>
                <b>Service Type:</b>
                <br />
                <Badge
                  count={job.service_type && job.service_type.name}
                  style={{ color: "cyan" }}
                />
              </Col>
              <Col span={8}>
                <b>Customer Type:</b>
                <br />
                <Badge
                  count={job.customer && job.customer.customer_type.name}
                  style={{ color: "yellow" }}
                />
              </Col>
            </Row>
          </div>

          <Row className=" mt-3">
            <Col span={24}>
              <h3 className="flex">
                Description
                <span className="ml-auto text-success">{selOption.title}</span>
              </h3>
            </Col>
          </Row>
          <div className="box box-grey bg-blue p-1 flex">
            <ViewApproveItems {...{ jobOption: selOption, quote, job }} />
            {/* <ViewItems {...{ jobOption: selOption }} /> */}
          </div>

          <Row className="mt-4 mb-4">
            <Col span={24} className="text-center" style={{ fontSize: "14px" }}>
              <Space size={4}>
                Add Discount Coupon:{" "}
                <input
                  type="text"
                  style={{ width: "80px" }}
                  onChange={(e) => setCouponCode(e.target.value)}
                />
                <Button
                  size="large"
                  className="bg-success"
                  disabled={couponApply ? "disabled" : ""}
                  onClick={applyCouponCode}
                >
                  Apply
                </Button>
              </Space>
            </Col>
          </Row>
          <div className="box-danger bg-grey">
            <Row className="mt-3 mb-3">
              <Col
                span={24}
                className="text-center"
                style={{ fontSize: "20px" }}
              >
                <Space size={12}>
                  <span className="text-bold">Total Cost:</span>
                  <span>
                    <span className="text-danger text-bold">
                      {formatCurrency(selOption.amount)}
                    </span>
                  </span>
                </Space>
              </Col>
            </Row>
          </div>
          <div className="">
            <Row className="mt-3">
              <Col
                span={24}
                className="text-center"
                style={{ fontSize: "14px" }}
              >
                <Space size={12}>
                  <span className="text-bold"> Signature:</span>
                  <span>
                    <Signatue_Box sigCanvas={sigCanvas} />
                  </span>
                </Space>
              </Col>
            </Row>
            <Row>
              <Col span={24} className="text-center">
                <button
                  type="button"
                  className="ant-btn ant-btn-dashed ant-btn-lg ant-btn-dangerous"
                  onClick={() => handleClear()}
                >
                  Clear Signature
                </button>
              </Col>
            </Row>
          </div>
        </Modal>
      )}

      {showPerformJob && (
        <Modal
          centered={true}
          visible={showPerformJob}
          onCancel={() => setShowPerformJob(false)}
          title={`Will you perform this work now?`}
          footer={[]}
        >
          <Row className="mt-5 mb-5">
            <Col span={24} className="text-center">
              <Space size={10}>
                <Button
                  size="large"
                  style={{ width: "80px" }}
                  onClick={() => {
                    // history.push({
                    //   pathname: `/technician/jobs/job-start-work/${job.id}`,
                    //   //dtJob: job,
                    // });
                    ////setShowPerformJob(false);
                    alertify(
                      "You cannot mark this job done here. Please contact admin for help",
                      false
                    );
                  }}
                >
                  Yes
                </Button>
                <Button
                  size="large"
                  style={{ width: "80px" }}
                  className="bg-info"
                  onClick={() => {
                    setShowPaymentOptions(true);
                    setShowPerformJob(false);
                  }}
                >
                  No
                </Button>
              </Space>
            </Col>
          </Row>
        </Modal>
      )}

      {showPaymentOptions && (
        <Modal
          centered={true}
          visible={showPaymentOptions}
          onCancel={() => setShowPaymentOptions(false)}
          title={`Make Payment?`}
          footer={[]}
        >
          <Row className="mt-5 mb-5">
            <Col span={24} className="text-center">
              <Space size={10}>
                <Button
                  size="large"
                  style={{ width: "80px" }}
                  onClick={() => {
                    // history.push({
                    //   pathname: `/technician/jobs/job-payment/${job.id}`,
                    //   dtJob: job,
                    //   nextStep: showPerformJob ? "job" : "notes",
                    // });
                    // setShowPaymentOptions(false);
                    alertify(
                      "Sorry you cannot set payment options here. Please contact admin for more information.",
                      false
                    );
                  }}
                >
                  Yes
                </Button>
                <Button
                  size="large"
                  style={{ width: "80px" }}
                  className="bg-info"
                  onClick={() => {
                    // history.push({
                    //   pathname: `/technician/jobs/job-notes/${job.id}`,
                    //   dtJob: job,
                    // });
                    // setShowPaymentOptions(false);

                    quotePresented(job, quote);
                  }}
                >
                  No
                </Button>
              </Space>
            </Col>
          </Row>
        </Modal>
      )}
    </>
  );
};

export default Job_Estimate_Present;

const ViewItems = ({ jobOption }) => {
  const [option, setOption] = useState(jobOption);

  return (
    <>
      {/* <h4>List of Items in {jobOption.title}</h4> */}
      <table style={{ width: "100%" }}>
        <thead>
          <tr>
            <th
              className="text-left text-primary"
              style={{ maxWidth: "150px" }}
            >
              Item
            </th>
            <th className="text-center text-primary" style={{ width: "80px" }}>
              Quantity
            </th>
            <th className="text-center text-primary" style={{ width: "80px" }}>
              Price
            </th>
          </tr>
        </thead>
        {option.items.map((i) => {
          return (
            <tr>
              <td
                className="text-left"
                valign="top"
                style={{ maxWidth: "150px" }}
              >
                <b>{i.title}</b>
                <br />
                {i.description}
              </td>
              <td className="text-center" valign="top">
                {i.quantity}
              </td>
              <td className="text-center text-danger" valign="top">
                ${i.price}
              </td>
            </tr>
          );
        })}
      </table>
    </>
  );
};

const ViewApproveItems = ({ jobOption, quote, job }) => {
  //console.log('ViewApproveItemsJob', job)
  const [option, setOption] = useState(jobOption);

  useEffect(() => {
    calculateDiscountPrice(jobOption);
  }, [jobOption]);

  const calculateDiscountPrice = (jobOption) => {
    try {
      let jobPriorityFee =
        (job && job.job_priority && job.job_priority.fee) || 0.0;

      var active_discount = job.discount_tag?.special_rate_discounts.filter(
        (v) => moment(v.expiry_date) > moment.utc()
      );
      console.info("active_discount", active_discount);
      let discountTagRate =
        (job &&
          quote &&
          quote.special_rate_discount == 1 &&
          job.discount_tag &&
          job.discount_tag.special_rate_discounts &&
          active_discount.length > 0 &&
          active_discount[0].rate_discount) ||
        0.0;

      //console.info('discountTagRate', discountTagRate);

      let basicPrice = _.round(
        _.sumBy(jobOption.items, function (o) {
          return o.price;
        }),
        2
      );

      // let netPrice = basicPrice > 0 ? basicPrice - (basicPrice * discountTagRate) / 100 + jobPriorityFee : 0;
      let netPrice = basicPrice > 0 ? basicPrice + jobPriorityFee : 0;
      let discountedPrice = (basicPrice * discountTagRate) / 100;
      //console.log("Option Price", discountedPrice);
      jobOption.discount = discountedPrice;
      return formatCurrency(_.round(discountedPrice, 2));
    } catch (error) {
      console.error("calculateDiscountPrice", error);
    }
  };

  return (
    <>
      {/* <h4>List of Items in {jobOption.title}</h4> */}
      <table style={{ tableLayout: "auto" }}>
        <thead>
          <tr>
            <th
              className="text-left text-primary"
              style={{ maxWidth: "150px" }}
            >
              Item
            </th>
            <th className="text-center text-primary" style={{ width: "80px" }}>
              Quantity
            </th>
            <th className="text-center text-primary" style={{ width: "80px" }}>
              Price
            </th>
          </tr>
        </thead>
        <tr>
          <td className="text-left" valign="top" style={{ maxWidth: "150px" }}>
            <b>Job Fee</b>
          </td>
          <td className="text-center" valign="top"></td>
          <td className="text-center text-danger" valign="top">
            {formatCurrency(job.job_priority && (job.job_priority.fee || 0.0))}
          </td>
        </tr>
        <tr>
          <td colSpan="3">
            <hr />
          </td>
        </tr>

        {option.items.map((i) => {
          return (
            <>
              <tr>
                <td
                  className="text-left"
                  valign="top"
                  style={{ maxWidth: "150px" }}
                >
                  <b>{pascalCaseToTitle(i.title)}</b> (tax incl.{" "}
                  {formatCurrency(i.tax)})
                  <br />
                  {i.description}
                </td>
                <td className="text-center" valign="top">
                  {i.quantity}
                </td>
                <td className="text-center text-danger" valign="top">
                  {formatCurrency(i.price)}
                </td>
              </tr>
            </>
          );
        })}
        <tr>
          <td colSpan="3">
            <hr />
          </td>
        </tr>

        <tr>
          <td className="text-left" valign="top" style={{ maxWidth: "150px" }}>
            <b>Discount</b>
          </td>
          <td className="text-center" valign="top"></td>
          <td className="text-center text-danger" valign="top">
            {formatCurrency(option.discount)}
          </td>
        </tr>
      </table>
    </>
  );
};
