import React, { useState, useEffect, useContext } from "react";

import { trackPromise } from "react-promise-tracker";
import { notify } from "Services/ToastService";

import { Button, Form, Tooltip } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";

import CustomDataGrid from "Components/DevEx/CustomDataGrid";

import LookupService from "Services/API/LookupService";
import _ from "lodash";
import DefaultService from "Services/API/DefaultService";
import TruckInventory from "./Components/TruckInventory";
import Form_Truck from "./Components/Form_Truck";
import Context from "Store/Context";
import PageTitle from "../_Common/PageTitle";
import { useTranslation } from "react-i18next";


const Trucks = (props) => {
  const ENTITY = "Truck";
  const ENTITY_PLURAL = "Trucks";
  const ENTITY_API_KEY = "Inventory_Truck";

  const [form] = Form.useForm();
  const [showEditForm, setShowEditForm] = useState(false);

  const [data, setData] = useState();
  const [recordToEdit, setRecordToEdit] = useState();

  const [selectedTruck, setSelectedTruck] = useState();
  const [showTruckProducts, setShowTruckProducts] = useState(false);
  const [truckProducts, setTruckProducts] = useState();
  const [industries, setIndustries] = useState();
  const [templates, setTemplates] = useState();
  const [vehicles, setVehicles] = useState();
  const [fieldTechnicians, setFieldTechnicians] = useState();

  const { curOrg: organisation } = useContext(Context);

  useEffect(async () => {
    organisation && (await handleSearch());
    organisation && (await getProducts());
    organisation && (await getIndustries());
    organisation && (await getTemplates());
    organisation && (await getVehicles());
  }, [organisation]);

  useEffect(() => {
    form.resetFields();
  }, [recordToEdit]);

  const getProducts = async () => {
    //   let { data } = await trackPromise(
    //     DefaultService.Entity_List("Inventory_Product", { organisation_id: organisation.id })
    //   );
    //   setProducts(await LookupService.convertLookup(data, "product_name", "id"));
  };

  const getIndustries = async () => {
    setIndustries(await trackPromise(LookupService.Industries({ organisation_id: organisation.id })));
  };

  const getTemplates = async () => {
    const { data } = await trackPromise(
      DefaultService.Entity_List("Inventory_Template", { organisation_id: organisation.id })
    );

    let t = data.map((tm) => {

      return { ...tm, label: tm.name, value: tm.id };
    });
    setTemplates(t);
  };
  const { t } = useTranslation();
  // const getFieldTechnicians = async () => {
  //   let techs = await trackPromise(
  //     LookupService.getLookupByEntity(
  //       "Unassigned_Technicians",
  //       { organisation_id: organisation.id },
  //       "{display_name} ({username})",
  //       "id"
  //     )
  //   );
  //   setFieldTechnicians(techs);
  // };

  const getVehicles = async () => {
    setVehicles(
      await trackPromise(
        LookupService.getLookupByEntity(
          "Settings_Fleet_Vehicle",
          { organisation_id: organisation.id },
          "registration_number",
          "id"
        )
      )
    );
  };

  const handleSearch = async () => {
    let { data, status, message } = await trackPromise(
      DefaultService.Entity_List(ENTITY_API_KEY, { organisation_id: organisation.id })
    );

    notify(message, status);
    setData(data);
  };

  const handleEdit = async (item) => {
    console.log("Edit Handler", item);
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

  const handleCloseTruckProducts = () => {
    setShowTruckProducts(false);
  };

  const handleInventoryUpdate = async () => {
    console.log(truckProducts);
    selectedTruck.products = truckProducts;
    await onFinish(selectedTruck);
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

    if (record.id) {
      if (
        recordToEdit &&
        recordToEdit.inventory_template_id &&
        record.inventory_template_id !== recordToEdit.inventory_template_id
      ) {
        let t = templates.find((t) => t.id === record.inventory_template_id);
        record.products = t.products.map((p) => {
          return { product_id: p.id, quantity: 0 };
        });
      } else {
        record.products = record.products.map((p) => {
          return { product_id: p.id, quantity: p.quantity };
        });
      }
    } else {
      let t = templates.find((t) => t.id === record.inventory_template_id);
      record.products = t.products.map((p) => {
        return { product_id: p.id, quantity: 0 };
      });
    }
    console.log("Record to save", record);

    const { status, message } = record.id
      ? await trackPromise(DefaultService.Entity_Update(ENTITY_API_KEY, record))
      : await trackPromise(DefaultService.Entity_Add(ENTITY_API_KEY, record));

    notify(message, status);

    if (status) {
      setRecordToEdit({});
      setShowEditForm(false);
      handleCloseTruckProducts();
      handleSearch();
    }
  };
  const onFinishFailed = async () => {
    notify("Please provide all the required input fields", false);
  };

  const columns = [
    {
      caption: t("general_truck"),
      dataField: "vehicle.registration_number",
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
      caption: t("general_technician"),
      dataField: "field_technician.username",
      dataType: "string",
      alignment: "left",
      cellRender: (item) => {
        let row = item.row.data;
        return (
          <>
            {row.field_technician.first_name} {row.field_technician.last_name}
          </>
        );
      },
    },
    {
      caption: t("general_inventory_template"),
      dataField: "inventory_template.name",
      dataType: "string",
      alignment: "left",
    },
    {
      caption: t("side_menu_navigation_inventory"),
      dataField: "inventory_template.products",
      dataType: "string",
      alignment: "left",
      cellRender: (item) => {
        let row = item.row.data;
        return (
          <>
            <div
              style={{ cursor: "pointer" }}
              className="text-larger text-success"
              onClick={() => {
                setSelectedTruck(row);
                // let prods = _.find(products, {id: [template.]})
                // let prods = row.products.map((p) => {
                //   let capacity = row.inventory_template.products.find((ip) => ip.id === p.id).capacity;
                //   return { ...p, capacity };
                // });
                const prods = _(row.products) // start sequence
                  .keyBy("id") // create a dictionary of the 1st array
                  .merge(_.keyBy(row.inventory_template.products, "id")) // create a dictionary of the 2nd array, and merge it to the 1st
                  .values() // turn the combined dictionary to array
                  .value(); // get the value (array) out of the sequence
                setTruckProducts(prods);
                setShowTruckProducts(true);
              }}
            >
              <b>Manage Inventory</b>
            </div>
          </>
        );
      },
    },
    {
      caption: t("general_truck_status"),
      dataType: "string",
      alignment: "center",
      cellRender: (item) => {
        let row = item.row.data;
        let totCapacity = _.sumBy(row.inventory_template.products, function (o) {
          return o.capacity;
        });
        let totQuantity = _.sumBy(row.products, function (o) {
          return o.quantity;
        });
        let rate = _.round((totQuantity / totCapacity) * 100, 0);
        let status =
          // rate > 60 ? (
          //   <b className="text-success">Stocked</b>
          // ) : rate > 20 ? (
          //   <b className="text-warning">Review</b>
          // ) : (
          //   <b className="text-danger">Restock</b>
          // );
          rate >= 80 ? (
            <b className="text-success">Stocked</b>
          ) : rate >= 60 ? (
            <b className="text-warning">Review</b>
          ) : (
            <b className="text-danger">Restock</b>
          );
        return <>{status}</>;
      },
    },
    {
      caption: t("label_active"),
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
      caption: t("dashboard_job_search_quantity"),
      dataField: "quantity",
      dataType: "number",
      alignment: "center",
      allowEditing: true,
    },
    // {
    //   caption: "Status",
    //   dataField: "is_active",
    //   dataType: "string",
    //   alignment: "center",
    // },
  ];
  return (
    <>
      <div className="flex mb-2">
        <PageTitle />
        <h3 className="push-right text-right">
          <Tooltip title={`Do you have more ${ENTITY_PLURAL}? Click here to add another`}>
            <Button className="bg-success" icon={<PlusCircleOutlined />} onClick={handleEdit}>
              {t("inventory_add_new_truck")}
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
        <Form_Truck
          form={form}
          showForm={showEditForm}
          recordToEdit={recordToEdit}
          handleCancel={handleCancel}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          ENTITY={ENTITY}
          data={{ organisation, industries, templates, vehicles }}
        />
      )}

      {showTruckProducts && (
        <TruckInventory
          showForm={showTruckProducts}
          handleUpdate={handleInventoryUpdate}
          handleCancel={handleCloseTruckProducts}
          ENTITY={"Product"}
          ENTITY_PLURAL={"Products"}
          data={truckProducts}
          columns={productListColumns}
        />
      )}
    </>
  );
};

export default Trucks;
