import React, { useState, useEffect, useContext } from "react";

import { trackPromise } from "react-promise-tracker";
import { notify } from "Services/ToastService";

import { Button, Form, Tooltip } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";

import CustomDataGrid from "Components/DevEx/CustomDataGrid";

import LookupService from "Services/API/LookupService";
import DefaultService from "Services/API/DefaultService";
import Form_Template from "./Components/Form_Template";
import TemplateProducts from "./Components/TemplateProducts";
import Context from "Store/Context";
import PageTitle from "../_Common/PageTitle";
import { useTranslation } from "react-i18next";


const Templates = (props) => {
  const ENTITY = "Inventory Template";
  const ENTITY_PLURAL = "Inventory Templates";

  const [form] = Form.useForm();
  const [showEditForm, setShowEditForm] = useState(false);

  const [data, setData] = useState();
  const [recordToEdit, setRecordToEdit] = useState();

  const [products, setProducts] = useState();

  const [showTemplateProducts, setShowTemplateProducts] = useState(false);
  const [templateProducts, setTemplateProducts] = useState();
  const [industries, setIndustries] = useState();

  const { curOrg: organisation } = useContext(Context);


  useEffect(async () => {
    setIndustries(await trackPromise(LookupService.Industries({ organisation_id: organisation.id })));
  }, []);

  useEffect(async () => {
    organisation && (await handleSearch());
    organisation && (await getProducts());
  }, [organisation]);

  useEffect(() => {
    form.resetFields();
  }, [recordToEdit]);

  const getProducts = async () => {
    let { data, status, message } = await trackPromise(
      DefaultService.Entity_List("Inventory_Product", { organisation_id: organisation.id })
    );
    !status && notify(message, status);

    setProducts(await LookupService.convertLookup(data, "product_name", "id"));
  };

  const handleSearch = async () => {
    let { data, status, message } = await trackPromise(
      DefaultService.Entity_List("Inventory_Template", { organisation_id: organisation.id })
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
      record.products = [];
    }

    setRecordToEdit(record);

    setShowEditForm(true);
  };

  const handleDelete = async (item) => {
    //console.log("Delete Handler", item);
    let { status, message } = await trackPromise(DefaultService.Entity_Delete("Inventory_Template", item.id));
    notify(message, status);
    await handleSearch();
  };

  const handleCancel = () => {
    setShowEditForm(false);
  };

  const handleCloseTemplateProducts = () => {
    setShowTemplateProducts(false);
  };
  const { t } = useTranslation();
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
    if (record.products && record.products.length > 0) {
      record.products = record.products.map((p) => {
        return { product_id: p.id, capacity: p.capacity };
      });
    }
    console.log("Record to save", record);

    const { status, message } = record.id
      ? await trackPromise(DefaultService.Entity_Update("Inventory_Template", record))
      : await trackPromise(DefaultService.Entity_Add("Inventory_Template", record));

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
      caption: t("price_book_option_template_grid_template_name"),
      dataField: "name",
      dataType: "string",
      alignment: "left",
    },

    {
      caption: t("general_industry"),
      dataField: "industry.name",
      dataType: "string",
      alignment: "left",
    },

    {
      caption: t("general_total_products"),
      dataType: "number",
      alignment: "center",
      cellRender: (item) => {
        let template = item.row.data;
        return (
          <>
            <div
              style={{ cursor: "pointer" }}
              className="text-larger text-success"
              onClick={() => {
                //setSelectedTemplate(template);
                // let prods = _.find(products, {id: [template.]})
                setTemplateProducts(template.products);
                setShowTemplateProducts(true);
              }}
            >
              <b>{(template.products && template.products.length) || 0}</b> products
            </div>
          </>
        );
      },
    },

    {
      caption: t("label_status"),
      dataField: "is_active",
      dataType: "string",
      alignment: "center",
    },
  ];

  const productListColumns = [
    // {
    //   caption: "Image",
    //   dataField: "id",
    //   dataType: "string",
    //   alignment: "center",
    //   className: "bg-primary",
    //   style: { maxWidth: "50px", backgroundColor: "red" },
    //   cellRender: (item) => {
    //     let row = item.row.data;
    //     return (
    //       <>
    //         <ProductPhoto filename={row.image} width={60} />
    //       </>
    //     );
    //   },
    // },
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
      caption: t("general_capacity"),
      dataField: "capacity",
      dataType: "number",
      alignment: "center",
    },

    {
      caption: t("label_status"),
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
              {t("inventory_add_new_templates")}
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
        <Form_Template
          form={form}
          showForm={showEditForm}
          recordToEdit={recordToEdit}
          handleCancel={handleCancel}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          ENTITY={ENTITY}
          data={{ organisation, products, industries }}
        />
      )}

      {showTemplateProducts && (
        <TemplateProducts
          showForm={showTemplateProducts}
          handleCancel={handleCloseTemplateProducts}
          ENTITY={"Product"}
          ENTITY_PLURAL={"Products"}
          data={templateProducts}
          columns={productListColumns}
        />
      )}
    </>
  );
};

export default Templates;
