import React, { useEffect, useState, useCallback, useRef } from "react";
import { useHistory, useParams } from "react-router-dom";
import { trackPromise } from "react-promise-tracker";
import { Row, Col, Typography, Card, Badge, Space, Button, Modal, Switch, Collapse, InputNumber } from "antd";
import _ from "lodash";
import moment from "moment";
import SvApiUploaderJob from "Components/Common/SvApiUploaderJob";
import Signatue_Box from "./Components/Signatue_Box";
import TechJobService from "Services/API/Technician/TechJobService";
import environment from "Environment";
import AuthService from "Services/AuthService";
import { notify } from "Services/ToastService";
import DefaultService from "Services/API/DefaultService";
import { formatCurrency, pascalCaseToTitle } from "Lib/JsHelper";
import { useTranslation } from "react-i18next";
const { Title, Text, Paragraph } = Typography;
const { Panel } = Collapse;

const jobDateFormat = "ddd Do MMM";

const Job_Start_Work = props => {

const user = AuthService.getCurrentTechnician();
const ORGANISATION_ID = user ? user.organisation_id : 0;
const TECH_ID = user ? user.id : 0;

  let history = useHistory();
  const sigCanvas = useRef();
  const { t } = useTranslation();

  let { jid } = useParams();
  const { flagStartButton } = props.location;
  const [job, setJob] = useState(null);
  const [dtBeforeJobPic, setBeforeJobPic] = useState(null);
  const [dtAfterJobPic, setAfterJobPic] = useState(null);
  const [jobStatus, setJobStatus] = useState();
  const [dtJobInvoice, setJobInvoice] = useState(null);
  const [showCustomerApprove, setShowCustomerApprove] = useState(false);
  const [showCustomerBill, setShowCustomerBill] = useState(false);
  const [showJobCloseConfirm, setShowJobCloseConfirm] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [beforeNotes, setBeforeNotes] = useState(null);
  const [beforeNotesText, setBeforeNotesText] = useState("");
  const [showBeforeNotes, setShowBeforeNotes] = useState(false);
  const [beforeNotesUpdate, setBeforeNotesUpdate] = useState(false);
  const [afterNotes, setAfterNotes] = useState(null);
  const [afterNotesText, setAfterNotesText] = useState("");
  const [afterNotesUpdate, setAfterNotesUpdate] = useState(false);
  const [showAfterNotes, setShowAfterNotes] = useState(false);
  const [questionNotes, setQuestionNotes] = useState({
    job_completed_check: false,
    job_completed: "",
    full_payment_check: false,
    full_payment: "",
    photo_upload_check: false,
    photo_upload: "",
    form_filled_check: false,
    form_filled: "",
    truck_material_check: false,
    truck_material: "",
  });
  const [dtTruckMaterial, setTruckMatetial] = useState(null);
  const [truckID, setTruckID] = useState(0);
  const [truckMaterialNotes, setTruckMaterialNotes] = useState("");
  const [activeStartButton, setStartButton] = React.useState(false);
  const [jobFinalStatus, setJobFinalStatus] = React.useState("Close");
  const [open, setOpen] = useState([]);

  function fetchData() {
    return new Promise(async (resolve, reject) => {
      if (!jid) {
        return history.push("/technician/jobs/");
      }
      const { data } = await TechJobService.GetTechJob(jid);
      setJob(data);
      setJobStatus(data.job_status.technician_status);
      resolve(data);

      getTruckMatetial();
    });
  }

  useEffect(() => {
    console.log("ORGANISATION_ID", ORGANISATION_ID);
    fetchData().then(data => {
      getBeforeJobPic(data);
      getAfterJobPic(data);
      getJobInvoice(data);
      getJobNotes(data);
    });
    window.scrollTo(0, 0);
    //console.log('activeStartButton', flagStartButton);
    setStartButton(flagStartButton);
  }, [ORGANISATION_ID]);

  const getJobNotes = useCallback(
    async job => {
      const _BEFORE_NOTES_PARAM = {
        condition: { organisation_id: ORGANISATION_ID, job_id: job.id, note_key: environment.NOTES.BEFORE_JOB_NOTES },
      };

      const beforeNotes = await trackPromise(DefaultService.POST(`/job/note/list`, _BEFORE_NOTES_PARAM));
      if (beforeNotes.data[0] !== undefined) {
        setBeforeNotes(beforeNotes);
        setBeforeNotesText(beforeNotes.data[0].note);
        setBeforeNotesUpdate(true);
      }

      const _AFTER_NOTES_PARAM = {
        condition: { organisation_id: ORGANISATION_ID, job_id: job.id, note_key: environment.NOTES.AFTER_JOB_NOTES },
      };

      const afterNotes = await trackPromise(DefaultService.POST(`/job/note/list`, _AFTER_NOTES_PARAM));

      if (afterNotes.data[0] !== undefined) {
        setAfterNotes(afterNotes);
        setAfterNotesText(afterNotes.data[0].note);
        setAfterNotesUpdate(true);
      }
    },
    [job]
  );

  const getBeforeJobPic = useCallback(
    async job => {
      let param_media_before = {
        condition: { organisation_id: ORGANISATION_ID, job_id: job.id, type: "BEFORE" },
      };
      let { data } = await TechJobService.getJobUPloadedPic(param_media_before);
      data.forEach(element => {
        element.url = environment.PATH_JOB_MEDIA + "/" + element.file_path;
        element.status = "done";
        element.thumbUrl = environment.PATH_JOB_MEDIA + "/" + element.file_path;
      });
      setBeforeJobPic(data);
    },
    [job]
  );

  const getAfterJobPic = useCallback(
    async job => {
      let param_media_before = {
        condition: { organisation_id: ORGANISATION_ID, job_id: job.id, type: "AFTER" },
      };
      let { data } = await TechJobService.getJobUPloadedPic(param_media_before);
      data.forEach(element => {
        element.url = environment.PATH_JOB_MEDIA + "/" + element.file_path;
        element.status = "done";
        element.thumbUrl = environment.PATH_JOB_MEDIA + "/" + element.file_path;
      });
      setAfterJobPic(data);
    },
    [job]
  );

  const getJobInvoice = useCallback(
    async job => {
      let { data } = await TechJobService.getJobInvoice(job.id);
      setJobInvoice(data);
    },
    [job]
  );

  const uploadBeforeJobPic = async picture => {
    await TechJobService.uploadPicJobPicture(picture);
    notify(`Before job picture uploaded successfully`, true);
    getBeforeJobPic(job);
  };

  const uploadAfterJobPic = async picture => {
    await TechJobService.uploadPicJobPicture(picture);
    notify(`After job picture uploaded successfully`, true);
    getAfterJobPic(job);
  };

  const deleteBeforeJobPicture = async id => {
    await trackPromise(DefaultService.DELETE(`/job/media/${id}`));
    notify(`Before job picture deleted successfully`, true);
    getBeforeJobPic(job);
  };

  const deleteAfterJobPicture = async id => {
    await trackPromise(DefaultService.DELETE(`/job/media/${id}`));
    notify(`After job picture deleted successfully`, true);
    getAfterJobPic(job);
  };

  const setJobStatusStartWork = useCallback(async () => {
    //console.log('activeStartButton', activeStartButton);
    if (activeStartButton) {
      await trackPromise(DefaultService.PUT(`/job/f_t/in_progress/${job.id}`, { field_technician_id: TECH_ID }));
      notify(`Job started successfully`, true);
      setJobStatus("IN PROGRESS");
      job.job_status.technician_status = "IN PROGRESS";
    } else {
      return history.push(`/technician/jobs/job-compliance/${jid}`);
    }
  }, [job, activeStartButton]);

  const setJobStatusClosed = async () => {
    // if (!Object.values(questionNotes).every(x => x !== "")) {
    //   return notify('All notes are required', false);
    // }

    const _Notes_Param = {
      organisation_id: ORGANISATION_ID,
      job_id: job.id,
      note_key: environment.NOTES.QUEST_JOB_COMPLETE_NOTES,
      note: questionNotes.job_completed,
      is_active: true,
    };

    if (!questionNotes.job_completed_check) {
      if (questionNotes.job_completed !== "") {
        await trackPromise(DefaultService.POST(`/job/note`, _Notes_Param));
      } else {
        return notify("Job complete notes is required", false);
      }
    }

    if (!questionNotes.full_payment_check) {
      if (questionNotes.full_payment !== "") {
        _Notes_Param.note_key = environment.NOTES.QUEST_FULL_PAYMENT_NOTES;
        _Notes_Param.note = questionNotes.full_payment;
        await trackPromise(DefaultService.POST(`/job/note`, _Notes_Param));
      } else {
        return notify("Full payment notes is required", false);
      }
    }

    if (!questionNotes.photo_upload_check) {
      if (questionNotes.photo_upload !== "") {
        _Notes_Param.note_key = environment.NOTES.QUEST_PHOTO_UPLOAD_NOTES;
        _Notes_Param.note = questionNotes.photo_upload;
        await trackPromise(DefaultService.POST(`/job/note`, _Notes_Param));
      } else {
        return notify("Photo upload notes is required", false);
      }
    }

    if (!questionNotes.form_filled_check) {
      if (questionNotes.form_filled !== "") {
        _Notes_Param.note_key = environment.NOTES.QUEST_FORM_FILLED_NOTES;
        _Notes_Param.note = questionNotes.form_filled;
        await trackPromise(DefaultService.POST(`/job/note`, _Notes_Param));
      } else {
        return notify("Form filled notes is required", false);
      }
    }

    //JOB CLOSE
    if (jobFinalStatus === "Close") {
      await trackPromise(DefaultService.PUT(`/job/f_t/closed/${job.id}`, { field_technician_id: TECH_ID }));
      notify(`Job completed successfully`, true);
    } else {
      await trackPromise(DefaultService.PUT(`/job/f_t/on_going/${job.id}`, { field_technician_id: TECH_ID }));
      notify(`Job status successfully set to On Going`, true);
    }

    history.push({
      pathname: `/technician/jobs`,
    });
  };

  const handleClear = () => {
    sigCanvas.current.clear();
  };

  const customerApprove = useCallback(async () => {
    //set job status to 'Estimated'
    let ft_id = AuthService.getCurrentTechnician().id;

    if (sigCanvas.current.isEmpty()) {
      return notify("Signature is required", false);
    }
    // console.log('Signature', sigCanvas.current.getTrimmedCanvas().toDataURL("image/svg+xml"))
    let sigantureImg = sigCanvas.current.getTrimmedCanvas().toDataURL("image/svg+xml");
    await trackPromise(DefaultService.PUT(`/job/f_t/completed/${job.id}`, { field_technician_id: ft_id, customer_sign: sigantureImg }));
    setJobStatus("COMPLETED");
    notify(`Job completed successfully`, true);
    setShowCustomerApprove(false);
  }, [job]);

  const handleQuestion = (value, notesType) => {
    if (value) {
      questionNotes[notesType] = true;
    } else {
      questionNotes[notesType] = false;
    }
  };

  const setBeforeJobNotes = useCallback(async () => {
    if (beforeNotesText === "") {
      return notify(`Notes is required`, false);
    }
    if (beforeNotesUpdate) {
      const _Notes_Param = {
        note: beforeNotesText,
      };
      await trackPromise(DefaultService.PUT(`/job/note/${beforeNotes.data[0].id}`, _Notes_Param));
    } else {
      const _Notes_Param = {
        organisation_id: ORGANISATION_ID,
        job_id: job.id,
        note_key: environment.NOTES.BEFORE_JOB_NOTES,
        note: beforeNotesText,
        is_active: true,
      };
      await trackPromise(DefaultService.POST(`/job/note`, _Notes_Param));
    }
    notify("Notes saved successfully", true);
    setShowBeforeNotes(false);
  }, [beforeNotesText, job]);

  const setAfterJobNotes = useCallback(async () => {
    if (afterNotesText === "") {
      return notify(`Notes is required`, false);
    }
    if (afterNotesUpdate) {
      const _Notes_Param = {
        note: afterNotesText,
      };
      await trackPromise(DefaultService.PUT(`/job/note/${afterNotes.data[0].id}`, _Notes_Param));
    } else {
      const _Notes_Param = {
        organisation_id: ORGANISATION_ID,
        job_id: job.id,
        note_key: environment.NOTES.AFTER_JOB_NOTES,
        note: afterNotesText,
        is_active: true,
      };
      await trackPromise(DefaultService.POST(`/job/note`, _Notes_Param));
    }
    notify("Notes saved successfully", true);
    setShowAfterNotes(false);
  }, [afterNotesText, job]);

  const getTruckMatetial = async () => {
    const { data: truckMatetial } = await trackPromise(DefaultService.GET(`/truck/f_t/${TECH_ID}`));
    setTruckID(truckMatetial.id);
    const dtTruckMaterial = truckMatetial?.products?.map(element => ({
      ...element,
      isUsed: false,
      usedQty: 0,
    }));
    setTruckMatetial(dtTruckMaterial);
  };

  const saveQuestionNotes = (question_no, question_notes) => {
    switch (question_no) {
      case 1:
        questionNotes.job_completed = question_notes;

        setQuestionNotes(questionNotes);
        break;
      case 2:
        questionNotes.full_payment = question_notes;
        setQuestionNotes(questionNotes);
        break;
      case 3:
        questionNotes.photo_upload = question_notes;
        setQuestionNotes(questionNotes);
        break;
      case 4:
        questionNotes.form_filled = question_notes;
        setQuestionNotes(questionNotes);
        break;
      case 5:
        questionNotes.truck_material = question_notes;
        setQuestionNotes(questionNotes);
        break;
      default:
        break;
    }
  };

  const handleMaterialUsed = (value, id, isUsedFlag) => {
    if (isUsedFlag) {
      const element = dtTruckMaterial.find(e => e.id === id);
      if (element) {
        element.isUsed = value;
      }
    } else {
      const element = dtTruckMaterial.find(e => e.id === id);
      if (element && Number.isInteger(parseInt(value.target.value))) {
        element.usedQty = parseInt(value.target.value);
      }
    }
  };

  const saveTruckMaterial = useCallback(async () => {
    // TRUCK MATERIAL

    //console.log('dtTruckMaterial', dtTruckMaterial);
    if (dtTruckMaterial !== null && dtTruckMaterial !== undefined) {
      let usedProducts = dtTruckMaterial
        .filter(x => x.isUsed === true && x.usedQty > 0)
        .map(p => {
          return { product_id: p.id, quantity: p.usedQty, price: p.rrp };
        });
      //console.log('usedProducts', usedProducts)
      if (usedProducts.length > 0) {
        // if (truckMaterialNotes === '') {
        //   return notify('Truck material used notes are required', false);
        // }

        let totalExpense = usedProducts.reduce((accumulator, current) => accumulator + current.quantity * current.price, 0);

        const truckMatetialParam = {
          organisation_id: ORGANISATION_ID,
          job_id: job.id,
          field_technician_id: TECH_ID,
          truck_id: truckID,
          total: totalExpense,
          is_active: true,
          products: usedProducts,
        };

        const { message, status } = await trackPromise(DefaultService.POST(`/transaction/`, truckMatetialParam));
        setOpen(prev => [0]);
        notify(message, true);

        // if (status) {

        //   const _Notes_Param = {
        //     "organisation_id": ORGANISATION_ID,
        //     "job_id": job.id,
        //     "note_key": environment.NOTES.TRUCK_MATERIAL_USED_NOTES,
        //     "note": truckMaterialNotes,
        //     "is_active": true
        //   }

        //   await trackPromise(
        //     DefaultService.POST(`/job/note`, _Notes_Param)
        //   );

        //   notify(message, true);
        // }
        // else {
        //   notify(message, false);
        // }
      } else {
        return notify("No truck material to save", false);
      }
    }
  }, [dtTruckMaterial, truckMaterialNotes, job]);

  const calculateDiscountPrice = (jobOption, quote) => {
    try {
      let jobPriorityFee = (job && job.job_priority && job.job_priority.fee) || 0.0;

      var active_discount = job.discount_tag?.special_rate_discounts.filter(v => moment(v.expiry_date) > moment.utc());
      //console.info('active_discount', active_discount);
      let discountTagRate =
        (job && quote && quote.special_rate_discount == 1 && job.discount_tag && job.discount_tag?.special_rate_discounts && active_discount.length > 0 && active_discount[0].rate_discount) || 0.0;

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
      return formatCurrency(_.round(discountedPrice, 2));
    } catch (error) {
      console.error("calculateDiscountPrice", error);
    }
  };

  if (job === null)
    return (
      <>
        <Row>
          <Col span={24}>
            <Title level={4}>Start Work</Title>
          </Col>
        </Row>
        <Row>
          <Col>
            <Typography>{t("general_wait_for_loading_job_detail")}</Typography>
          </Col>
        </Row>
      </>
    );
  else
    return (
      <>
        <Row>
          <Col span={24}>
            <Title level={4}>{t("general_start_work")}</Title>
          </Col>
        </Row>

        <Row gutter={5}>
          <Col span={24}>
            <Card gutter={5} key={job.id} title={<Title level={5}>{job.customer?.full_name}</Title>} extra={<b>Job ID:{job.id}</b>}>
              <Space span={24} direction='vertical' size='small' style={{ display: "flex" }}>
                <Row>
                  <Col span={10}>
                    <Button type='primary' style={{ width: "100%", backgroundColor: "#FF931E" }}>
                      Quoting Time:{" "}
                      {!isNaN(job.efficiency_matrix?.quoting_time_mins)
                        ? ("0" + Math.floor(job.efficiency_matrix?.quoting_time_mins / 60)).slice(-2) + ":" + ("0" + (job.efficiency_matrix?.quoting_time_mins % 60)).slice(-2)
                        : "0:00"}
                    </Button>
                  </Col>

                  <Col span={14} align='right'>
                    {jobStatus === "APPROVED" || (job.is_started && jobStatus !== "IN PROGRESS" && jobStatus !== "PAYMENT RECEIVED" && jobStatus !== "COMPLETED") ? (
                      <Button type='primary' style={{ width: "45%", background: "#73A973 ", borderColor: "#4f814f" }} onClick={setJobStatusStartWork}>
                        {t("general_start_job")}
                      </Button>
                    ) : (
                      ""
                    )}
                    <>&nbsp;&nbsp;</>
                    {jobStatus === "IN PROGRESS" ? (
                      <Button
                        type='primary'
                        style={{ width: "45%", background: "#ffc588", borderColor: "#ffc588" }}
                        onClick={() => {
                          setShowJobCloseConfirm(true);
                          setJobFinalStatus("OnGoing");
                        }}
                      >
                        {t("general_save_job_as-on_going")}
                      </Button>
                    ) : (
                      ""
                    )}
                    &nbsp;&nbsp;
                    {jobStatus === "PAYMENT RECEIVED" || jobStatus === "COMPLETED" ? (
                      <Button
                        type='primary'
                        style={{ width: "45%", backgroundColor: "#FF0000" }}
                        onClick={() => {
                          setShowJobCloseConfirm(true);
                          setJobFinalStatus("Close");
                        }}
                      >
                        {t("general_close_job")}
                      </Button>
                    ) : (
                      ""
                    )}
                  </Col>
                </Row>
                <Row>
                  <Col span={8}>
                    <Text>{t("general_scheduled_for")}</Text>
                    <br />
                    {moment(job.need_at).format(jobDateFormat)}
                    <br />
                    <Text code>
                      {moment(job.need_at).format("hh:mma")}-{moment(job.need_at).add(job.job_duration_mins, "minutes").format("hh:mma")}
                    </Text>
                  </Col>
                  <Col span={8}>{job.discount_tag && <Badge count={job.discount_tag.name} key={job.discount_tag.name} />}</Col>
                  <Col span={8} align='left'>
                    {" "}
                    <Text strong> {t("general_billing_details")} </Text>
                    <br />
                    {job.job_site_address.full_address}
                  </Col>
                </Row>
                <Row>
                  <Col span={8}>
                    {" "}
                    <Text strong>{t("side_menu_navigation_quick_setup_sub_job_tags")}:</Text>
                    <br />
                    {job?.job_tags?.map(tag => {
                      return <Badge id={tag.name} count={tag.name} style={{ backgroundColor: "#666", TextColor: "#000" }} />;
                    })}
                  </Col>
                  <Col span={8} align='left'>
                    <Text strong>Service Type:</Text>
                    <br />
                    {job.service_type.name}
                  </Col>
                  <Col span={8} align='left'>
                    <Text strong>{t("quick_setup_customer_type_grid_heading_customer_type")}:</Text>
                    <br />
                    {job.customer.customer_type.name}
                  </Col>
                </Row>

                <Row>
                  <Col span={24}>
                    <Typography>
                      <Title level={5}>{t("general_description")}</Title>
                      <Paragraph>
                        {showMore ? job.job_details : `${job.job_details.substring(0, 250)}`}
                        {job.job_details.length > 250 ? (
                          <span className='ml-10'>
                            {" "}
                            . . .{" "}
                            <Button type='primary' size='medium' onClick={() => setShowMore(!showMore)}>
                              {" "}
                              {showMore ? "Show less" : "Show more"}
                            </Button>
                          </span>
                        ) : (
                          ""
                        )}
                      </Paragraph>
                    </Typography>
                  </Col>
                </Row>
                {jobStatus === "IN PROGRESS" || jobStatus === "COMPLETED" ? (
                  <>
                    {" "}
                    <Row>
                      <Col span={24}>
                        <Button
                          type='primary'
                          className='ant-btn-lg ant-col-24'
                          onClick={() => {
                            history.push({
                              pathname: `/technician/jobs/job-purchase-order-list/${job.id}/job-start-work`,
                              dtJob: job,
                            });
                          }}
                        >
                          {t("general_add_purchase_order")}
                        </Button>
                      </Col>
                    </Row>
                    <Card
                      gutter={5}
                      title={
                        <>
                          <Title level={5}>
                            {t("general_upload_before_job_images")}
                            <br />
                            <span style={{ fontSize: "9px", color: "#D46874" }}>(only jpeg,png,bmp allowed)</span>
                          </Title>
                        </>
                      }
                      extra={
                        <Button type='danger' size='medium' onClick={() => setShowBeforeNotes(true)}>
                          {t("general_job_notes")}
                        </Button>
                      }
                    >
                      <Row>
                        <Col span={24}>
                          <SvApiUploaderJob
                            endpoint={`${environment.API.BASE_URL}${environment.API.VERSION}/upload/job_media`}
                            fileType='picture'
                            fileList={dtBeforeJobPic}
                            multiple={true}
                            maxCount={20}
                            sizeLimit={20}
                            onFileUploaded={({ name, path, size, mimetype }) => {
                              let uploadedFile = {};
                              uploadedFile.organisation_id = ORGANISATION_ID;
                              uploadedFile.job_id = job.id;
                              uploadedFile.type = "BEFORE";
                              uploadedFile.number = 1;
                              uploadedFile.file = name;
                              uploadedFile.file_path = path;
                              uploadedFile.file_size = size;
                              uploadedFile.mime_type = mimetype;
                              uploadedFile.is_active = true;
                              uploadBeforeJobPic(uploadedFile);
                            }}
                            onRemove={file => {
                              deleteBeforeJobPicture(file.id);
                            }}
                          />
                        </Col>
                      </Row>
                    </Card>
                    <Card
                      gutter={5}
                      title={
                        <Title level={5}>
                          {t("general_upload_after_job_images")} <br />
                          <span style={{ fontSize: "9px", color: "#D46874" }}>(only jpeg,png,bmp allowed)</span>
                        </Title>
                      }
                      extra={
                        <Button type='danger' size='medium' onClick={() => setShowAfterNotes(true)}>
                          {t("general_job_notes")}
                        </Button>
                      }
                    >
                      <Row>
                        <Col span={24}>
                          <SvApiUploaderJob
                            endpoint={`${environment.API.BASE_URL}${environment.API.VERSION}/upload/job_media`}
                            fileType='picture'
                            fileList={dtAfterJobPic}
                            multiple={true}
                            maxCount={20}
                            sizeLimit={20}
                            onFileUploaded={({ name, path, size, mimetype }) => {
                              let uploadedFile = {};
                              uploadedFile.organisation_id = ORGANISATION_ID;
                              uploadedFile.job_id = job.id;
                              uploadedFile.type = "AFTER";
                              uploadedFile.number = 1;
                              uploadedFile.file = name;
                              uploadedFile.file_path = path;
                              uploadedFile.file_size = size;
                              uploadedFile.mime_type = mimetype;
                              uploadedFile.is_active = true;
                              uploadAfterJobPic(uploadedFile);
                            }}
                            onRemove={file => {
                              deleteAfterJobPicture(file.id);
                            }}
                          />
                        </Col>
                      </Row>
                    </Card>
                    <Col span={24}>
                      {dtTruckMaterial !== null ? (
                        <Collapse activeKey={open} onChange={() => setOpen(prev => [1])}>
                          <Panel
                            header='Material used from the truck ?'
                            key='1'
                            onChange={() => {
                              setOpen(prev => [1]);
                            }}
                          >
                            <div className='ant-table ant-table-bordered'>
                              <div className='ant-table-container'>
                                <div className='ant-table-content'>
                                  <table style={{ tableLayout: " auto" }}>
                                    <thead className='ant-table-thead'>
                                      <tr>
                                        <th className='ant-table-cell'>Product Name</th>
                                        <th className='ant-table-cell'>Splr. Part</th>
                                        <th className='ant-table-cell'>Stocked</th>
                                        <th className='ant-table-cell'>Used Qty</th>
                                        <th className='ant-table-cell'>Used</th>
                                      </tr>
                                    </thead>
                                    <tbody className='ant-table-tbody'>
                                      {dtTruckMaterial?.map((item, index) => {
                                        return (
                                          <tr className='ant-table-row ant-table-row-level-0'>
                                            <td className='ant-table-cell'>{item.product_name}</td>
                                            <td className='ant-table-cell'>{item.supplier_part_number}</td>
                                            <td className='ant-table-cell'>{item.quantity}</td>
                                            <td className='ant-table-cell'>
                                              <InputNumber min={1} max={item.quantity} onBlur={e => handleMaterialUsed(e, item.id, false)} />
                                            </td>
                                            <td className='ant-table-cell'>
                                              <Switch size='large' checkedChildren='Yes' unCheckedChildren='No' onClick={e => handleMaterialUsed(e, item.id, true)} />
                                            </td>
                                          </tr>
                                        );
                                      })}
                                      <tr className='ant-table-row'>
                                        <td className='ant-table-cell' colSpan='5'>
                                          <textarea required onChange={e => setTruckMaterialNotes(e.target.value)} style={{ height: "150px", width: "98%" }}></textarea>
                                        </td>
                                      </tr>
                                      <tr className='ant-table-row'>
                                        <td className='ant-table-cell' align='center' colSpan='5'>
                                          <Button
                                            type='primary'
                                            style={{ background: "#1C78BC", float: "left", width: "50%" }}
                                            className='ant-btn-lg'
                                            onClick={() => {
                                              saveTruckMaterial();
                                            }}
                                          >
                                            {t("quick_setup_sub_contractors_modal_button_save")}
                                          </Button>
                                          &nbsp;
                                          <Button
                                            type='primary'
                                            style={{ background: "red", float: "right", width: "48%" }}
                                            className='ant-btn-lg'
                                            onClick={() => {
                                              setOpen(prev => [0]);
                                            }}
                                          >
                                            {t("quick_setup_organizations_modal_button_cancel")}
                                          </Button>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </div>
                          </Panel>
                        </Collapse>
                      ) : (
                        ""
                      )}
                    </Col>
                    <Row className='mt-3'>
                      <Col span={24}>
                        <span className='text-center'>
                          <Title level={5}>
                            {t("general_total_cost")}{" "}
                            <span className='text-danger ml-5'>
                              <b>{formatCurrency(dtJobInvoice?.total)}</b>
                            </span>
                          </Title>
                        </span>
                      </Col>
                    </Row>
                    <Row>
                      {jobStatus === "COMPLETED" ? (
                        <Col span={24}>
                          <Button
                            type='primary'
                            className='ant-btn-lg ant-col-24'
                            style={{ backgroundColor: "#7AA943" }}
                            onClick={() => {
                              setShowCustomerBill(true);
                            }}
                          >
                            {t("general_make_payment")}
                          </Button>
                        </Col>
                      ) : (
                        ""
                      )}
                      {jobStatus === "IN PROGRESS" ? (
                        <Col span={24} className='float-right'>
                          <Button
                            type='primary'
                            style={{ background: "#73A973 ", borderColor: "#4f814f" }}
                            className='ant-btn-lg ant-col-24 right-align'
                            onClick={() => {
                              setShowCustomerApprove(true);
                            }}
                          >
                            {t("general_customer_approval")}
                          </Button>
                        </Col>
                      ) : (
                        ""
                      )}
                    </Row>
                  </>
                ) : (
                  ""
                )}
              </Space>
            </Card>
          </Col>
        </Row>

        {/* CUSTOMER APPROVAL MODAL */}
        <Modal
          centered={true}
          visible={showCustomerApprove}
          onCancel={() => setShowCustomerApprove(false)}
          title={`Customer Work Satisfication`}
          bodyStyle={{}}
          footer={[
            <Button danger type='dashed' size='large' style={{ width: "48%" }} onClick={() => setShowCustomerApprove(false)}>
              Cancel
            </Button>,
            <Button className='bg-success' size='large' style={{ width: "48%" }} onClick={customerApprove}>
              Approve
            </Button>,
          ]}
        >
          <Row className=''>
            <Col span={24} className=''>
              <h3 className='flex'>
                {t("general_customer")}: {"  "} <span className='text-primary'>{job.customer && job.customer.full_name}</span>
                <span className='ml-auto'>
                  {t("general_job_#")} <span className='text-warning'>{job.id}</span>
                </span>
              </h3>
            </Col>
          </Row>
          <div className='box box-grey bg-blue p-1'>
            <Row gutter={8}>
              <Col span={8}>
                <b>{t("general_scheduled_for")}</b>
                <br />
                {moment(job.need_at).utc(false).format("YYYY-MM-DD HH:mm")}
              </Col>
              <Col span={8}>{job.discount_tag && <Badge count={job.discount_tag.name} key={job.discount_tag.name} />}</Col>
              <Col span={8}>
                <b>{t("general_billing_details")}</b>
                <br />
                {job.billing_address && job.billing_address.full_address}
              </Col>
            </Row>
            <hr />
            <Row gutter={8}>
              <Col span={8}>
                <b>{t("side_menu_navigation_quick_setup_sub_job_tags")}:</b>
                <br />
                {job.job_tags &&
                  job.job_tags.map(jt => {
                    return <Badge count={jt.name} key={jt.name} />;
                  })}
              </Col>
              <Col span={8}>
                <b>{t("quick_setup_service_types_grid_servie_type")}:</b>
                <br />
                <Badge count={job.service_type && job.service_type.name} style={{ color: "cyan" }} />
              </Col>
              <Col span={8}>
                <b>{t("quick_setup_customer_type_grid_heading_customer_type")}:</b>
                <br />
                <Badge count={job.customer && job.customer.customer_type.name} style={{ color: "yellow" }} />
              </Col>
            </Row>
          </div>

          <Row className=' mt-3'>
            <Col span={24}>
              <h3 className='flex'>Work Completed</h3>

              <p className='text-success'>
                {showMore ? afterNotesText.toString() : `${afterNotesText.toString().substring(0, 250)}`}
                {afterNotesText.toString().length > 250 ? (
                  <span className='ml-10'>
                    {" "}
                    . . .{" "}
                    <Button type='primary' size='medium' onClick={() => setShowMore(!showMore)}>
                      {" "}
                      {showMore ? "Show less" : "Show more"}
                    </Button>
                  </span>
                ) : (
                  ""
                )}
              </p>
            </Col>
          </Row>
          <div className=''>
            <Row className='mt-3'>
              <Col span={24} className='text-center' style={{ fontSize: "14px" }}>
                <Space size={12}>
                  <span className='text-bold'> Signature:</span>
                  <span>
                    <Signatue_Box sigCanvas={sigCanvas} />
                  </span>
                </Space>
              </Col>
            </Row>
            <Row>
              <Col span={24} className='text-center'>
                <button type='button' className='ant-btn ant-btn-dashed ant-btn-lg ant-btn-dangerous' onClick={() => handleClear()}>
                  {t("general_clear_signature")}
                </button>
              </Col>
            </Row>
          </div>
        </Modal>
        {/* JOB INVOICE MODAL */}
        {dtJobInvoice && job && showCustomerBill ? (
          <Modal
            centered={true}
            visible={showCustomerBill}
            onCancel={() => setShowCustomerBill(false)}
            title={`Tax Invoice`}
            bodyStyle={{}}
            footer={[
              <Button danger type='dashed' size='large' style={{ width: "48%" }} onClick={() => setShowCustomerBill(false)}>
                {t("quick_setup_organizations_modal_button_cancel")}
              </Button>,
              <Button
                className='bg-success'
                size='large'
                style={{ width: "48%" }}
                onClick={() => {
                  history.push({
                    pathname: `/technician/jobs/job-payment/${job.id}`,
                    dtJob: job,
                    nextStep: "job",
                  });
                }}
              >
                {t("general_make_payment")}
              </Button>,
            ]}
          >
            <Row className=''>
              <Col span={24} className=''>
                <h3 className='flex'>
                  <span className='text-primary'>{dtJobInvoice?.company_name}</span>
                  <span className='ml-auto'>
                    <img src={`data:image/png;base64,${dtJobInvoice.company_logo}`} width='50px' alt='logo' />
                  </span>
                </h3>
              </Col>
            </Row>
            <div className='box box-grey bg-blue p-1'>
              <Row gutter={8}>
                <Col span={12}>
                  <b>{t("general_invoice_date")}</b>: {moment(dtJobInvoice?.invoice_date).utc(false).format("YYYY-MM-DD")}
                  <br />
                  <b>{t("general_invoice#")}</b>: {dtJobInvoice?.id}
                  <br />
                  <b>ABN</b>: {dtJobInvoice?.acn_abn}
                </Col>
                <Col span={12}>
                  <b>{t("quick_setup_office_users_form_address")}</b>
                  <br />
                  {dtJobInvoice && dtJobInvoice?.address}
                </Col>
              </Row>
            </div>

            <Row className='mt-3'>
              <Col span={24} className=''>
                <h3 strong className='flex'>
                  <span className='text-primary'>Bill To</span>
                </h3>
              </Col>
            </Row>
            <div className='box box-grey bg-blue p-1'>
              <Row gutter={8}>
                <Col span={12}>
                  <b>{t("general_customer_name")}:</b> {dtJobInvoice?.job?.customer?.full_name}
                  <br />
                  <b>{t("general_customer_phone")}:</b> {dtJobInvoice?.job.contact_address?.mobile}
                  <br />
                  <b>{t("general_customer_email")}:</b> {dtJobInvoice?.job.customer?.email}
                </Col>
                <Col span={12}>
                  <b>{t("quick_setup_office_users_form_address")}</b>
                  <br />
                  {dtJobInvoice && dtJobInvoice?.job?.contact_address?.full_address}
                </Col>
              </Row>
            </div>

            {job !== null ? (
              <Row className='mt-3'>
                <Col span={24}>
                  <Card title={<Title level={5}>Bill Details</Title>}>
                    <Space span={24} direction='vertical' size='small' style={{ display: "flex" }}>
                      <Row>
                        <Col span={24}>
                          <div className='ant-table'>
                            <div className='ant-table-container'>
                              <div className='ant-table-content'>
                                <table style={{ tableLayout: "auto" }}>
                                  <thead className='ant-table-thead'>
                                    <tr>
                                      <th className='ant-table-cell ant-table-cell' style={{ textAlign: "left" }}>
                                        {t("general_description")}
                                      </th>
                                      <th className='ant-table-cell ant-table-cell' style={{ textAlign: "left" }}>
                                        {t("general_price")}
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody className='ant-table-tbody'>
                                    <tr className='ant-table-row ant-table-row-level-0 dx-row dx-data-row dx-row-lines dx-column-lines dx-row-alt'>
                                      <td className='ant-table-cell ant-table-cell' style={{ textAlign: "left" }}>
                                        <b>{t("general_job_fee")}</b>
                                      </td>
                                      <td className='ant-table-cell ant-table-cell' style={{ textAlign: "left" }}>
                                        <b>{formatCurrency(job.job_priority && (job.job_priority.fee || 0.0))}</b>
                                      </td>
                                    </tr>
                                    {job?.quotes[0]?.options[0]?.items.map((item, index) => {
                                      return (
                                        <tr className='ant-table-row ant-table-row-level-0 dx-row dx-data-row dx-row-lines dx-column-lines dx-row-alt'>
                                          <td className='ant-table-cell ant-table-cell' style={{ textAlign: "left" }}>
                                            <span className='text-success'>
                                              <b>{pascalCaseToTitle(item.title)}</b>
                                            </span>{" "}
                                            (tax incl. {formatCurrency(item.tax)})
                                          </td>
                                          <td className='ant-table-cell ant-table-cell' style={{ textAlign: "left" }}>
                                            <b className='text-success'>{formatCurrency(item.price)}</b>
                                          </td>
                                        </tr>
                                      );
                                    })}

                                    <tr className='ant-table-row ant-table-row-level-0 dx-row dx-data-row dx-row-lines dx-column-lines dx-row-alt'>
                                      <td className='ant-table-cell ant-table-cell' style={{ textAlign: "left" }}>
                                        <b>{t("general_discount")}</b>
                                      </td>
                                      <td className='ant-table-cell ant-table-cell' style={{ textAlign: "left" }}>
                                        <b>{formatCurrency(dtJobInvoice.discount)}</b>
                                      </td>
                                    </tr>
                                    {/* <tr className="ant-table-row ant-table-row-level-0 dx-row dx-data-row dx-row-lines dx-column-lines dx-row-alt">
                                      <td className="ant-table-cell ant-table-cell" style={{ textAlign: "left" }}>
                                        <b>Sub Total</b></td>
                                      <td className="ant-table-cell ant-table-cell" style={{ textAlign: "left" }}>
                                        <b>{formatCurrency(dtJobInvoice.sub_total)}</b></td>
                                    </tr> */}

                                    <tr className='ant-table-row ant-table-row-level-0 dx-row dx-data-row dx-row-lines dx-column-lines dx-row-alt'>
                                      <td className='ant-table-cell ant-table-cell' style={{ textAlign: "left" }}>
                                        <b>Total</b>
                                      </td>
                                      <td className='ant-table-cell ant-table-cell' style={{ textAlign: "left" }}>
                                        <b>{formatCurrency(dtJobInvoice?.total)}</b>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </Col>
                      </Row>
                    </Space>
                  </Card>
                </Col>
              </Row>
            ) : (
              <Row>
                <Col>
                  <Typography>{t("general_wait_for_loading_invoice_deatil")}</Typography>
                </Col>
              </Row>
            )}
          </Modal>
        ) : (
          ""
        )}

        {/* JOB CLOSE CONFIRMATION MODAL */}
        <Modal
          centered={true}
          visible={showJobCloseConfirm}
          onCancel={() => setShowJobCloseConfirm(false)}
          title={`Post Work Questionnaire`}
          bodyStyle={{}}
          footer={[
            <Button
              className='bg-success'
              size='large'
              style={{ width: "100%", backgroundColor: jobFinalStatus === "Close" ? "#FF0000 !important" : "#73A973 !important" }}
              onClick={() => {
                setJobStatusClosed();
              }}
            >
              {jobFinalStatus === "Close" ? "Save & Close the Job Card" : "Save & Mark as On Going"}
            </Button>,
          ]}
        >
          <Row className=''>
            <Col span={24} className=''>
              <h3 className='flex'>
                {t("general_customer")}: {"  "} <span className='text-primary'>{job.customer && job.customer.full_name}</span>
                <span className='ml-auto'>
                  {t("general_job_#")} <span className='text-warning'>{job.id}</span>
                </span>
              </h3>
            </Col>
          </Row>
          <Row className=' mt-3'>
            <Col span={24}>
              <Card title='Is this job complete?'>
                <Card.Grid style={{ width: "100%" }}>
                  <Switch size='large' checkedChildren='Yes' unCheckedChildren='No' onClick={e => handleQuestion(e, "job_completed_check")} />
                </Card.Grid>
                <Card.Grid style={{ width: "100%" }}>
                  {" "}
                  <textarea required onChange={e => saveQuestionNotes(1, e.target.value)} style={{ height: "150px", width: "98%" }}></textarea>
                </Card.Grid>
              </Card>
            </Col>
            <Col span={24}>
              <Card title='Has full payment been received?'>
                <Card.Grid style={{ width: "100%" }}>
                  <Switch size='large' checkedChildren='Yes' unCheckedChildren='No' onClick={e => handleQuestion(e, "full_payment_check")} />
                </Card.Grid>
                <Card.Grid style={{ width: "100%" }}>
                  {" "}
                  <textarea required onChange={e => saveQuestionNotes(2, e.target.value)} style={{ height: "150px", width: "98%" }}></textarea>
                </Card.Grid>
              </Card>
            </Col>
            <Col span={24}>
              <Card title='Has Before and After work photo been uploaded?'>
                <Card.Grid style={{ width: "100%" }}>
                  <Switch size='large' checkedChildren='Yes' unCheckedChildren='No' onClick={e => handleQuestion(e, "photo_upload_check")} />
                </Card.Grid>
                <Card.Grid style={{ width: "100%" }}>
                  {" "}
                  <textarea required onChange={e => saveQuestionNotes(3, e.target.value)} style={{ height: "150px", width: "98%" }}></textarea>
                </Card.Grid>
              </Card>
            </Col>
            <Col span={24}>
              <Card title='Has all the forms been filled in and submitted?'>
                <Card.Grid style={{ width: "100%" }}>
                  <Switch size='large' checkedChildren='Yes' unCheckedChildren='No' onClick={e => handleQuestion(e, "form_filled_check")} />
                </Card.Grid>
                <Card.Grid style={{ width: "100%" }}>
                  {" "}
                  <textarea required onChange={e => saveQuestionNotes(4, e.target.value)} style={{ height: "150px", width: "98%" }}></textarea>
                </Card.Grid>
              </Card>
            </Col>
            <Col span={24}>
              <Card title='Has material from truck been accounted for?'>
                <Card.Grid style={{ width: "100%" }}>
                  <Switch size='large' checkedChildren='Yes' unCheckedChildren='No' onClick={e => handleQuestion(e, "truck_material_check")} />
                </Card.Grid>
                <Card.Grid style={{ width: "100%" }}>
                  {" "}
                  <textarea required onChange={e => saveQuestionNotes(5, e.target.value)} style={{ height: "150px", width: "98%" }}></textarea>
                </Card.Grid>
              </Card>
            </Col>
          </Row>
        </Modal>

        {/* JOB BEFORE NOTES MODAL */}
        <Modal
          centered={true}
          visible={showBeforeNotes}
          onCancel={() => setShowBeforeNotes(false)}
          title={`Before Job Notes`}
          bodyStyle={{}}
          footer={[
            <Button type='danger' size='large' style={{ width: "48%", float: "left" }} onClick={() => setShowBeforeNotes(false)}>
              Close
            </Button>,
            <Button type='primary' size='large' style={{ width: "48%" }} onClick={setBeforeJobNotes}>
              Save
            </Button>,
          ]}
        >
          <Row className=''>
            <Col span={24} className=''>
              <h3 className='flex'>
                {t("general_customer")}: {"  "} <span className='text-primary'>{job.customer && job.customer.full_name}</span>
                <span className='ml-auto'>
                  {t("general_job_#")} <span className='text-warning'>{job.id}</span>
                </span>
              </h3>
            </Col>
          </Row>
          <Row className=' mt-3'>
            <Col span={24}>
              <Col span={24} className='text-center'>
                <textarea required onChange={e => setBeforeNotesText(e.target.value)} style={{ height: "500px", width: "98%" }} value={beforeNotesText}></textarea>
              </Col>
            </Col>
          </Row>
        </Modal>

        {/* JOB AFTER NOTES MODAL */}
        <Modal
          centered={true}
          visible={showAfterNotes}
          onCancel={() => setShowAfterNotes(false)}
          title={`After Job Notes`}
          bodyStyle={{}}
          footer={[
            <Button type='danger' size='large' style={{ width: "48%", float: "left" }} onClick={() => setShowAfterNotes(false)}>
              {t("general_close")}
            </Button>,
            <Button type='primary' size='large' style={{ width: "48%" }} onClick={setAfterJobNotes}>
              {t("general_save")}
            </Button>,
          ]}
        >
          <Row className=''>
            <Col span={24} className=''>
              <h3 className='flex'>
                {t("general_customer")}: {"  "} <span className='text-primary'>{job.customer && job.customer.full_name}</span>
                <span className='ml-auto'>
                  {t("general_job_#")} <span className='text-warning'>{job.id}</span>
                </span>
              </h3>
            </Col>
          </Row>
          <Row className=' mt-3'>
            <Col span={24}>
              <Col span={24} className='text-center'>
                <textarea required onChange={e => setAfterNotesText(e.target.value)} style={{ height: "500px", width: "98%" }} value={afterNotesText}></textarea>
              </Col>
            </Col>
          </Row>
        </Modal>
      </>
    );
};

export default Job_Start_Work;
