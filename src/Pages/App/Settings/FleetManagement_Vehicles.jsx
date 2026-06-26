import React, { useState, useEffect, useContext } from "react";

import { trackPromise } from "react-promise-tracker";
import { notify } from "Services/ToastService";

import { Button, Form, Tooltip } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";

import CustomDataGrid from "Components/DevEx/CustomDataGrid";

import { VehiclePhoto } from "Components/Common/Images";
import Form_Fleet_Vehicle from "./Components/Form_Fleet_Vehicle";
import moment from "moment";
import DefaultService from "Services/API/DefaultService";
import { DateFormat } from "Lib/DevExConstants";
import Context from "Store/Context";
import PageTitle from "../_Common/PageTitle";
import { useTranslation } from "react-i18next";

const FleetManagement_Vehicles = (props) => {
  const ENTITY = "Vehicle";
  const ENTITY_PLURAL = "Vehicles";

  const { curOrg: organisation } = useContext(Context);
  const [form] = Form.useForm();
  const [showEditForm, setShowEditForm] = useState(false);
  const [dateFormat, setDateFormat] = useState('MM-dd-yyyy');

  const [data, setData] = useState();
  const [recordToEdit, setRecordToEdit] = useState();

  useEffect(async () => {
    organisation && (await handleSearch());
    setDateFormat(organisation.date_format);
  }, [organisation]);

  useEffect(() => {
    form.resetFields();
  }, [recordToEdit]);

  const handleSearch = async () => {
    let { data, status, message } = await trackPromise(
      DefaultService.Entity_List("Settings_Fleet_Vehicle", { organisation_id: organisation.id })
    );
    notify(message, status);
    setData(data);
  };
  const handleEdit = async (item) => {
    //console.log("Edit Handler", item);
    let record = {};
    if (item.id) {
      record = { ...item };
      //handle date attributes for existing record
      record.organisation_id = organisation.id;
      record.registration_expiry = moment(record.registration_expiry);
      record.policy_expiry = moment(record.policy_expiry);
      record.next_vehicle_service = moment(record.next_vehicle_service);
      //handle array attributes
      record.policy_docs = record.policy_docs.map((d) => {

        return { ...d, name: d.file };
      });
      record.service_docs = record.service_docs.map((d) => {
        return { ...d, name: d.file };
      });
    } else {
      record.organisation_id = organisation.id;
      //handle date attributes for new record
      // record.registration_expiry = moment();
      // record.policy_expiry = moment();
      // record.next_vehicle_service = moment();
      //handle array attributes
      record.policy_docs = [];
      record.service_docs = [];
    }

    setRecordToEdit(record);

    setShowEditForm(true);
  };
  const { t } = useTranslation();
  const handleDelete = async (item) => {
    //console.log("Delete Handler", item);
    let { status, message } = await trackPromise(DefaultService.Entity_Delete("Settings_Fleet_Vehicle"));
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
    // record.skills = record.skills.map((s) => {
    //   return { id: isNaN(s) ? 0 : s, name: isNaN(s) ? s : "" };
    // });
    // record.working_areas = record.working_areas.map((s) => {
    //   return { id: isNaN(s) ? 0 : s, name: isNaN(s) ? s : "" };
    // });
    record.id = record.id || 0;
    record.service_docs = record.service_docs.map((d) => {
      return { file: d.file, file_path: d.file_path, file_size: d.file_size, mime_type: d.mime_type };
    });
    record.policy_docs = record.policy_docs.map((d) => {
      return { file: d.file, file_path: d.file_path, file_size: d.file_size, mime_type: d.mime_type };
    });

    console.log("Record to save", record);

    const { status, message } = record.id
      ? await trackPromise(DefaultService.Entity_Update("Settings_Fleet_Vehicle", record))
      : await trackPromise(DefaultService.Entity_Add("Settings_Fleet_Vehicle", record));

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
      caption: t("quick_setup_office_users_grid_photo"),
      dataField: "vehicle_image",
      dataType: "string",
      alignment: "center",
      className: "bg-primary",
      style: { maxWidth: "50px", backgroundColor: "red" },
      cellRender: (item) => {
        let row = item.row.data;
        return (
          <>
            <VehiclePhoto filename={row.vehicle_image} width={60} />
          </>
        );
      },
    },
    {
      caption: t("quick_setup_sub_contractors_form_vehicle_type"),
      dataField: "vehicle_type",
      dataType: "string",
      cellRender: (itemData) => {
        return <b>{itemData.text}</b>;
      },
      showSummary: true,
      summaryType: "count",
    },

    {
      caption: t("general_registration_#"),
      dataField: "registration_number",
      dataType: "string",
    },
    {
      caption: t("general_registration_expiry"),
      dataField: "registration_expiry",
      dataType: "date",
      alignment: "right",
      format: dateFormat,
    },
    {
      caption: t("general_insurance_company"),
      dataField: "insurance_company",
      dataType: "string",
      alignment: "left",
    },
    {
      caption: t("general_insurance_policy_#"),
      dataField: "policy_number",
      dataType: "string",
      alignment: "left",
    },
    {
      caption: t("general_policy_expiry"),
      dataField: "policy_expiry",
      dataType: "date",
      alignment: "right",
      format: dateFormat,
    },
    {
      caption: t("general_next_plant_service"),
      dataField: "next_vehicle_service",
      dataType: "date",
      alignment: "right",
      format: dateFormat,
    },
    {
      caption: t("general_documents"),
      dataType: "string",
      alignment: "left",
      width: "150px",
      cellRender: (item) => {
        let row = item.data;
        return (
          <ul>
            <li>{row.service_docs && row.service_docs.length} service doc(s)</li>
            <li>{row.policy_docs && row.policy_docs.length} policy doc(s)</li>
          </ul>
        );
      },
    },
    {
      caption: t("general_plan_#"),
      dataField: "plant_number",
      dataType: "(s)tring",
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
    (organisation && (
      <>
        <div className="flex mb-2">
          <PageTitle />
          <h3 className="push-right text-right">
            <Tooltip title={`Do you have more ${ENTITY_PLURAL}? Click here to add another`}>
              <Button className="bg-success" icon={<PlusCircleOutlined />} onClick={handleEdit}>
                {t("general_add_veh_new")}
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
          <Form_Fleet_Vehicle
            form={form}
            showForm={showEditForm}
            recordToEdit={recordToEdit}
            handleCancel={handleCancel}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            ENTITY={ENTITY}
            data={{ organisation }}
            dateFormat={dateFormat}
          />
        )}
      </>
    )) || <h3>You need to select an organisation first</h3>
  );
};

export default FleetManagement_Vehicles;
