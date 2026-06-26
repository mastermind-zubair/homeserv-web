import React, { useState, useEffect } from "react";

import { trackPromise } from "react-promise-tracker";
import { notify } from "Services/ToastService";

import { Button, Form, Tooltip } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";

import CustomDataGrid from "Components/DevEx/CustomDataGrid";

import LookupService from "Services/API/LookupService";
import { GetStorage } from "Lib/StorageHelper";
import DefaultService from "Services/API/DefaultService";
import Form_InvoiceTemplate from "./Components/Form_InvoiceTemplate";
import PageTitle from "../_Common/PageTitle";
const InvoiceTemplate = (props) => {
  const ENTITY = "Invoice Template";
  const ENTITY_PLURAL = "Invoice Templates";

  const [form] = Form.useForm();
  const [showEditForm, setShowEditForm] = useState(false);

  const [data, setData] = useState();
  const [recordToEdit, setRecordToEdit] = useState();

  const [organisation, setOrganisation] = useState();
  const [templates, setTemplates] = useState();

  useEffect(async () => {
    let org = GetStorage("org");
    setOrganisation(org);

    const { data } = await trackPromise(DefaultService.GetInvoiceTemplateOptions());
    const templates = await LookupService.getLookup(data, "name", "id");
    setTemplates(templates);
  }, []);

  useEffect(async () => {
    organisation && (await handleSearch());
  }, [organisation]);

  useEffect(() => {
    form.resetFields();
  }, [recordToEdit]);

  const handleSearch = async () => {
    let { data, status, message } = await trackPromise(
      DefaultService.Entity_List("Settings_Invoice_Template", { organisation_id: organisation.id })
    );
    notify(message, status);
    setData(data);
  };

  const handleEdit = async (item) => {
    //console.log("Edit Handler", item);
    let record = {};
    if (item.id) {
      record = { ...item };
      record.organisation_id = organisation.id;
    } else {
      record.organisation_id = organisation.id;
    }

    setRecordToEdit(record);

    setShowEditForm(true);
  };

  const handleDelete = async (item) => {
    //console.log("Delete Handler", item);
    let { data, status, message } = await trackPromise(
      DefaultService.Entity_Delete("Settings_Invoice_Template", item.id)
    );
    notify(message, status);
    await handleSearch();
  };

  const handleCancel = () => {
    setShowEditForm(false);
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
    console.log("Form values", values);

    //SET SOME DEFAULT VALUES HERE

    console.log("Record to save", record);

    const { data, status, message } = record.id
      ? await trackPromise(DefaultService.Entity_Update("Settings_Invoice_Template", record))
      : await trackPromise(DefaultService.Entity_Add("Settings_Invoice_Template", record));

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
      caption: "Template File",
      dataField: "template_file",
      dataType: "string",
      alignment: "left",
    },
  ];

  return (
    <>
      <div className="flex mb-2">
        <PageTitle />
        <h3 className="push-right text-right">
          <Tooltip title={`Do you have more ${ENTITY_PLURAL}? Click here to add another`}>
            <Button className="bg-success" icon={<PlusCircleOutlined />} onClick={handleEdit}>
              Add New {ENTITY}
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
          canDelete={true}
          canEdit={true}
        />
      </div>

      {showEditForm && (
        <Form_InvoiceTemplate
          form={form}
          showForm={showEditForm}
          recordToEdit={recordToEdit}
          handleCancel={handleCancel}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          ENTITY={ENTITY}
          data={{ organisation, templates }}
        />
      )}
    </>
  );
};

export default InvoiceTemplate;
