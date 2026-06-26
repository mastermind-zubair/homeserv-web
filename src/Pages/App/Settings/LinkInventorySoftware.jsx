import React, { useState, useEffect, useContext } from "react";

import { trackPromise } from "react-promise-tracker";
import { notify } from "Services/ToastService";

import { Button, Card, Col, Form, Image, Row, Space, Tooltip, Popconfirm, Switch } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";

import CustomDataGrid from "Components/DevEx/CustomDataGrid";

import DefaultService from "Services/API/DefaultService";
import Form_LinkInventorySoftware from "./Components/Form_LinkInventorySoftware";
import Context from "Store/Context";
import PageTitle from "../_Common/PageTitle";


import { useTranslation } from "react-i18next";
import environment from "Environment";
import { useHistory } from "react-router-dom";

const LinkInventorySoftware = (props) => {
  const ENTITY = "Inventory Software";
  const ENTITY_PLURAL = "Inventory Softwares";
  const ENTITY_API_KEY = "Settings_Link_Inventory_Software";

  const history = useHistory();
  const { curOrg: organisation } = useContext(Context);
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [showEditForm, setShowEditForm] = useState(false);

  const [data, setData] = useState();
  const [recordToEdit, setRecordToEdit] = useState();
  
  
  useEffect(async () => {
    if (organisation) {
      var qs = require("qs");
      let { reece_success, ii_id, step } = qs.parse(history.location.search, {
        ignoreQueryPrefix: true,
      });

      
      if(reece_success === 'true' && ii_id) {
        switch(step){
          case '1': 
            if(environment.REECE_STAGED_ENABLED) alert('Please close VPN to continue');
            let reece_customer_token = await DefaultService.GetReeceConfirm(ii_id);
            let callback_url_encoded = encodeURIComponent(`${environment.REECE_CALLBACK_URL}&ii_id=${ii_id}&step=2`);
            let url = `${environment.REECE_BASE_URL}/link-application/account-select/price-select?customer_token=${reece_customer_token.data.customerToken}&callback_url=${callback_url_encoded}`;
            if(environment.REECE_STAGED_ENABLED) alert('Please connect to VPN again before clicking OK');
            window.location.href = url;
            break;

          case '2':
            if(environment.REECE_STAGED_ENABLED) alert('Please close VPN to continue');
            await DefaultService.UpdateReecePriceFile(ii_id);
            break;
          }
      }
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
    let record = {};
    if (item.id) {
      record = { ...item };
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
  };

  const onFinish = async (values) => {
    let record = values;

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
    {
      caption: "Inventory Software",
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
    },
    {
      caption: t("general_connect"),
      dataType: "string",
      alignment: "center",
      cellRender: (d) => {
        let row = d.data;
        let description = JSON.parse(d.data.description);

        switch (row.name.toLowerCase()) {
          case "reece": {
            return (
              (description.customer_token && (
                <Popconfirm
                  title={`Are you sure to disconnect this integration?`}
                  onConfirm={async () => {
                    await DefaultService.GetReeceDisconnect(row.id);
                    await handleSearch();
                  }}
                >
                  <Switch
                    style={{ border: "none" }}
                    checked={row.access_token !== null}
                    checkedChildren={<span>Connected</span>}
                    unCheckedChildren={<span></span>}
                  />
                </Popconfirm>
              )) || (
                <i
                  className="fas fa-paperclip"
                  style={{ cursor: "pointer" }}
                  title="Connect this software"
                  onClick={async () => {
                    let reece_request_token = await DefaultService.GetReeceConnect(row.id);
                    let callback_url_encoded = encodeURIComponent(`${environment.REECE_CALLBACK_URL}&ii_id=${row.id}&step=1`);
                    let url = `${environment.REECE_BASE_URL}/link-application/account-select?request_token=${reece_request_token.data.requestToken}&callback_url=${callback_url_encoded}`;
                    if(environment.REECE_STAGED_ENABLED) alert('Please connect to Reece VPN before clicking OK');
                    window.location.href = url;
                  }}
                ></i>
              )
            );
          }
          default: {
            return (<Button type="primary" href={environment.REECE_BASE_URL} target="_blank">Default</Button>)
          }
        }
      },
    },
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
          <Form_LinkInventorySoftware
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
      </>
    )) || <h3>You need to select an organisation first</h3>
  );
};

export default LinkInventorySoftware;
