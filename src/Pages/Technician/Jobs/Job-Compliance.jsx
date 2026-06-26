/* eslint-disable react/jsx-pascal-case */
import React, { useEffect, useState, useCallback } from "react";
import { useHistory, useParams } from 'react-router-dom';
import { trackPromise } from "react-promise-tracker";
import { Row, Col, Typography, Card, Space, Button, Modal, Tabs, Form } from "antd";
import TechJobService from "Services/API/Technician/TechJobService";
import environment from "Environment";
import AuthService from "Services/AuthService";
import { notify } from "Services/ToastService";
import DefaultService from "Services/API/DefaultService";
import Form_ComplianceDocument from "./Components/Form_ComplianceDocument";
import _ from 'lodash';
import { toPng } from 'html-to-image';
import async from "async";
import moment from "moment";
import { useTranslation } from "react-i18next";

const { TabPane } = Tabs;
const { Title } = Typography;



const Job_Compliance = (props) => {

  const user = AuthService.getCurrentTechnician();
  const ORGANISATION_ID = user ? user.organisation_id : 0;
  const TECH_ID = user ? user.id : 0;

  let history = useHistory();
  let { jid } = useParams();
  const { dtJob } = props.location
  const [form] = Form.useForm();

  const [job, setJob] = useState(dtJob);
  const [dtJobComDoc, setJobComDoc] = useState(null)
  const [showComSection, setShowComSection] = useState(false);
  const [selectedComSection, setSelectedComSection] = useState({});
  const [dtJobComDocSection, setJobComDocSection] = useState(null)
  const [dtJobComDocSectionQuest, setJobComDocSectionQuest] = useState(null)
  const [dtJobComDocSectionAnswer, setJobComDocSectionAnswer] = useState(null)
  const [dtJobComDocSectionAnswerObj, setdtJobComDocSectionAnswerObj] = useState(null)
  const [selectedSection, setSelectedSection] = useState(0);
  const [selectedSectionID, setselectedSectionID] = useState(0);
  const [activeKey, setActiveKey] = React.useState('1')
  const [loader, setloader] = React.useState(document.querySelector(".loader"))
  const [complianceDocStatus, setComplianceDocStatus] = React.useState([])
  const [showStartButton, setStartButton] = React.useState(false)


  function fetchData() {
    return new Promise(async (resolve, reject) => {
      if (!job) {
        if (!jid) {
          return history.push("/technician/jobs/");
        }
        const { data } = await TechJobService.GetTechJob(jid);
        loader.classList.remove("loader--hide");
        setJob(data);
        getComplianceDoc(data);
        resolve(data);

      }
      else {
        getComplianceDoc(job);
        resolve(job);
      }
    })
  }

  const getComplianceDocStatus = async (jobComDoc, Job_ID) => {

    let arrObj = [];

    try {

      const arrayPromise = jobComDoc.map(async (doc) => {
        const _COM_DOC_PARAM = {
          "compliance_document_id": doc.id
        }
        const { data } = await trackPromise(
          DefaultService.POST(`/compliance_document/section/stats/${Job_ID}`, _COM_DOC_PARAM));
        if (data.every(x => x.is_answer === true)) {
          arrObj.push({ Com_ID: doc.id, flag: true });
          doc.flag = true;
        }
        else {
          arrObj.push({ Com_ID: doc.id, flag: false });
          doc.flag = false;
        }
      });

      await Promise.all(arrayPromise).then(() => {
        console.log('arrObj', arrObj)
        // arrObj.length > 0 ? arrObj.every(x => x.flag === true) ? setStartButton(true) : setStartButton(false) : setStartButton(false);
        arrObj.every(x => x.flag === true) ? setStartButton(true) : setStartButton(false);
        setComplianceDocStatus(arrObj);
      })

    } catch (error) {
      console.error('getComplianceDocStatus', error);
    }

  }


  useEffect(() => {
    window.scrollTo(0, 0);
    console.log("ORGANISATION_ID", ORGANISATION_ID);
    fetchData();
  }, [ORGANISATION_ID]);


  const getComplianceDoc = useCallback(async (job) => {

    const _COM_DOC_PARAM = {
      "condition": { "organisation_id": ORGANISATION_ID, "anchor": "JOB_START", "is_active": true, "is_pdf": false }
    }
    const { data: jobComDoc } = await trackPromise(
      DefaultService.POST(`/compliance_document/list/`, _COM_DOC_PARAM)
    );
    setJobComDoc(jobComDoc);
    getComplianceDocStatus(jobComDoc, job.id)
    loader.classList.add("loader--hide");
  }, [job]);

  const getComplianceDocSection = useCallback(async (Com_ID, Com_Text) => {
    setActiveKey("0");
    const _COM_DOC_SEC_PARAM = {
      "condition": { "organisation_id": ORGANISATION_ID, "compliance_document_id": Com_ID, "is_active": true }
    }
    setSelectedComSection({ ID: Com_ID, title: Com_Text });
    const { data: jobComDocSection } = await trackPromise(
      DefaultService.POST(`/compliance_document/section/list/`, _COM_DOC_SEC_PARAM)
    );
    //console.log('jobComDocSection', jobComDocSection)
    setJobComDocSection(jobComDocSection);
    getComplianceDocSectionQuest(jobComDocSection[selectedSection]);
  }, [job]);

  const getComplianceDocSectionQuest = async (item) => {

    const _COM_DOC_SEC_PARAM_QUEST = {
      "condition": { "organisation_id": ORGANISATION_ID, "compliance_document_section_id": item.id, "is_active": true }
    }

    setselectedSectionID(item.id);

    const { data: jobComDocSectionQuest } = await trackPromise(
      DefaultService.POST(`/compliance_document/question/list/`, _COM_DOC_SEC_PARAM_QUEST)
    );

    setJobComDocSectionQuest(jobComDocSectionQuest)
    getComplianceDocSectionAnswer(item, jobComDocSectionQuest);
  }

  const getComplianceDocSectionAnswer = async (item, JobComDocSectionQuest) => {

    const _COM_DOC_SEC_PARAM_ANSWER = {
      "condition": { "organisation_id": ORGANISATION_ID, "compliance_document_section_id": item.id, "is_active": true }
    }

    const { data: jobComDocSectionAnswer } = await trackPromise(
      DefaultService.POST(`/compliance_document/answer/list/`, _COM_DOC_SEC_PARAM_ANSWER)
    );

    setJobComDocSectionAnswer(jobComDocSectionAnswer);

    const _COM_DOC_SEC_PARAM_ANSWER_OBJ = {
      "condition": { "organisation_id": ORGANISATION_ID, "compliance_document_section_id": item.id, "job_id": job.id, "is_active": true }
    }

    const { data: dtJobComDocSectionAnswerObj } = await trackPromise(
      DefaultService.POST(`/compliance_document/form_object/list/`, _COM_DOC_SEC_PARAM_ANSWER_OBJ)
    );

    setdtJobComDocSectionAnswerObj(dtJobComDocSectionAnswerObj[0]);

    setShowComSection(true);

    form.resetFields();

    if (dtJobComDocSectionAnswerObj && dtJobComDocSectionAnswerObj[0] !== undefined) {
      let inputJSON = JSON.parse(JobComDocSectionQuest[0]?.input_json);
      //console.log('inputJSON.type', inputJSON.type)
      if (inputJSON.type.includes('potential-hazards')) {
        //console.log('potential-hazards form_json)', dtJobComDocSectionAnswerObj[0].form_json);
        form.setFieldsValue(dtJobComDocSectionAnswerObj[0].form_json);
      }
      else if (inputJSON.type.includes('verify-check')) {
        //console.log('verify-check form_json)', JSON.parse(dtJobComDocSectionAnswerObj[0].form_json));
        form.setFieldsValue(JSON.parse(dtJobComDocSectionAnswerObj[0].form_json));
      }
      else if (inputJSON.type.includes('name-sign-date')) {
        dtJobComDocSectionAnswerObj[0].form_json = JSON.parse(dtJobComDocSectionAnswerObj[0].form_json);

        let objKey = Object.keys(Object.values(Object.values(dtJobComDocSectionAnswerObj[0].form_json))[0]);
        //console.log('objKey', objKey)
        objKey.map((key) => {

          return dtJobComDocSectionAnswerObj[0].form_json.date[key] = moment(dtJobComDocSectionAnswerObj[0].form_json.date[key]);
        });

        form.setFieldsValue(dtJobComDocSectionAnswerObj[0].form_json);
      }
      else {
        dtJobComDocSectionAnswerObj.map((obj) => {
          obj.form_json = JSON.parse(obj.form_json);
          return Object.keys(obj.form_json).map((o) => {
            if (isNaN(obj.form_json[`${o}`]) && moment(moment(obj.form_json[`${o}`]).format('YYYY-MM-DD'), 'YYYY-MM-DD', true).isValid()) {
              obj.form_json[`${o}`] = moment(obj.form_json[`${o}`])
            }
          });
        });
        //console.log('dtJobComDocSectionAnswerObj[0].form_json', dtJobComDocSectionAnswerObj[0].form_json)
        form.setFieldsValue(dtJobComDocSectionAnswerObj[0].form_json);
      }
    }
  }

  const handleSectionChange = useCallback((e) => {
    setdtJobComDocSectionAnswerObj(null);
    setActiveKey(e);
    setSelectedSection(e);
    getComplianceDocSectionQuest(dtJobComDocSection[e]);
    console.log('handleSectionChange', complianceDocStatus);
    complianceDocStatus?.every(x => x.flag === true) ? setStartButton(true) : setStartButton(false)

  }, [dtJobComDocSection]);

  const drawSignature = (obj, key, callback) => {
    // console.log('obj.key', key)
    //Check the Answer Object if Signature Properties exist.
    if (key === 'signature') {
      //console.log('obj.hasOwnProperty', obj)
      //Loop all the Signature Key value and get Signature Textbox Parent Div.
      async.forEachOf(Object.keys(obj), (subItem, subItemIndex, subItemDone) => {
        //Pass Signature Textbox Parent Div to create image of it
        let pDoc = document.getElementById(`compliance_signature_${subItem}`);
        if (obj[subItem])
          //subItemDone();
          //console.log('obj.signature[subItem]', obj[subItem]);
          toPng(pDoc.parentNode)
            .then(function (dataUrl) {
              //console.log(dataUrl);
              //Update Signature property with the created signature
              obj[subItem] = dataUrl;
              subItemDone();
            });

      }, function (err) {
        callback();
      })
    }
    else { callback() }

  }

  const getQuestionInputType = (questionID) => {
    //console.log("QuesionID", questionID)
    let Obj = dtJobComDocSectionQuest.find(obj => obj.id == questionID);
    if (Obj) { return JSON.parse(Obj.input_json).type } else { return "Text" }
  }

  const combinedAnswers = (objAnswer) => {
    if (dtJobComDocSectionQuest[0].input_json.includes("name-sign-date")) {
      return objAnswer;
    }
    else if (dtJobComDocSectionQuest[0].input_json.includes("construction-2") || dtJobComDocSectionQuest[0].input_json.includes("jsa-details")) {
      return Array.isArray(objAnswer) ? objAnswer.reduce((acc = [], curr) => {
        //console.log('curr', curr)
        const keys = Object.keys(curr);
        keys.map((key) => {

          //console.log('key', key)
          let found = acc.find(i => i[key])
          //console.log('found', found);
          if (!found) {
            //console.log('objAnswer[key]', { [key]: curr[key] })
            acc.push({ [key]: curr[key] })
            //console.log('acc', acc);
          } else {
            found[key] = [found[key], curr[key]]
          }
          return acc;
        })
        return acc;
      }, []) : objAnswer
    }
    else {
      return objAnswer;
    }

  }

  const formatAnswers = (objAnswer) => {
    //let objAnswerFormatted = []; Start from here
    let objAnswerFormatted = {};

    if (dtJobComDocSectionQuest[0].input_json.includes("name-sign-date")) {
      //console.log('Object.keys(Object.values(objAnswer[0])[0])', Object.keys(Object.values(objAnswer)[0]));
      let objKey = Object.keys(Object.values(objAnswer)[0]);
      for (let i = 0; i < objKey.length; i++) {

        objAnswerFormatted = {
          ...objAnswerFormatted,
          [objKey[i]]: { [objKey[i]]: [{ 'type': `name-sign-date`, 'name': `${Object.values(Object.values(objAnswer)[0])[i]}`, 'signature': `${Object.values(Object.values(objAnswer)[1])[i]}`, 'date': `${Object.values(Object.values(objAnswer)[2])[i]}` }] }

        }
      }
      return objAnswerFormatted;
    } else if (dtJobComDocSectionQuest[0].input_json.includes("potential-hazards")) {
      //console.log('Object.keys(Object.values(objAnswer[0])[0]', Object.keys(Object.values(objAnswer)[0]));

      let objKey = Object.keys(Object.values(objAnswer)[0]);
      //console.log('objKey', objKey)
      for (let i = 0; i < objKey.length; i++) {
        objAnswerFormatted = {
          ...objAnswerFormatted,
          [objKey[i]]: { [objKey[i]]: [{ 'type': `potential-hazards`, 'hazards': `${Object.values(Object.values(objAnswer)[0])[i]}`, 'describe_hazards': `${Object.values(Object.values(objAnswer)[1])[i]}`, 'risk_level_1': `${Object.values(Object.values(objAnswer)[2])[i]}`, 'control_measure': `${Object.values(Object.values(objAnswer)[3])[i]}`, 'risk_level_2': `${Object.values(Object.values(objAnswer)[4])[i]}`, 'action_by': `${Object.values(Object.values(objAnswer)[5])[i]}` }] }

        }

      }

      return objAnswerFormatted;
    } else if (dtJobComDocSectionQuest[0].input_json.includes("construction-2") || dtJobComDocSectionQuest[0].input_json.includes("jsa-details")) {

      ;
      async.forEachOf(combinedAnswers(objAnswer), (answerKey, answerValue, answerCallBack) => {
        //console.log('jsa-details answerKey', answerKey);
        if (answerKey) {
          let newAnswer = `{ 'type':  '${answerValue === 'signature' ? getQuestionInputType(Object.keys(answerKey)) : getQuestionInputType(answerValue)}', value: [${answerValue === 'signature' ? Object.values(answerKey) : typeof answerKey === 'object' ? Object.values(answerKey) : `${answerKey}`}] }`;

          objAnswerFormatted = {
            ...objAnswerFormatted,
            [answerValue]: newAnswer

          }
        }
      });
      return objAnswerFormatted;
    }
    else {
      async.forEachOf(objAnswer, (answerKey, answerValue, answerCallBack) => {
        //console.log('answerValue', answerValue);
        //console.log('answerKey', answerKey);
        if (answerKey) {
          let newAnswer = {
            'type': `${getQuestionInputType(answerValue)}`, value: `${answerValue === 'signature' ? Object.values(answerKey) : answerKey}`
          }

          objAnswerFormatted = {
            ...objAnswerFormatted,
            [answerValue]: newAnswer

          }
        }

      });
      return objAnswerFormatted;
    }

  }
  const { t } = useTranslation();
  const onFinish = async (values) => {

    loader.classList.remove("loader--hide");
    //console.log('dtJobComDocSectionQuest', dtJobComDocSectionQuest);
    //console.log("Form Values", values);
    let objForm = JSON.parse(JSON.stringify(values));
    let objAnswer = [];

    if (values.questions !== undefined) {
      objAnswer = [values, ...values.questions];
      delete values.questions;
    }
    else {
      objAnswer = values;
    }

    //console.log('objAnswer', objAnswer);

    async.forEachOf({ ...objAnswer }, drawSignature)
      .then(async () => {

        let answers = formatAnswers(objAnswer);
        //console.log('formatedAnswers', answers);

        const _QUESTION_PARAM = {
          "organisation_id": ORGANISATION_ID, ...{ answers }
        };

        //console.log('_QUESTION_PARAM:', _QUESTION_PARAM);

        const { data } = await trackPromise(
          DefaultService.PUT(`/compliance_document/answer/save/${job.id}`, _QUESTION_PARAM));

        if (dtJobComDocSectionAnswerObj && dtJobComDocSectionAnswerObj !== undefined) {
          const _QUESTION_FORM_PARAM = {
            "form_json": JSON.stringify(objForm), "is_active": true
          }
          const { data, message, status } = await trackPromise(
            DefaultService.PUT(`/compliance_document/form_object/${dtJobComDocSectionAnswerObj.id}`, _QUESTION_FORM_PARAM));
          notify('Record saved successfully', status);

        }
        else {
          const _QUESTION_FORM_PARAM = {
            "organisation_id": ORGANISATION_ID, "job_id": job.id, "compliance_document_section_id": selectedSectionID, "form_json": JSON.stringify(objForm), "is_active": true
          }
          const { data, message, status } = await trackPromise(
            DefaultService.POST(`/compliance_document/form_object`, _QUESTION_FORM_PARAM));
          notify('Record saved successfully', status);
          setdtJobComDocSectionAnswerObj(data);
        }
        getComplianceDocStatus(dtJobComDoc, job.id);
        setShowComSection(false); window.scrollTo(0, 0);
        loader.classList.add("loader--hide");
      })
      .catch(err => {
        console.error(err);
      });



  };

  const onFinishFailed = (errorInfo) => {
    console.error('Failed:', errorInfo);
  };

  const setJobStatusStartWork = useCallback(async () => {

    await trackPromise(
      DefaultService.PUT(`/job/f_t/in_progress/${job.id}`, { field_technician_id: TECH_ID })
    )
    notify(`Job started successfully`, true);
    job.job_status.technician_status = "IN PROGRESS";
    history.push({
      pathname: `/technician/jobs/job-start-work/${job.id}`,
      flagStartButton: true,
      dtJob: job,
    });

  }, [job]);


  if (job === undefined)

    return (
      <>
        <Row>
          <Col span={24}>
            <Title level={4}>{t("general_compliance_forms")}</Title>

          </Col>
        </Row>
        <Row>
          <Col>
            <Typography>Wait for loading job compliance forms...</Typography>
          </Col>
        </Row>
      </>
    );
  else
    return (
      <>
        <Row>
          <Col span={24}>
            <Title level={4}>{t("general_compliance_forms")}</Title>
          </Col>
        </Row>

        <Row>
          <Col span={24}>
            <Card
              key={job.id}
              title={<Title level={5}>{job.customer?.full_name}</Title>}
              extra={<b>Job ID:{job.id}</b>}
            >
              {dtJobComDoc !== null ?
                <Row>
                  <Space span={24} direction="vertical" size="small" style={{ display: 'flex', width: "100%" }}>
                    {dtJobComDoc.map((item, index) => {
                      return <Col span={24}>
                        <Button size="large" style={{ width: "100%", backgroundColor: item.flag ? "green" : "" }} key={`${item.id}_${item.title}`} onClick={() => { getComplianceDocSection(item.id, item.title); }}>
                          {item.title}
                        </Button>
                      </Col>
                    })}

                    {showStartButton ? <Col span={24}>
                      <Button type="primary" size="large" style={{ width: "100%", background: "#73A973", borderColor: "#4f814f" }} onClick={setJobStatusStartWork}>
                        {t("general_start_work")}
                      </Button>
                    </Col> : ""}

                  </Space>
                </Row>
                : ""}

            </Card>
          </Col>
        </Row>
        {/* COMPLIANCE DOC SECTIONS & QUESTIONS */}
        <Modal
          forceRender
          centered={true}
          visible={showComSection}
          onCancel={() => { setShowComSection(false); loader.classList.add("loader--hide"); }}
          title={selectedComSection.title}
          bodyStyle={{}}
          footer={[
            // <Button type="danger" size="large" style={{ width: "100%" }} onClick={() => setShowComSection(false)}>
            //   Close
            // </Button>,
            // <Button type="primary" size="large" style={{ width: "48%" }} /*onClick={setBeforeJobNotes}*/>
            //   Save
            // </Button>
          ]}
        >
          <Row>
            <Col span={24}>
              <Tabs defaultActiveKey="0" activeKey={activeKey} onChange={handleSectionChange}>
                {dtJobComDocSection === null ? "" : dtJobComDocSection.map((item, index) => {
                  return <TabPane
                    tab={item.title}
                    key={`${index}`}
                  >
                  </TabPane>
                })}

              </Tabs>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form
                form={form}
                name="compliance"
                labelAlign="left"
                labelWrap
                labelCol={{
                  span: 24,
                }}
                wrapperCol={{
                  span: 16,
                }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
                layout="vertical"
              >
                {dtJobComDocSectionQuest !== null ? <Form_ComplianceDocument docSectionQuest={dtJobComDocSectionQuest} docSectionQuestAnsObj={dtJobComDocSectionAnswerObj ? dtJobComDocSectionAnswerObj : undefined} /> : <Form_ComplianceDocument docSectionQuest={[]} docSectionQuestAnsObj={[]} />}
                <Form.Item
                  wrapperCol={{
                    offset: 8,
                    span: 16,
                  }}
                >
                  <Button type="primary" htmlType="submit">
                    {t("general_save")}
                  </Button>
                  &nbsp;
                  <Button type="danger" htmlType="button" onClick={() => { setShowComSection(false); window.scrollTo(0, 0); loader.classList.add("loader--hide") }}>
                    {t("quick_setup_organizations_modal_button_cancel")}
                  </Button>
                </Form.Item>
              </Form>
            </Col></Row>
        </Modal>
      </>
    );
};

export default Job_Compliance;
