import React, { useState, useEffect, useContext } from "react";

import { trackPromise } from "react-promise-tracker";
import { alertify, notify } from "Services/ToastService";

import {
  Button,
  Card,
  Col,
  Form,
  Image,
  Popconfirm,
  Row,
  Space,
  Switch,
  Tooltip,
} from "antd";
import {
  FileOutlined,
  KeyOutlined,
  LikeOutlined,
  PlusCircleOutlined,
  WindowsFilled,
} from "@ant-design/icons";

import CustomDataGrid from "Components/DevEx/CustomDataGrid";

import DefaultService from "Services/API/DefaultService";
import Form_LinkAccountingSoftware from "./Components/Form_LinkAccountingSoftware";
import Context from "Store/Context";
import PageTitle from "../_Common/PageTitle";
import { Link, useHistory } from "react-router-dom";
import Form_LinkAccountingIntegration from "./Components/Form_LinkAccountingIntegration";
import environment from "Environment";
import { useTranslation } from "react-i18next";
import BaseApiService from "Services/BaseApiService";
// import { XeroClient } from "xero-node";

const LinkAccountingSoftware = (props) => {
  const ENTITY = "Software Integration";
  const ENTITY_PLURAL = "Software Integrations";
  const ENTITY_API_KEY = "Settings_Link_Accounting_Software";

  const history = useHistory();
  const { curOrg: organisation } = useContext(Context);
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [showEditForm, setShowEditForm] = useState(false);
  const [showIntegrationForm, setShowIntegrationForm] = useState(false);

  const [data, setData] = useState();
  const [recordToEdit, setRecordToEdit] = useState();

  useEffect(async () => {
    if (organisation) {
      var qs = require("qs");
      let { state, code } = qs.parse(history.location.search, {
        ignoreQueryPrefix: true,
      });

      if (code && state) {
        let _state = state.split("|");
        let status = await connect(code, _state);
        if (status) {
          alertify(`Successfully integrated with your ${_state[0]} account`, true);
        }
        else {
          alertify(`Failed to integrate with your ${_state[0]} account`, false);
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
    //console.log("Edit Handler", item);

    let record = {};
    if (item.id) {
      record = { ...item };
      // record.members =
      //   record.members &&
      //   record.members.map((m) => {
      //     return m.id;
      //   });
    } else {
      record.organisation_id = organisation.id;
    }
    item.client_id = "xxx";
    item.client_secret = "xxx";
    setRecordToEdit(record);

    setShowEditForm(true);
  };

  const handleIntegration = async (item) => {
    //console.log("Edit Handler", item);

    let record = {};
    if (item.id) {
      record = { ...item };
      // record.members =
      //   record.members &&
      //   record.members.map((m) => {
      //     return m.id;
      //   });
    } else {
      record.organisation_id = organisation.id;
    }
    setRecordToEdit(record);

    setShowIntegrationForm(true);
  };

  const handleDelete = async (item) => {
    //console.log("Delete Handler", item);
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
    //console.log(files);

    /* IF FILES NEED TO BE UPLOADED VIA FORM
    const formData = new FormData();
     files.forEach((file) => {
       formData.append("files[]", file);
     });
    */
    let record = values;
    //console.log("Form values", values);

    //SET SOME DEFAULT VALUES HERE

    //console.log("Record to save", record);

    const { status, message } = record.id
      ? await trackPromise(DefaultService.Entity_Update(ENTITY_API_KEY, record))
      : await trackPromise(DefaultService.Entity_Add(ENTITY_API_KEY, record));

    notify(message, status);
    if (status) {
      //setLogoImage(null);
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
      caption: t("general_software"),
      dataField: "software",
      dataType: "string",
      alignment: "left",
    },

    {
      caption: t("dashboard_job_search_details"),
      dataField: "details",
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
        let link = "";
        const scope =
          "offline_access openid profile email accounting.settings accounting.contacts accounting.transactions";

        switch (row.software.toLowerCase()) {
          case "xero": {
            link = `https://login.xero.com/identity/connect/authorize?response_type=code&client_id=${environment.XERO_CLIENT_ID}&redirect_uri=${environment.XERO_CALLBACK_URL}&scope=${scope}&state=xero|${row.id}`;
            //console.log(row);
            return (
              (row.access_token && (
                <Popconfirm
                  title={`Are you sure to disconnect this integration?`}
                  onConfirm={async () => {
                    row.temp_refresh_token = row.refresh_token;
                    row.access_token = null;
                    row.refresh_token = null;
                    row.metadata = null;
                    row.need_connect = false;

                    await onFinish(row);
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
                  onClick={() => {
                    //console.log("XERO Link", link);
                    window.location.href = link;
                    return false;
                  }}
                ></i>
              )
            );
          }
          case "myob": {
            link = `https://secure.myob.com/oauth2/account/authorize?client_id=${environment.MYOB_CLIENT_ID}&redirect_uri=${environment.MYOB_CALLBACK_URL}&response_type=code&scope=la.global CompanyFile&state=myob|${row.id}`;
            //console.log(row);
            return (
              (row.access_token && (
                <Popconfirm
                  title={`Are you sure to disconnect this integration?`}
                  onConfirm={async () => {
                    row.temp_refresh_token = row.refresh_token;
                    row.access_token = null;
                    row.refresh_token = null;
                    row.metadata = null;
                    row.need_connect = false;

                    await onFinish(row);
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
                  onClick={() => {
                    //console.log("MYOB Link", link);
                    window.location.href = link;
                    return false;
                  }}
                ></i>
              )
            );
          }
        }
      },
    },
    // {
    //   caption: t("general_import_contacts"),
    //   alignment: "center",
    //   width: "100px",
    //   cellRender: (d) => {
    //     let row = d.data;
    //     let link = "";

    //     return (
    //       <>
    //         <i
    //           className="fas fa-file-import"
    //           style={{ cursor: "pointer" }}
    //           title={t("general_import_contacts")}
    //           onClick={async () => {
    //             const { data, status, message } = await trackPromise(
    //               DefaultService.ThirdParty_ImportContacts(row.id)
    //             );

    //             alertify(message, status, 5000);

    //             return false;
    //           }}
    //         ></i>
    //       </>
    //     );
    //   },
    // },
    // {
    //   caption: t("general_export_transactions"),
    //   alignment: "center",
    //   width: "100px",
    //   cellRender: (d) => {
    //     let row = d.data;
    //     let link = "";

    //     return (
    //       <>
    //         <i
    //           className="fas fa-file-invoice-dollar"
    //           title="Export Transactions"
    //           onClick={async () => {
    //             //window.location.href = link;
    //             const { data, status, message } = await trackPromise(
    //               DefaultService.ThirdParty_ExportTransactions(row.id)
    //             );

    //             alertify(message, status, 5000);

    //             return false;
    //           }}
    //         ></i>
    //       </>
    //     );
    //   },
    // },
  ];

  const connect = async (code, state) => {

    if (!state) {
      notify("Failed to receive valid Ids from integration software", false);
      return;
    } else {
      notify(`Successfully integrated with your ${state[0]} account`, true);
    }


    let {
      data: linkAcc,
      status,
      message,
    } = await trackPromise(
      DefaultService.Entity_Get("Settings_Link_Accounting_Software", state[1])
    );

    if (linkAcc) {
      //notify(tokenMessage, tokenStatus);
      let apiURL = ''
      let callbackURL = '';

      if (state[0] === 'xero') {
        apiURL = '/xero/token';
        callbackURL = environment.XERO_CALLBACK_URL;
      } else if (state[0] === 'myob') {
        apiURL = '/myob/token';
        callbackURL = environment.MYOB_CALLBACK_URL;
      }

      const {
        data: token,
        status: tokenStatus,
        message: tokenMessage,
      } = await BaseApiService.POST(apiURL, {
        code,
        redirect_uri: callbackURL,
      });

      /* //TOKEN CALL RETURNS
      access_token:   The JWT token used to call the API.
      id_token:       The token containing user identity details (only returned if OpenID Connect scopes are requested).
      expires_in:     The amount of seconds until the access token expires.
      token_type:     Bearer
      refresh_token:  The token used to refresh the access token once it has expired (only returned if the offline_access scope is requested).
      */

      if (tokenStatus) {
        linkAcc.access_token = token.access_token;
        linkAcc.refresh_token = token.refresh_token;
        linkAcc.need_connect = true;
        linkAcc.thirdparty = state[0];
        //console.log("Third Party access_token", token);
        await onFinish(linkAcc);

        return true;
      } else {
        return false;
      }
    }
  };

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
                {t("general_add_new_soft_int")}
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
          <Form_LinkAccountingSoftware
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

export default LinkAccountingSoftware;
