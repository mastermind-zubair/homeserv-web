import React, { useState, useEffect, useContext } from "react";

import { trackPromise } from "react-promise-tracker";
import { notify } from "Services/ToastService";

import { Button, Form, Tooltip } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";

import CustomDataGrid from "Components/DevEx/CustomDataGrid";

import DefaultService from "Services/API/DefaultService";
import Form_Supplier from "./Components/Form_Supplier";
import Context from "Store/Context";
import PageTitle from "../_Common/PageTitle";
import { useTranslation } from "react-i18next";


const Suppliers = (props) => {
  const ENTITY = "Supplier";
  const ENTITY_PLURAL = "Suppliers";
  const ENTITY_API_KEY = "Inventory_Supplier";

  const [form] = Form.useForm();
  const [showEditForm, setShowEditForm] = useState(false);

  const [data, setData] = useState();
  const [recordToEdit, setRecordToEdit] = useState();
  const { t } = useTranslation();
  const { curOrg: organisation } = useContext(Context);

  useEffect(async () => {
    //const { data } = await trackPromise(DefaultService.GetInvoiceTemplateOptions());
  }, []);

  useEffect(async () => {
    organisation && (await handleSearch());
  }, [organisation]);

  useEffect(() => {
    form.resetFields();
  }, [recordToEdit]);

  const handleSearch = async () => {
    let { data, status, message } = await trackPromise(
      DefaultService.Entity_List(ENTITY_API_KEY, { organisation_id: organisation.id })
    );
    //setShowAddButton(data.length === 0);

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
    let { status, message } = await trackPromise(DefaultService.Entity_Delete(ENTITY_API_KEY, item.id));
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
      caption: t("general_name"),
      dataField: "name",
      dataType: "string",
      alignment: "left",
    },

    {
      caption: t("quick_setup_organizations_modal_form_account_no."),
      dataField: "account_number",
      dataType: "string",
      alignment: "left",
    },
    {
      caption: t("general_contact_first_name"),
      dataField: "first_name",
      dataType: "string",
      alignment: "left",
    },
    {
      caption: t("general_contact_last_name"),
      dataField: "last_name",
      dataType: "string",
      alignment: "left",
    },
    {
      caption: t("quick_setup_office_users_form_email"),
      dataField: "email",
      dataType: "string",
      alignment: "left",
    },
    {
      caption: t("quick_setup_sub_contractors_form_mobile_number"),
      dataField: "mobile",
      dataType: "string",
      alignment: "left",
    },
    {
      caption: t("quick_setup_sub_contractors_form_phone_number"),
      dataField: "phone",
      dataType: "string",
      alignment: "left",
    },

    {
      caption: t("general_fax"),
      dataField: "fax",
      dataType: "string",
      alignment: "left",
    },
    {
      caption: t("general_website"),
      dataField: "website",
      dataType: "string",
      alignment: "left",
    },
    {
      caption: t("label_active"),
      dataField: "is_active",
      dataType: "string",
      alignment: "center",
    },
  ];

  return (
    <>
      <div className="flex mb-2">
        <PageTitle />
        <h3 className="push-right text-right">
          <Tooltip title={`Do you have more ${ENTITY_PLURAL}? Click here to add another`}>
            <Button className="bg-success" icon={<PlusCircleOutlined />} onClick={handleEdit}>
              {t("inventory_add_new_suppliers")}
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
        <Form_Supplier
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
  );
};

export default Suppliers;
