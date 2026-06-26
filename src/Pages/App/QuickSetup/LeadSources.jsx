import React, { useState, useEffect, useContext, useTransition } from "react";

import { trackPromise } from "react-promise-tracker";
import { notify } from "Services/ToastService";

import { Button, Form, Tooltip } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";

import CustomDataGrid from "Components/DevEx/CustomDataGrid";

import DefaultService from "Services/API/DefaultService";
import Form_LeadSource from "./Components/Form_LeadSource";
import Context from "Store/Context";
import PageTitle from "../_Common/PageTitle";
import { useTranslation } from "react-i18next";

const LeadSources = (props) => {
  const { t } = useTranslation();
  const { curOrg: organisation } = useContext(Context);
  const ENTITY = "Lead Source";
  const ENTITY_PLURAL = "Lead Sources";
  const ENTITY_API_KEY = "QS_Lead_Source";

  const [form] = Form.useForm();
  const [showEditForm, setShowEditForm] = useState(false);

  const [data, setData] = useState();
  const [recordToEdit, setRecordToEdit] = useState();

  useEffect(async () => {
    if (organisation) {
      await handleSearch();
    }
  }, [organisation]);

  useEffect(() => {
    form.resetFields();
  }, [recordToEdit]);

  const handleSearch = async () => {
    let { data, status, message } = await trackPromise(
      DefaultService.Entity_List(ENTITY_API_KEY, { organisation_id: organisation.id })
    );
    notify(message, status);
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
    let { status, message } = await trackPromise(DefaultService.Entity_Delete(ENTITY_API_KEY, item.id));
    notify(message, status);
    await handleSearch();
  };

  const handleCancel = () => {
    setShowEditForm(false);
  };

  const onFinish = async (values) => {
    let record = values;
    console.log("form values", values);

    const { status, message } = record.id
      ? await trackPromise(DefaultService.Entity_Update(ENTITY_API_KEY, record), "modal")
      : await trackPromise(DefaultService.Entity_Add(ENTITY_API_KEY, record), "modal");

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
    {
      caption: t("quick_setup_lead_source_grid_lead_source"),
      dataField: "name",
      dataType: "string",
      cellRender: (itemData) => {
        return <b>{itemData.text}</b>;
      },
      showSummary: true,
      summaryType: "count",
    },
    {
      caption: t("quick_setup_industries_modal_form_active?"),
      dataField: "is_active",
      dataType: "string",
      alignment: "center",
    },
  ];

  return (
    (organisation && (
      <>
        <div className="flex mb-2">
          <PageTitle />
          <h3 className="push-right text-right">
            <Tooltip title={`Do you have more ${ENTITY_PLURAL}? Click here to add another`}>
              <Button className="bg-success" icon={<PlusCircleOutlined />} onClick={handleEdit}>
                {t("quick_setup_add_new_lead_source")}
              </Button>
            </Tooltip>
          </h3>
        </div>
        <div className="flex">
          <CustomDataGrid
            data={data}
            columns={columns}
            ENTITY={ENTITY}
            ENTITY_PLURAL={ENTITY_PLURAL}
            editHandler={handleEdit}
            deleteHandler={handleDelete}
            canEdit={true}
            canDelete={true}
          />
        </div>

        <Form_LeadSource
          form={form}
          showForm={showEditForm}
          recordToEdit={recordToEdit}
          handleCancel={handleCancel}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          ENTITY={ENTITY}
        />
      </>
    )) || <h3>You need to select an organisation first</h3>
  );
};

export default LeadSources;
