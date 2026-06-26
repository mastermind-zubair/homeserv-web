import { useEffect, useContext, useState, useTransition } from "react";
import { CloseButton, FormButtons } from "Components/Common/FormButtons";

import Context from "Store/Context";
import React from "react";
import { useTranslation } from "react-i18next";
import { trackPromise } from "react-promise-tracker";
import DefaultService from "Services/API/DefaultService";

import JobSelection from "./JobSelection";
import Job_Estimate_Main from "./Job-Estimate-Main";
import Job_Estimate_Present from "./Job-Estimate-Present";
import { ClearOutlined } from "@ant-design/icons";
import Job_Close_Notes from "./Job-Close-Notes";

const { Modal, Space, Button } = require("antd");

const { LoadingPanelForPopup } = require("Layout/LoadingPanels");

const Form_Quotes_New = ({
  form,
  showForm,
  recordToEdit,
  handleCancel,
  onFinish,
  onFinishFailed,
  ENTITY,
  data,
}) => {
  const { curOrg: organisation } = useContext(Context);
  const { t } = useTranslation();
  const [job, setJob] = useState();
  const [quote, setQuote] = useState();

  const [status, setStatus] = useState(0); //0: New, 1: Job Selected, 2: Quote Estimated, 3: Quote Presented 4: Job Note saved

  const jobSelected = (job, quote) => {
    setJob(job);
    setQuote(quote);
    if (job && job?.id) setStatus(1);
  };

  const quoteEstimated = (job, quote) => {
    setJob(job);
    setQuote(quote);
    if (quote && quote?.id) setStatus(2);
  };

  const quotePresented = (job, quote) => {
    //setJob(job);
    setQuote(quote);
    if (quote && quote?.id) setStatus(3);
  };

  const jobNoteSaved = (job) => {
    setJob(job);
    if (job && job?.id) setStatus(4);
  };

  useEffect(async () => {}, [form, recordToEdit]);

  return (
    <Modal
      title={`Add New ${ENTITY}`}
      visible={showForm}
      width={1024}
      height={500}
      style={{ height: "500px" }}
      // onOk={handleSave}
      onCancel={handleCancel}
      footer={
        [
          /*<CloseButton handleCancel={handleCancel} />*/
        ]
      }
    >
      <LoadingPanelForPopup />
      <div className="mb-5 text-right">
        <b>Organisation: </b>
        <b className="text-danger">{organisation?.name}</b>
      </div>

      <div className="" style={{ minHeight: "300px", alignItems: "center" }}>
        {status === 0 && (
          <JobSelection
            jobSelected={jobSelected}
            nextButtonTitle="Create Quote"
          />
        )}
        {status === 1 && (
          <Job_Estimate_Main
            jid={job.id}
            qid={quote?.id}
            quoteEstimated={quoteEstimated}
          />
        )}

        {status === 2 && (
          <Job_Estimate_Present
            jid={job?.id}
            qid={quote?.id}
            jobSelected={jobSelected}
            quotePresented={quotePresented}
          />
        )}

        {status === 3 && (
          <Job_Close_Notes
            jid={job.id}
            qid={quote.id}
            jobNoteSaved={jobNoteSaved}
          />
        )}

        {status === 4 && (
          <div className="text-center push-center">
            <h3 className="text-success">
              A new quote sucesssfully created. You can close this window now.
              Thanks
            </h3>
            <br />
            <div>
              <Button onClick={onFinish}>Close</Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default Form_Quotes_New;
