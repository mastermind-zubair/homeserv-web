import React, { useEffect, useState, useCallback } from "react";
import { useHistory, useParams } from "react-router-dom";
import { trackPromise } from "react-promise-tracker";
import { Row, Col, Typography, Card, Space, Button, Modal } from "antd";
import SvApiUploaderJob from "Components/Common/SvApiUploaderJob";
import TechJobService from "Services/API/Technician/TechJobService";
import environment from "Environment";
import AuthService from "Services/AuthService";
import { notify } from "Services/ToastService";
import DefaultService from "Services/API/DefaultService";
import { useTranslation } from "react-i18next";

const { Title } = Typography;
const user = AuthService.getCurrentTechnician();
const TECH_ID = user ? user.id : 0;
const ORGANISATION_ID = user ? user.organisation_id : 0;

const Job_Notes = (props) => {
  let history = useHistory();
  let { jid } = useParams();
  const { t } = useTranslation();

  const { dtJob } = props.location;
  const [job, setJob] = useState(dtJob);
  const [showJobNotes, setShowJobNotes] = useState(false);
  const [dtBeforeJobPic, setBeforeJobPic] = useState(null);
  const [jobNotes, setJobNotes] = useState(null);
  const [jobNotesText, setJobNotesText] = useState("");
  const [jobNotesUpdate, setJobNotesUpdate] = useState(false);
  const [beforeNotes, setBeforeNotes] = useState(null);
  const [beforeNotesText, setBeforeNotesText] = useState("");
  const [beforeNotesUpdate, setBeforeNotesUpdate] = useState(false);

  function fetchData() {
    return new Promise(async (resolve, reject) => {
      if (!job) {
        if (!jid) {
          return history.push("/technician/jobs/");
        }
        const { data } = await TechJobService.GetTechJob(jid);
        setJob(data);
        resolve(data);
      } else {
        resolve(job);
      }
    });
  }

  useEffect(() => {
    fetchData().then((data) => {
      getBeforeJobPic(data);
      getJobNotes(data);
    });
  }, []);

  const getBeforeJobPic = useCallback(async (job) => {
    let param_media_before = {
      condition: {
        organisation_id: ORGANISATION_ID,
        job_id: job.id,
        type: "BEFORE",
      },
    };
    let { data } = await TechJobService.getJobUPloadedPic(param_media_before);
    data.forEach((element) => {
      element.url = environment.PATH_JOB_MEDIA + "/" + element.file_path;
      element.status = "done";
      element.thumbUrl = environment.PATH_JOB_MEDIA + "/" + element.file_path;
    });
    setBeforeJobPic(data);
  }, []);

  const uploadBeforeJobPic = async (picture) => {
    await TechJobService.uploadPicJobPicture(picture);
    notify(`Before job picture uploaded successfully`, true);
    getBeforeJobPic(job);
  };

  const deleteBeforeJobPicture = async (id) => {
    await trackPromise(DefaultService.DELETE(`/job/media/${id}`));
    notify(`Before job picture deleted successfully`, true);
    getBeforeJobPic(job);
  };

  const getJobNotes = useCallback(async (job) => {
    const _NOTES_PARAM = {
      condition: {
        organisation_id: ORGANISATION_ID,
        job_id: job.id,
        note_key: environment.NOTES.JOB_NOTES,
      },
    };

    const jobNotes = await trackPromise(
      DefaultService.POST(`/job/note/list`, _NOTES_PARAM)
    );

    if (jobNotes.data[0] !== undefined) {
      setJobNotes(jobNotes);
      if (jobNotes.data[0] !== undefined) {
        setJobNotesText(jobNotes.data[0].note);
      }
      setJobNotesUpdate(true);
    }

    const _BEFORE_NOTES_PARAM = {
      condition: {
        organisation_id: ORGANISATION_ID,
        job_id: job.id,
        note_key: environment.NOTES.BEFORE_JOB_NOTES,
      },
    };

    const beforeNotes = await trackPromise(
      DefaultService.POST(`/job/note/list`, _BEFORE_NOTES_PARAM)
    );
    if (beforeNotes.data !== undefined) {
      setBeforeNotes(beforeNotes);
      setBeforeNotesText(beforeNotes.data[0]?.note);
      setBeforeNotesUpdate(true);
    }
  }, []);

  const setJobStatusOnGoing = useCallback(async () => {
    if (jobNotesText === "") {
      return notify(`Job notes are required`, false);
    }
    if (jobNotesUpdate) {
      const _Notes_Param = {
        note: jobNotesText,
      };
      await trackPromise(
        DefaultService.PUT(`/job/note/${jobNotes.data[0].id}`, _Notes_Param)
      );
    } else {
      const _Notes_Param = {
        organisation_id: ORGANISATION_ID,
        job_id: job.id,
        note_key: environment.NOTES.JOB_NOTES,
        note: jobNotesText,
        is_active: true,
      };
      await trackPromise(DefaultService.POST(`/job/note`, _Notes_Param));
    }

    await trackPromise(
      DefaultService.PUT(`/job/f_t/on_going/${job.id}`, {
        field_technician_id: TECH_ID,
      })
    );
    history.push({
      pathname: `/technician/jobs`,
    });
  }, [jobNotesText]);

  const setBeforeJobNotes = useCallback(async () => {
    if (beforeNotesText === "") {
      return notify(`Before job notes are required`, false);
    }
    if (beforeNotesUpdate) {
      const _Notes_Param = {
        note: beforeNotesText,
      };
      await trackPromise(
        DefaultService.PUT(`/job/note/${beforeNotes.data[0].id}`, _Notes_Param)
      );
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
    setShowJobNotes(false);
  }, []);

  if (job === undefined)
    return (
      <>
        <Row>
          <Col span={24}>
            <Title level={4}>{t("general_job_notes")}</Title>
          </Col>
        </Row>
        <Row>
          <Col>
            <Typography>
              {" "}
              {t("general_wait_for_loading_job_detail")}{" "}
            </Typography>
          </Col>
        </Row>
      </>
    );
  else
    return (
      <>
        <Row>
          <Col span={24}>
            <Title level={4}>{t("general_job_notes")}</Title>
          </Col>
        </Row>

        <Row gutter={5}>
          <Col span={24}>
            <Card
              gutter={5}
              key={job.id}
              title={<Title level={5}>{job.customer?.full_name}</Title>}
              extra={
                <b>
                  {t("general_job_id")}:{job.id}
                </b>
              }
            >
              <Space
                span={24}
                direction="vertical"
                size="small"
                style={{ display: "flex" }}
              >
                <Row>
                  <Col span={24}>
                    <textarea
                      onChange={(e) => setJobNotesText(e.target.value)}
                      style={{ height: "200px", width: "98%" }}
                      value={jobNotesText}
                    ></textarea>
                  </Col>
                </Row>
                <Card
                  gutter={5}
                  title={
                    <Title level={5}>
                      Upload Before Job Images
                      <br />
                      <span style={{ fontSize: "9px", color: "#D46874" }}>
                        (only jpeg,png,bmp allowed)
                      </span>
                    </Title>
                  }
                  extra={
                    <Button
                      type="danger"
                      size="medium"
                      onClick={() => setShowJobNotes(true)}
                    >
                      Job Notes
                    </Button>
                  }
                >
                  <Row>
                    <Col span={24}>
                      <SvApiUploaderJob
                        endpoint={`${environment.API.BASE_URL}${environment.API.VERSION}/upload/job_media`}
                        fileType="picture"
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
                        onRemove={(file) => {
                          deleteBeforeJobPicture(file.id);
                        }}
                      />
                    </Col>
                  </Row>
                </Card>

                <Row>
                  <Col span={24}>
                    <Button
                      type="primary"
                      className="ant-btn-lg ant-col-24"
                      onClick={() => {
                        history.push({
                          pathname: `/technician/jobs/job-purchase-order-list/${job.id}/job-notes`,
                          dtJob: job,
                        });
                      }}
                    >
                      {t("general_add_purchase_order")}
                    </Button>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <Button
                      type="primary"
                      className="ant-btn-lg ant-col-24"
                      style={{ backgroundColor: "#7AA943" }}
                      onClick={setJobStatusOnGoing}
                    >
                      {t("general_save_mark_as_Ongoing")}
                    </Button>
                  </Col>
                </Row>
              </Space>
            </Card>
          </Col>
        </Row>
        {/* JOB NOTES MODAL */}
        <Modal
          centered={true}
          visible={showJobNotes}
          onCancel={() => setShowJobNotes(false)}
          title={`Job Notes`}
          bodyStyle={{}}
          footer={[
            <Button
              type="danger"
              size="large"
              style={{ width: "48%", float: "left" }}
              onClick={() => setShowJobNotes(false)}
            >
              {t("general_close")}
            </Button>,
            <Button
              type="primary"
              size="large"
              style={{ width: "48%" }}
              onClick={setBeforeJobNotes}
            >
              {t("general_save")}
            </Button>,
          ]}
        >
          <Row className="">
            <Col span={24} className="">
              <h3 className="flex">
                {t("general_customer")}: {"  "}{" "}
                <span className="text-primary">
                  {job.customer && job.customer?.full_name}
                </span>
                <span className="ml-auto">
                  {t("general_job_#")}{" "}
                  <span className="text-warning">{job.id}</span>
                </span>
              </h3>
            </Col>
          </Row>
          <Row className=" mt-3">
            <Col span={24}>
              <Col span={24} className="text-center">
                <textarea
                  required
                  onChange={(e) => setBeforeNotesText(e.target.value)}
                  style={{ height: "500px", width: "98%" }}
                  value={beforeNotesText}
                ></textarea>
              </Col>
            </Col>
          </Row>
        </Modal>
      </>
    );
};

export default Job_Notes;
