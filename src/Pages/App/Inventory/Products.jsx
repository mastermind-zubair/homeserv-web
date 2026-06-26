import React, { useState, useEffect, useContext } from "react";

import { trackPromise } from "react-promise-tracker";
import { notify } from "Services/ToastService";

import { Button, Form, Tooltip } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";

import CustomDataGrid from "Components/DevEx/CustomDataGrid";

import LookupService from "Services/API/LookupService";
import { MoneyFormat } from "Lib/DevExConstants";
import DefaultService from "Services/API/DefaultService";
import Form_Product from "./Components/Form_Product";
import { ProductPhoto } from "Components/Common/Images";
import Context from "Store/Context";
import PageTitle from "../_Common/PageTitle";
import { useTranslation } from "react-i18next";
const Products = (props) => {
  const ENTITY = "Inventory Product";
  const ENTITY_PLURAL = "Inventory Products";

  const [form] = Form.useForm();
  const [showEditForm, setShowEditForm] = useState(false);

  const [data, setData] = useState();
  const [recordToEdit, setRecordToEdit] = useState();

  const [categories, setCategories] = useState();
  const [suppliers, setSuppliers] = useState();

  const { curOrg: organisation } = useContext(Context);

  useEffect(async () => {
    if (organisation) {
      const categories = await trackPromise(
        LookupService.getLookupByEntity("Inventory_Category", { organisation_id: organisation.id }, "name", "id")
      );
      const suppliers = await trackPromise(
        LookupService.getLookupByEntity("Inventory_Supplier", { organisation_id: organisation.id }, "name", "id")
      );

      setCategories(categories);
      setSuppliers(suppliers);
    }
  }, []);

  useEffect(async () => {
    organisation && (await handleSearch());
  }, [organisation]);

  useEffect(() => {
    form.resetFields();
  }, [recordToEdit]);

  const handleSearch = async () => {
    let { data, status, message } = await trackPromise(
      DefaultService.Entity_List("Inventory_Product", { organisation_id: organisation.id })
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
    let { status, message } = await trackPromise(DefaultService.Entity_Delete("Inventory_Product", item.id));
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
      ? await trackPromise(DefaultService.Entity_Update("Inventory_Product", record))
      : await trackPromise(DefaultService.Entity_Add("Inventory_Product", record));

    notify(message, status);

    if (status) {
      setRecordToEdit({});
      setShowEditForm(false);
      handleSearch();
    }
  };
  const { t } = useTranslation();
  const onFinishFailed = async () => {
    notify("Please provide all the required input fields", false);
  };

  const columns = [
    {
      caption: t("general_image"),
      dataField: "id",
      dataType: "string",
      alignment: "center",
      className: "bg-primary",
      style: { maxWidth: "50px", backgroundColor: "red" },
      cellRender: (item) => {
        let row = item.row.data;
        return (
          <>
            <ProductPhoto filename={row.image} width={60} />
          </>
        );
      },
    },
    {
      caption: t("general_product_name"),
      dataField: "product_name",
      dataType: "string",
      alignment: "left",
    },
    {
      caption: t("general_supplier_part_#"),
      dataField: "supplier_part_number",
      dataType: "string",
      alignment: "left",
    },

    // {
    //   caption: "Organisation Part #",
    //   dataField: "org_part_number",
    //   dataType: "string",
    //   alignment: "left",
    // },
    // {
    //   caption: "Manufacturer Part #",
    //   dataField: "manufacturer_part_number",
    //   dataType: "string",
    //   alignment: "left",
    // },
    {
      caption: t("general_default_supplier"),
      dataField: "supplier.name",
      dataType: "string",
      alignment: "left",
    },

    {
      caption: t("general_inventory_category"),
      dataField: "inventory_category.name",
      dataType: "string",
      alignment: "left",
    },

    { caption: t("general_qty_per_pack"), dataField: "qty_per_pack", dataType: "number", alignment: "center" },
    // { caption: "Unit", dataField: "unit", dataType: "string", alignment: "left" },cent
    { caption: t("general_lead_time_(hours)"), dataField: "lead_time", dataType: "number", alignment: "center" },
    { caption: t("general_rrp"), dataField: "rrp", dataType: "number", alignment: "center", format: MoneyFormat },
    { caption: t("general_cost"), dataField: "cost", dataType: "number", alignment: "center", format: MoneyFormat },
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
              {t("inventory_add_new_products")}
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
        <Form_Product
          form={form}
          showForm={showEditForm}
          recordToEdit={recordToEdit}
          handleCancel={handleCancel}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          ENTITY={ENTITY}
          data={{ organisation, categories, suppliers }}
        />
      )}
    </>
  );
};

export default Products;
