import React, { useState, useEffect, useContext } from "react";

import { trackPromise } from "react-promise-tracker";
import { notify } from "Services/ToastService";

import { Button, Form, Tooltip } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";

import CustomDataGrid from "Components/DevEx/CustomDataGrid";

import LookupService from "Services/API/LookupService";

import DefaultService from "Services/API/DefaultService";
import Form_Category from "./Components/Form_Category";
import Context from "Store/Context";
import PageTitle from "../_Common/PageTitle";
import { useTranslation } from "react-i18next";
const Categories = (props) => {
  const ENTITY = "Inventory Category";
  const ENTITY_PLURAL = "Inventory Categories";

  const [form] = Form.useForm();
  const [showEditForm, setShowEditForm] = useState(false);

  const [data, setData] = useState();
  const [recordToEdit, setRecordToEdit] = useState();

  const [industries, setIndustries] = useState();
  const { curOrg: organisation } = useContext(Context);

  useEffect(async () => {
    const industries = await trackPromise(LookupService.Industries({ organisation_id: organisation.id }));
    setIndustries(industries);
  }, []);

  useEffect(async () => {
    organisation && (await handleSearch());
  }, [organisation]);

  useEffect(() => {
    form.resetFields();
  }, [recordToEdit]);

  function loadResources() {

  }

  const handleSearch = async () => {
    let { data, status, message } = await trackPromise(
      DefaultService.Entity_List("Inventory_Category", { organisation_id: organisation.id })
    );
    //setShowAddButton(data.length === 0);

    data =
      data &&
      data.map((d) => {
        return { ...d, is_truck_inventory: d.is_truck_inventory ? "Yes" : "No", is_active: d.is_active ? "Yes" : "No" };
      });

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
    let { status, message } = await trackPromise(DefaultService.Entity_Delete("Inventory_Category", item.id));
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
      ? await trackPromise(DefaultService.Entity_Update("Inventory_Category", record))
      : await trackPromise(DefaultService.Entity_Add("Inventory_Category", record));

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
  const { t } = useTranslation();
  const columns = [
    // {
    //   caption: "Organisation",
    //   dataField: "organisation.name",
    //   dataType: "string",
    //   alignment: "left",
    // },
    {
      caption: t("general_industry"),
      dataField: "industry.name",
      dataType: "string",
      alignment: "left",
    },

    {
      caption: t("general_name"),
      dataField: "name",
      dataType: "string",
      alignment: "left",
    },
    {
      caption: t("general_truck_inventory"),
      dataField: "is_truck_inventory",
      dataType: "string",
      alignment: "left",
    },
    {
      caption: t("general_active"),
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
              {t("inventory_add_new_category")}
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
        <Form_Category
          form={form}
          showForm={showEditForm}
          recordToEdit={recordToEdit}
          handleCancel={handleCancel}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          ENTITY={ENTITY}
          data={{ organisation, industries }}
        />
      )}
    </>
  );
};

export default Categories;
