import React, { useState, useEffect, useContext } from "react";

import { trackPromise } from "react-promise-tracker";
import { notify } from "Services/ToastService";

import { Button, Form, Tooltip } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";

import CustomDataGrid from "Components/DevEx/CustomDataGrid";

import moment from "moment";
import LookupService from "Services/API/LookupService";
import DefaultService from "Services/API/DefaultService";
import _ from "lodash";
import { MoneyFormat, PercentFormat } from "Lib/DevExConstants";
import Form_Discount_EmergencyRate from "./Components/Form_Discount_EmergencyRate";
import Context from "Store/Context";
import PageTitle from "../_Common/PageTitle";
import { useTranslation } from "react-i18next";

const Discount_EmergencyRate = (props) => {
  const ENTITY = "Emergency Rate";
  const ENTITY_PLURAL = "Emergency Rates";
  const { curOrg: organisation } = useContext(Context);
  const [dateFormat, setDateFormat] = useState("MM-dd-yyyy");
  const [form] = Form.useForm();
  const [showEditForm, setShowEditForm] = useState(false);

  const [data, setData] = useState();
  const [recordToEdit, setRecordToEdit] = useState();
  const [industries, setIndustries] = useState();
  const [jobPriorities, setJobPriorities] = useState();
  const { t } = useTranslation();

  useEffect(async () => {
    if (organisation) {
      setIndustries(await trackPromise(LookupService.Industries({ organisation_id: organisation.id })));
      setJobPriorities(await trackPromise(LookupService.JobPriorities({ organisation_id: organisation.id })));
      setDateFormat(organisation.date_format);
      await handleSearch();
    }
  }, [organisation]);

  useEffect(() => {
    if (recordToEdit && recordToEdit.id === 0) {
      //recordToEdit.ranges = [];
    }
    form.resetFields();
  }, [recordToEdit]);

  const handleSearch = async () => {
    let { data, status, message } = await trackPromise(
      DefaultService.Entity_List("Settings_Discount_EmergencyRate", { organisation_id: organisation.id })
    );
    !status && notify(message, status);
    setData(data);
  };
  const handleEdit = async (item) => {
    //console.log("Edit Handler", item);

    let record = {};
    if (item.id) {
      record = { ...item };
      record.expiry_date = moment(record.expiry_date);
    } else {
      record.organisation_id = organisation.id;
      record.expiry_date = moment(new Date());
    }
    setRecordToEdit(record);

    setShowEditForm(true);
  };

  const handleDelete = async (item) => {
    //console.log("Delete Handler", item);
    let { status, message } = await trackPromise(
      DefaultService.Entity_Delete("Settings_Discount_EmergencyRate", item.id)
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

    const { status, message } = record.id
      ? await trackPromise(DefaultService.Entity_Update("Settings_Discount_EmergencyRate", record))
      : await trackPromise(DefaultService.Entity_Add("Settings_Discount_EmergencyRate", record));

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
      caption: t("quick_setup_service_types_grid_industry"),
      dataField: "industry.name",
      dataType: "string",
      alignment: "left",
      cellRender: (i) => {
        if (industries) {
          let industry = _.find(industries, { value: i.data.industry_id });
          return industry ? industry.label : "N/A";
        }
      },
    },

    {
      caption: t("side_menu_navigation_reports_sub_job_priority"),
      dataField: "job_priority.name",
      alignment: "left",
    },
    {
      caption: t("general_increased_rate"),
      dataField: "rate_increase",
      dataType: "number",
      alignment: "center",
      format: PercentFormat,
    },
    {
      caption: t("general_expirty_date"),
      dataField: "expiry_date",
      dataType: "date",
      alignment: "left",
      format: dateFormat,
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
                {t("general_add_new_serv_em_rate")}
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
          <Form_Discount_EmergencyRate
            form={form}
            showForm={showEditForm}
            recordToEdit={recordToEdit}
            handleCancel={handleCancel}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            dateFormat={dateFormat}
            ENTITY={ENTITY}
            data={{ organisation, industries, jobPriorities }}
          />
        )}
      </>
    )) || <h3>You need to select an organisation first</h3>
  );
};

export default Discount_EmergencyRate;
