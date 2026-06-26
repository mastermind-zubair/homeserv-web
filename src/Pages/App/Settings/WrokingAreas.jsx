import React, { useState, useEffect } from "react";

import { trackPromise } from "react-promise-tracker";
import { notify } from "Services/ToastService";

import { Button, Form, Tooltip } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";

import CustomDataGrid from "Components/DevEx/CustomDataGrid";
import Form_Industry from "./Components/Form_Skills";

import QuickSetupService from "Services/API/QuickSetupService";
import { useTranslation } from "react-i18next";

const Industries = (props) => {
  const { t } = useTranslation();
  const ENTITY = "Industry";
  const ENTITY_PLURAL = "Industries";
  const [form] = Form.useForm();
  const [showEditForm, setShowEditForm] = useState(false);

  const [data, setData] = useState();
  const [recordToEdit, setRecordToEdit] = useState();
  // const [files, setFiles] = useState([]);
  // const [logoImage, setLogoImage] = useState();

  useEffect(async () => {
    await handleSearch();
    return () => {
      //setData([]);
    };
  }, []);

  useEffect(() => {
    form.resetFields();
  }, [recordToEdit]);

  const handleSearch = async () => {
    let { data, status, message } = await trackPromise(QuickSetupService.Industry_List());
    notify(message, status);
    setData(data);
  };
  const handleEdit = async (item) => {
    //console.log("Edit Handler", item);
    setRecordToEdit(item.id ? item : null);
    setShowEditForm(true);
  };

  const handleDelete = async (item) => {
    //console.log("Delete Handler", item);
    let { status, message } = await trackPromise(QuickSetupService.Industry_Delete(item.id));
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
    console.log("form values", values);

    //SET SOME DEFAULT VALUES HERE
    // if (logoImage) {
    //   record.business_logo = logoImage.base64.substring(logoImage.base64.indexOf(",") + 1);
    // }
    //record.is_default = false;

    const { status, message } = record.id
      ? await trackPromise(QuickSetupService.Industry_Update(record))
      : await trackPromise(QuickSetupService.Industry_Add(record));

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
      caption: t("quick_setup_industries_grid_industry_name"),
      dataField: "name",
      dataType: "string",
      cellRender: (itemData) => {
        return <b>{itemData.text}</b>;
      },
      showSummary: true,
      summaryType: "count",
    },
    {
      caption: t("quick_setup_industries_modal_form_description"),
      dataField: "description",
      dataType: "string",
    },
    {
      caption: t("quick_setup_industries_grid_status_active"),
      dataField: "is_active",
      dataType: "string",
      alignment: "center",
    },
  ];

  return (
    <>
      <div className="flex">
        <h3 style={{ marginBottom: "20px" }}>
          {" "}
          {t("quick_setup_industries_title_manage_industries", { ENTITY_PLURAL })}
        </h3>
        <h3 className="push-right text-right">
          <Tooltip title={`Do you have more ${ENTITY_PLURAL}? Click here to add another`}>
            <Button className="bg-success" icon={<PlusCircleOutlined />} onClick={handleEdit}>
              {t("quick_setup_industries_modal_add_new_industry", { ENTITY })}
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
        />
      </div>

      <Form_Industry
        form={form}
        showForm={showEditForm}
        recordToEdit={recordToEdit}
        handleCancel={handleCancel}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        ENTITY={ENTITY}
      />
    </>
  );
};

export default Industries;
