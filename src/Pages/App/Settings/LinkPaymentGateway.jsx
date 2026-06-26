import React, { useState, useEffect, useContext } from "react";

import { trackPromise } from "react-promise-tracker";
import { notify } from "Services/ToastService";

import { Button, Card, Col, Form, Image, Row, Space, Tooltip } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";

import CustomDataGrid from "Components/DevEx/CustomDataGrid";

import DefaultService from "Services/API/DefaultService";
import Form_LinkPaymentGateway from "./Components/Form_LinkPaymentGateway";
import Context from "Store/Context";
import PageTitle from "../_Common/PageTitle";
import Form_LinkAccountingIntegration from "./Components/Form_LinkAccountingIntegration";
import { useTranslation } from "react-i18next";

const LinkPaymentGateway = (props) => {
  const ENTITY = "Payment Gateway";
  const ENTITY_PLURAL = "Payment Gateway";
  const ENTITY_API_KEY = "Settings_Payment_Gateway";

  const { curOrg: organisation } = useContext(Context);
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [showEditForm, setShowEditForm] = useState(false);
  const [showIntegrationForm, setShowIntegrationForm] = useState(false);

  const [data, setData] = useState();
  const [recordToEdit, setRecordToEdit] = useState();


  useEffect(async () => {
    if (organisation) {
      await handleSearch();
    }
  }, [organisation]);

  useEffect(() => {
    if (recordToEdit && recordToEdit.id === 0) {
      recordToEdit.ranges = [];
    }
    form.resetFields();
  }, [recordToEdit]);

  const handleSearch = async () => {
    let { data, status, message } = await trackPromise(
      DefaultService.Entity_List(ENTITY_API_KEY, {
        organisation_id: organisation && organisation.id,
      })
    );
    !status && notify(message, status);
    setData(data);
  };
  const handleEdit = async (item) => {
    console.log("Edit Handler", item);

    let record = {};
    if (item.id) {

      record = { ...item };

      if (record.name === 'STRIPE') {
        let objAPIKey = JSON.parse(record.description);
        record.published_key = objAPIKey.published_key;
        record.secret_key = objAPIKey.secret_key;
      }
    } else {
      record.organisation_id = organisation.id;
    }
    setRecordToEdit(record);

    setShowEditForm(true);
  };


  const handleDelete = async (item) => {

    let { status, message } = await trackPromise(
      DefaultService.Entity_Delete(ENTITY_API_KEY, item.id)
    );
    notify(message, status);
    await handleSearch();
  };

  const handleCancel = () => {
    setShowEditForm(false);
    setShowIntegrationForm(false);
  };

  const onFinish = async (values) => {
    let record = values;

    console.log("Record to save", record);
    record.description = JSON.stringify({ published_key: record.published_key, secret_key: record.secret_key });

    const { status, message } = record.id
      ? await trackPromise(DefaultService.Entity_Update(ENTITY_API_KEY, record))
      : await trackPromise(DefaultService.Entity_Add(ENTITY_API_KEY, record));

    notify(message, status);
    if (status) {
      setRecordToEdit({});
      setShowEditForm(false);
      handleSearch();
    }
  };
  const onFinishFailed = async () => {
    notify("Please provide all the required input fields", false);
  };

  const columns = [
    // {
    //   caption: "Organisation",
    //   dataField: "organisation.name",
    //   dataType: "string",
    //   alignment: "left",
    // },
    {
      caption: "Payment Gateway",
      dataField: "name",
      dataType: "string",
      alignment: "left",
    },

    {
      caption: t("label_active"),
      dataField: "is_active",
      dataType: "string",
      alignment: "center",
      showAllText: "All Records",
    }
  ];

  return (
    (organisation && (
      <>
        <div className="flex mb-2">
          <PageTitle />
          <h3 className="push-right text-right">
            <Tooltip
              title={`Do you have more ${ENTITY_PLURAL}? Click here to add another`}
            >
              <Button
                className="bg-success"
                icon={<PlusCircleOutlined />}
                onClick={handleEdit}
              >
                {t("general_add_new")} {ENTITY}
              </Button>
            </Tooltip>
          </h3>
        </div>
        {organisation && (
          <Row>
            <Col xl={24} xs={24} className="mb-2">
              <Card className="info-card">
                <div className="flex">
                  <div className="mr-2">
                    <p className="text-heading">{organisation.name}</p>
                    <Row>
                      <Col xl={12} sx={24}>
                        <b>{t("quick_setup_office_users_form_address")}</b>:{" "}
                        {organisation.address}
                      </Col>
                      <Col xl={12} sx={24}>
                        <b>ACN/ABN</b>: {organisation.acn_abn}
                      </Col>
                      <Col xl={12} sx={24}>
                        <b>{t("general_BSB_number")}</b>:{" "}
                        {organisation.bsb_number}
                      </Col>
                      <Col xl={12} sx={24}>
                        <b>
                          {t(
                            "quick_setup_organizations_modal_form_contractor_license_no."
                          )}
                        </b>
                        : {organisation.contractor_license_number}
                      </Col>
                      <Col xl={12} sx={24}>
                        <b>{t("general_account_number")}</b>:{" "}
                        {organisation.account_number}
                      </Col>
                      <Col xl={12} sx={24}>
                        <b>{t("general_tax_rate")}</b>: {organisation.tax_rate}%
                      </Col>
                      <Col xl={12} sx={24}>
                        <b>{t("general_default_organisation")}</b>:{" "}
                        {organisation.is_default ? "YES" : "NO"}
                      </Col>
                    </Row>
                  </div>
                  <div className="ml-auto">
                    <Space align="end" direction="vertical">
                      <Image
                        src={`data:image/jpeg;base64,${organisation.business_logo}`}
                        style={{ width: "100px" }}
                      />
                    </Space>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
        )}
        <div className="flex">
          <br />
          <br />
          <br />
          <br />
          <CustomDataGrid
            data={data}
            columns={columns}
            ENTITY={ENTITY}
            ENTITY_PLURAL={ENTITY_PLURAL}
            editHandler={handleEdit}
            deleteHandler={handleDelete}
            canDelete={true}
            canEdit={true}
          />
        </div>

        {showEditForm && (
          <Form_LinkPaymentGateway
            form={form}
            showForm={showEditForm}
            recordToEdit={recordToEdit}
            handleCancel={handleCancel}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            ENTITY={ENTITY}
            data={{ organisation }}
          />
        )}

        {showIntegrationForm && (
          <Form_LinkAccountingIntegration
            form={form}
            showForm={showIntegrationForm}
            recordToEdit={recordToEdit}
            handleCancel={handleCancel}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            ENTITY={ENTITY}
            data={{ organisation }}
          />
        )}
      </>
    )) || <h3>You need to select an organisation first</h3>
  );
};

export default LinkPaymentGateway;
