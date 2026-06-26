import React, { useState, useEffect, useContext } from "react";

import { trackPromise } from "react-promise-tracker";
import { alertify, notify } from "Services/ToastService";

import {
  Checkbox,
  Col,
  Form,
  Row,
  Button,
  Modal,
  Tooltip,
  Popconfirm,
} from "antd";
import DefaultService from "Services/API/DefaultService";
import Context from "Store/Context";
import PageTitle from "../_Common/PageTitle";
import Form_ComplianceDocument from "./Components/Form_ComplianceDocument";
import {
  DeleteColumnOutlined,
  DeleteFilled,
  PlusCircleOutlined,
} from "@ant-design/icons";
import SvApiUploader from "Components/Common/SvApiUploader";
import environment from "Environment";
import PdfPreview from "../_Common/PdfPreview";
import BaseApiService from "Services/BaseApiService";

const ComplianceDocuments = (props) => {
  const ENTITY_PLURAL = "Compliance Documents";
  const ENTITY_API_KEY = "Settings_Compliance_Document";

  const { curOrg: organisation } = useContext(Context);
  const [form] = Form.useForm();

  const [data, setData] = useState();
  const [recordToEdit, setRecordToEdit] = useState();

  const [anchors, setAnchors] = useState();

  const [selectedDoc, setSelectedDoc] = useState(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [pdfVisible, setPdfVisible] = useState(false);
  const [uploadedDoc, setUploadedDoc] = useState();
  const [selectedPdf, setSelectedPdf] = useState();
  const [fileNumber, setFileNumber] = useState(1);
  useEffect(async () => {
    if (organisation) {
      const { data: anchors } = await trackPromise(
        DefaultService.GetComplianceDocumentAnchors({
          organisation_id: organisation.id,
        })
      );
      setAnchors(anchors);
      await handleSearch();
    }
  }, [organisation]);

  useEffect(() => {
    form.resetFields();
  }, [recordToEdit]);

  const handleSearch = async () => {
    let { data } = await trackPromise(
      DefaultService.Entity_List(ENTITY_API_KEY, {
        organisation_id: organisation.id,
      })
    );
    //notify(message, status);
    setData(data);
  };

  // const handleCheckChanged = (selIds) => {
  //   //checkedIds = v;
  //   var result = _.filter(data, function (d) {
  //     return _.includes(selIds, d.id);
  //   });
  //   console.log(result);
  // };

  const handleView = async (doc_id, pdf_path, is_pdf) => {
    setPdfVisible(false);
    setDetailVisible(false);

    if (is_pdf) {
      const { data: d } = await BaseApiService.DownloadFile(
        "GET",
        `/pdf/compliance_document/${pdf_path}`,
        null,
        true
      );

      console.log("file", d);

      setSelectedPdf(d);
      setPdfVisible(true);
    } else {
      let { data } = await trackPromise(
        DefaultService.Entity_Get(ENTITY_API_KEY, doc_id)
      );
      console.log(data);
      setSelectedDoc(data);
      setDetailVisible(true);
    }
  };

  const handleDelete = async (doc_id) => {
    let { data, status, message } = await trackPromise(
      DefaultService.Entity_Delete(ENTITY_API_KEY, doc_id)
    );

    notify(message, status);
    await handleSearch();
  };

  const handleClose = () => {
    setSelectedDoc(null);
    setDetailVisible(false);
    setPdfVisible(false);
  };

  const UploadComplianceDoc = async () => {
    if (!uploadedDoc || !uploadedDoc?.name || !uploadedDoc?.path) {
      alertify(
        "No valid document was uploaded before saving compliance document",
        false
      );
      return;
    }
    let record = {
      organisation_id: organisation.id,
      title: uploadedDoc.name,
      anchor: "JOB_START",
      is_pdf: true,
      pdf_path: uploadedDoc.path,
      is_active: true,
      sections: [],
    };

    const { status, message } = record.id
      ? await trackPromise(DefaultService.Entity_Update(ENTITY_API_KEY, record))
      : await trackPromise(DefaultService.Entity_Add(ENTITY_API_KEY, record));

    notify(message, status);
    if (status) {
      alertify("Compliance Document Uploaded successfully", true, 5000);
      setUploadedDoc(null);
      setFileNumber(fileNumber + 1);
      await handleSearch();
    } else {
      alertify("Failed to save compliance document", false, 5000);
    }
  };

  return (
    (organisation && (
      <>
        <Modal
          title={selectedDoc ? selectedDoc.title : ""}
          visible={detailVisible}
          width={900}
          onCancel={handleClose}
          onOk={handleClose}
        >
          <Form_ComplianceDocument doc={selectedDoc} />
        </Modal>

        <Modal
          title={selectedDoc ? selectedDoc.title : ""}
          visible={pdfVisible}
          width={800}
          onCancel={handleClose}
          onOk={handleClose}
        >
          {selectedPdf && <PdfPreview file={selectedPdf} />}
        </Modal>
        <div className="flex mb-2">
          <PageTitle />
          <h3 className="push-right text-right">
            <Tooltip
              title={`Do you have more ${ENTITY_PLURAL}? Click here to upload PDF`}
            >
              <Button
                className="bg-success"
                icon={<PlusCircleOutlined />}
                onClick={UploadComplianceDoc}
              >
                {"Upload Compliance Document (PDF)"}
              </Button>
            </Tooltip>
          </h3>
        </div>

        <div className="flex grey-box mt-5 pt-5">
          <Row>
            {data &&
              // <Checkbox.Group options={data.map((d) => ({ label: d.title, value: d.id }))} onChange={handleCheckChanged} />

              data.map((d, i) => {
                return (
                  <Col xl={8} xs={24} key={i}>
                    <Checkbox
                      className="text-larger"
                      checked={d.is_active}
                      onChange={async (e) => {
                        d.is_active = e.target.checked;
                        const { status, message } = await trackPromise(
                          DefaultService.Entity_Update(ENTITY_API_KEY, d)
                        );
                        notify(message, status);
                        status && handleSearch();
                      }}
                    >
                      {d.title}
                    </Checkbox>
                    <Button
                      type="link"
                      onClick={() => handleView(d.id, d.pdf_path, d.is_pdf)}
                    >
                      View
                    </Button>
                    {d.is_pdf && (
                      <>
                        |
                        <Popconfirm
                          title={`Are you sure to remove this compliance document`}
                          onConfirm={async (event) => {
                            event.stopPropagation();
                            await handleDelete(d.id);
                          }}
                        >
                          <Button type="link" danger>
                            <DeleteFilled />
                          </Button>
                        </Popconfirm>
                      </>
                    )}
                  </Col>
                );
              })}
          </Row>
        </div>

        <div className="flex mt-5 ml-auto mr-auto box ">
          <Col
            span={24}
            style={{ textAlign: "center", alignItems: "center middle" }}
          >
            <h3> {"Upload New Compliance Document (PDF)"}</h3> <br />
            <SvApiUploader
              key={fileNumber}
              endpoint={`${environment.API.BASE_URL}${environment.API.VERSION}${environment.ENDPOINTS.UPLOAD_COMPLIANCE_DOC}`}
              fileType="document"
              multiple={false}
              maxCount={1}
              sizeLimit={20}
              defaultMessage="Only PDF files allowed"
              onFileUploaded={({ name, path }) => {
                setUploadedDoc({ name, path });

                //UploadComplianceDoc(name, path);
              }}
            />
            <br />
            <Button
              type="primary"
              className="mt-3 mb-5"
              onClick={UploadComplianceDoc}
              disabled={!uploadedDoc}
            >
              Save Compliance Document
            </Button>
          </Col>
        </div>
      </>
    )) || <h3>You need to select an organisation first</h3>
  );
};

export default ComplianceDocuments;
