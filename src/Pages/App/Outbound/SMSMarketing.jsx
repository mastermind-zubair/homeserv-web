import React, { useState, useEffect, useContext } from "react";

import { trackPromise } from "react-promise-tracker";
import { alertify, notify } from "Services/ToastService";

import { Button, Form, Tooltip } from "antd";
import { MailFilled, PlusCircleOutlined } from "@ant-design/icons";

import CustomDataGrid from "Components/DevEx/CustomDataGrid";

import DefaultService from "Services/API/DefaultService";
import Form_SMSCampaign from "./Components/Form_SMSCampaign";
import Context from "Store/Context";
import PageTitle from "../_Common/PageTitle";
import LookupService from "Services/API/LookupService";
import environment from "Environment";
import _ from "lodash";
import Form_RunSMSCampaign from "./Components/Form_RunSMSCampaign";

import { useTranslation } from "react-i18next";
const SMSMarketing = (props) => {
  const ENTITY = "SMS Campaign";
  const ENTITY_PLURAL = "SMS Campaigns";
  const ENTITY_API_KEY = "Outbound_SMS_Campaign";
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [showEditForm, setShowEditForm] = useState(false);

  const [data, setData] = useState();
  const [recordToEdit, setRecordToEdit] = useState();

  const { curOrg: organisation, setCurOrg } = useContext(Context);

  const [industries, setIndustries] = useState();
  const [jobPriorities, setJobPriorities] = useState();
  const [serviceTypes, setServiceTypes] = useState();
  const [jobTags, setJobTags] = useState();
  const [discountTags, setDiscountTags] = useState();
  const [customerTypes, setCustomerTypes] = useState();
  const [templates, setTemplates] = useState();

  const [showRunCampaignForm, setShowRunCampaignForm] = useState(false);

  useEffect(() => {
    (async() => {
      if (organisation) {
        await handleSearch();
        let i = await trackPromise(
          LookupService.getLookupByEntity(
            "QS_Industry",
            { organisation_id: organisation.id /*is_active: true*/ },
            "name",
            "id"
          )
        );
        let jp = await trackPromise(
          LookupService.getLookupByEntity(
            "QS_Job_Priority",
            { organisation_id: organisation.id /*is_active: true*/ },
            "name",
            "id"
          )
        );
        let ct = await trackPromise(
          LookupService.getLookupByEntity(
            "QS_Customer_Type",
            { organisation_id: organisation.id /*is_active: true*/ },
            "name",
            "id"
          )
        );
        let st = await trackPromise(
          LookupService.getLookupByEntity(
            "QS_Service_Type",
            { organisation_id: organisation.id /*is_active: true*/ },
            "name",
            "id"
          )
        );
        let jt = await trackPromise(
          LookupService.getLookupByEntity(
            "QS_Job_Tag",
            { organisation_id: organisation.id /*is_active: true*/ },
            "name",
            "id"
          )
        );
        let dt = await trackPromise(
          LookupService.getLookupByEntity(
            "QS_Discount_Tag",
            { organisation_id: organisation.id /*is_active: true*/ },
            "name",
            "id"
          )
        );
        setIndustries(i);
        setJobPriorities(jp);
        setCustomerTypes(ct);
        setServiceTypes(st);
        setJobTags(jt);
        setDiscountTags(dt);
        setTemplates(environment.SENDGRID.templates);
      }        
    })();
  }, [organisation]);

  useEffect(() => {
    form.resetFields();
  }, [recordToEdit]);

  const handleSearch = async () => {
    let { data, status, message } = await trackPromise(
      DefaultService.Entity_List(ENTITY_API_KEY, {
        organisation_id: organisation.id,
      })
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
      record.organisation_id = organisation && organisation.id;
      const filters = JSON.parse(record.filters);
      record.postal_code = (filters && filters.postal_code) || [];
      record.customer_type = (filters && filters.customer_type) || [];
      record.job_tags = (filters && filters.job_tags) || [];
      record.discount_tag = (filters && filters.discount_tag) || [];
      record.job_priority = (filters && filters.job_priority) || [];
      record.industry = (filters && filters.industry) || [];
    } else {
      record.organisation_id = organisation && organisation.id;
      record.template_id = "d-9cb8bcda6e034bc5836fa8f0a0271811";
      record.postal_code = [];
      record.customer_type = [];
      record.job_tags = [];
      record.discount_tag = [];
      record.job_priority = [];
      record.industry = [];
    }

    setRecordToEdit(record);

    setShowEditForm(true);
  };

  const handleRunCampaign = async (item) => {
    //console.log("Edit Handler", item);
    let record = {};
    if (item.id) {
      record = { ...item };
      record.organisation_id = organisation.id;

      const filters = JSON.parse(record.filters);
      record.filters = {};
      if (filters && filters.postal_code && filters.postal_code.length > 0)
        record.filters.postal_code = filters.postal_code;
      if (filters && filters.customer_type && filters.customer_type.length > 0)
        record.filters.customer_type = filters.customer_type;
      if (filters && filters.job_tags && filters.job_tags.length > 0)
        record.filters.job_tags = filters.job_tags;
      if (filters && filters.discount_tag && filters.discount_tag.length > 0)
        record.filters.discount_tag = filters.discount_tag;
      if (filters && filters.job_priority && filters.job_priority.length > 0)
        record.filters.job_priority = filters.job_priority;
      if (filters && filters.industry && filters.industry.length > 0)
        record.filters.industry = filters.industry;
    } else {
      record.organisation_id = organisation.id;
    }

    setRecordToEdit(record);

    setShowRunCampaignForm(true);
  };

  const handleDelete = async (item) => {
    //console.log("Delete Handler", item);
    let { status, message } = await trackPromise(
      DefaultService.Entity_Delete(ENTITY_API_KEY, item.id)
    );
    notify(message, status);
    await handleSearch();
  };

  const handleCancel = () => {
    setShowEditForm(false);
    setShowRunCampaignForm(false);
  };

  const onFinish = async (values) => {
  
    let record = values;
    console.log("Form values", values);

    //SET SOME DEFAULT VALUES HERE

    record.filters = JSON.stringify({
      postal_code: record.postal_code,
      job_priority: record.job_priority,
      industry: record.industry,
      service_type: record.service_type,
      job_tags: record.job_tags,
      discount_tag: record.discount_tag,
      customer_type: record.customer_type,
    });
    console.log("Record to save", record);

    const { status, message } = record.id
      ? await trackPromise(DefaultService.Entity_Update(ENTITY_API_KEY, record))
      : await trackPromise(DefaultService.Entity_Add(ENTITY_API_KEY, record));

    notify(message, status);

    if (status) {
      // setRecordToEdit({});
      setShowEditForm(false);
      handleSearch();
    }
  };
  const onFinishFailed = async () => {
    notify("Please provide all the required input fields", false);
  };

  const columns = [
   
    {
      caption: t("general_name"),
      dataField: "name",
      dataType: "string",
      alignment: "left",
    },
    

    {
      caption: t("general_date_created"),
      dataField: "created",
      dataType: "date",
      format: "yyyy-MM-dd HH:mm",
      alignment: "left",
    },
   
    {
      caption: t("label_active"),
      dataField: "is_active",
      dataType: "string",
      alignment: "center",
    },
    {
      caption: t("general_run_campaign"),
      dataField: "id",
      alignment: "center",
      width: 150,
      cellRender: (item) => {
        return (
          <MailFilled
            className="text-large text-warning"
            onClick={() => handleRunCampaign(item.data)}
          />
        );
      },
    },
  ];

  const runCampaign = async (customers, mCampaignRecord) => {
    //let result =  await SendEmail(customers, mCampaignRecord.content, mCampaignRecord.template_id, organisation.name);
    let { status, message, data } = await trackPromise(
      DefaultService.POST("/sms_campaign/run", {
        customers: customers,
        contents: mCampaignRecord.content,
        organisation: organisation.name,
        organisation_id: organisation.id,
        id: mCampaignRecord.id,
      })
    );
    if (status) {
      alertify(
        `You just executed "${recordToEdit.name}" compaign successfully. SMS sent to ${customers.length} customers`,
        status,
        10000
      );
      setShowRunCampaignForm(false);
      setCurOrg({ ...organisation, credits: data.balance });
    } else {
      alertify(
        `System fails to execute "${recordToEdit.name}" compaign. SMS cannot be sent at this time. ${message}`,
        status,
        10000
      );
    }
  };
  return (
    <>
      <div className="flex mb-2">
        <PageTitle />
        <h3 className="push-right text-right">
          <Tooltip
            title={`Do you have more ${ENTITY_PLURAL}? Click here to add another`}
          >
            <Button
              className="bg-success"
              icon={<PlusCircleOutlined />}
              onClick={handleEdit}
            >
              {t("outbound_quotes_add_new_marketing_campaign")}
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
      <div className="flex">
        {showEditForm && (
          <Form_SMSCampaign
            form={form}
            showForm={showEditForm}
            recordToEdit={recordToEdit}
            handleCancel={handleCancel}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            ENTITY={ENTITY}
            data={{
              organisation,
              industries,
              jobPriorities,
              customerTypes,
              serviceTypes,
              jobTags,
              discountTags,
              templates,
            }}
          />
        )}
      </div>

      <div className="flex">
        {showRunCampaignForm && (
          <Form_RunSMSCampaign
            showForm={showRunCampaignForm}
            recordToEdit={recordToEdit}
            handleCancel={handleCancel}
            onFinish={runCampaign}
            data={{ organisation }}
          />
        )}
      </div>
    </>
  );
};

export default SMSMarketing;
