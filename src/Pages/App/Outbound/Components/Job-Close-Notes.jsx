import React, { useEffect, useState, useCallback } from "react";
import { useHistory, useParams } from "react-router-dom";
import { trackPromise } from "react-promise-tracker";
import { Row, Col, Typography, Card, Space, Button } from "antd";
import TechJobService from "Services/API/Technician/TechJobService";
import environment from "Environment";
import AuthService from "Services/AuthService";
import { alertify, notify } from "Services/ToastService";
import DefaultService from "Services/API/DefaultService";

const { Title } = Typography;
const user = AuthService.getCurrentTechnician();
const TECH_ID = null; //user ? user.id : 0;
const ORGANISATION_ID = user ? user.organisation_id : 0;

const Job_Close_Notes = ({ jid, dtJob, jobNoteSaved }) => {
  const [job, setJob] = useState(dtJob);
  const [jobNotes, setJobNotes] = useState(null);
  const [jobNotesText, setJobNotesText] = useState("");
  const [jobNotesUpdate, setJobNotesUpdate] = useState(false);

  function fetchData() {
    return new Promise(async (resolve, reject) => {
      if (!job) {
        if (!jid) {
          //return history.push("/technician/jobs/");
          alertify(
            "There is an error. No job and quote selected for job notes",
            false
          );
          return;
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
      getJobNotes(data);
    });
  }, []);

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
  }, []);

  const setJobStatusClosed = useCallback(async () => {
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
      DefaultService.PUT(`/job/f_t/closed/${job.id}`, {
        field_technician_id: TECH_ID,
      })
    );
    // history.push({
    //   pathname: `/technician/jobs`,
    // });
    // alertify(
    //   "Sorry job cannot be closed from this screen. Please contact admin for more information.",
    //   false
    // );
    jobNoteSaved(job);
  }, [jobNotesText]);

  if (job === undefined)
    return (
      <>
        <Row>
          <Col span={24}>
            <Title level={4}>Job Notes</Title>
          </Col>
        </Row>
        <Row>
          <Col>
            <Typography>Wait for loading job detail...</Typography>
          </Col>
        </Row>
      </>
    );
  else
    return (
      <>
        <Row>
          <Col span={24}>
            <Title level={4}>Job Notes</Title>
          </Col>
        </Row>

        <Row gutter={5}>
          <Col span={24}>
            <Card
              gutter={5}
              key={job.id}
              title={<Title level={5}>{job.customer.full_name}</Title>}
              extra={<b>Job ID:{job.id}</b>}
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

                <Row>
                  <Col span={24} className="text-center push-center">
                    <Button
                      type="danger"
                      className="ant-btn-lg"
                      style={{ width: "30%" }}
                      onClick={setJobStatusClosed}
                    >
                      Save & Close The Job Card
                    </Button>

                    <Button
                      visible={false}
                      className="ant-btn-lg"
                      style={{ width: "90%", display: "none" }}
                      onClick={() => {
                        // history.push({
                        //   pathname: `/technician/jobs/job-payment/${job.id}`,
                        //   nextStep: "close",
                        // });
                        alertify(
                          "Sorry no payment can be made from this screen. Please contact admin for more information.",
                          false
                        );
                      }}
                    >
                      Make Payment
                    </Button>
                  </Col>
                </Row>
              </Space>
            </Card>
          </Col>
        </Row>
      </>
    );
};

export default Job_Close_Notes;
